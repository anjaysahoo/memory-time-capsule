import { Hono } from 'hono';
import type { Env } from '../index.js';
import {
  exchangeCodeForToken,
  getAuthenticatedUser,
  createGitHubClient,
  createRepositorySecret,
} from '../lib/github.js';
import { initializeRepository } from '../lib/repo-init.js';
import { storeEncryptedToken, getEncryptedToken, storeJson, getJson, KV_KEYS } from '../utils/kv.js';
import { generateSecureToken } from '../utils/encryption.js';
import {
  exchangeCodeForGmailTokens,
  GmailTokens,
} from '../lib/gmail.js';

// User session data stored in KV
export interface UserSession {
  userId: string;
  githubUser: {
    id: number;
    login: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
  };
  repository: {
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
    clone_url: string;
  };
  githubConnected: boolean;
  gmailConnected: boolean;
  gmailEmail?: string;
  createdAt: string;
}

const auth = new Hono<{ Bindings: Env }>();

/**
 * Initiate GitHub OAuth flow
 * GET /api/auth/github/authorize
 */
auth.get('/github/authorize', (c) => {
  const clientId = c.env.GITHUB_OAUTH_CLIENT_ID;
  const redirectUri = `${c.env.WORKER_URL}/api/auth/github/callback`;
  
  // Generate state token for CSRF protection
  const state = generateSecureToken(16);
  
  // Build authorization URL
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'repo workflow');
  authUrl.searchParams.set('state', state);
  
  return c.json({
    authUrl: authUrl.toString(),
    state,
  });
});

/**
 * Handle GitHub OAuth callback
 * GET /api/auth/github/callback?code=xxx&state=xxx
 */
auth.get('/github/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  
  if (!code) {
    return c.redirect(`${c.env.FRONTEND_URL}/auth/callback?error=missing_code`);
  }
  
  try {
    // Exchange code for access token
    const accessToken = await exchangeCodeForToken(
      code,
      c.env.GITHUB_OAUTH_CLIENT_ID,
      c.env.GITHUB_OAUTH_CLIENT_SECRET
    );
    
    // Get user info
    const octokit = createGitHubClient(accessToken);
    const githubUser = await getAuthenticatedUser(octokit);
    
    // Initialize repository with required files
    const repo = await initializeRepository(
      accessToken,
      githubUser,
      c.env.GMAIL_CLIENT_ID,
      c.env.GMAIL_CLIENT_SECRET
    );
    
    // Generate user ID
    const userId = githubUser.id.toString();
    
    // Store encrypted token in KV
    await storeEncryptedToken(
      c.env.KV,
      `github_token:${userId}`,
      accessToken,
      c.env.ENCRYPTION_KEY
    );
    
    // Store user session
    const session: UserSession = {
      userId,
      githubUser: {
        id: githubUser.id,
        login: githubUser.login,
        name: githubUser.name,
        email: githubUser.email,
        avatar_url: githubUser.avatar_url,
      },
      repository: {
        name: repo.name,
        full_name: repo.full_name,
        private: repo.private,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
      },
      githubConnected: true,
      gmailConnected: false,
      createdAt: new Date().toISOString(),
    };
    
    await storeJson(c.env.KV, `user_session:${userId}`, session);
    
    // Redirect to frontend auth callback with success
    return c.redirect(`${c.env.FRONTEND_URL}/auth/callback?userId=${userId}&success=true`);
    
  } catch (error: any) {
    console.error('GitHub OAuth callback error:', error);
    return c.redirect(`${c.env.FRONTEND_URL}/auth/callback?error=oauth_failed&message=${encodeURIComponent(error.message)}`);
  }
});

/**
 * Get user session
 * GET /api/auth/session/:userId
 */
auth.get('/session/:userId', async (c) => {
  const userId = c.req.param('userId');
  
  const session = await getJson<UserSession>(c.env.KV, `user_session:${userId}`);
  
  if (!session) {
    return c.json({ error: 'Session not found' }, 404);
  }
  
  return c.json(session);
});

/**
 * Get GitHub access token (for internal use)
 * This endpoint should be protected in production
 * GET /api/auth/github/token/:userId
 */
auth.get('/github/token/:userId', async (c) => {
  const userId = c.req.param('userId');
  
  const token = await getEncryptedToken(
    c.env.KV,
    `github_token:${userId}`,
    c.env.ENCRYPTION_KEY
  );
  
  if (!token) {
    return c.json({ error: 'Token not found' }, 404);
  }
  
  return c.json({ token });
});

/**
 * Gmail OAuth authorization URL
 * GET /api/auth/gmail/authorize?userId=xxx
 */
auth.get('/gmail/authorize', (c) => {
  const userId = c.req.query('userId');
  
  if (!userId) {
    return c.json({ error: 'userId parameter required' }, 400);
  }
  
  const redirectUri = `${c.env.WORKER_URL}/api/auth/gmail/callback`;
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', c.env.GMAIL_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/gmail.send');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('state', userId); // Pass userId as state for callback

  return c.json({
    authUrl: authUrl.toString(),
  });
});

/**
 * Gmail OAuth callback endpoint
 * GET /api/auth/gmail/callback?code=xxx&state=xxx
 */
auth.get('/gmail/callback', async (c) => {
  try {
    const code = c.req.query('code');
    const userId = c.req.query('state'); // Pass userId as state

    if (!code) {
      return c.json({ error: 'Missing authorization code' }, 400);
    }

    if (!userId) {
      throw new Error('Missing userId in OAuth callback. Please try connecting GitHub first.');
    }

    // Exchange code for tokens
    const redirectUri = `${c.env.WORKER_URL}/api/auth/gmail/callback`;
    const tokens = await exchangeCodeForGmailTokens(
      code,
      c.env.GMAIL_CLIENT_ID,
      c.env.GMAIL_CLIENT_SECRET,
      redirectUri
    );

    // Get existing user session
    const session = await getJson<UserSession>(c.env.KV, KV_KEYS.userSession(userId));
    
    if (!session) {
      throw new Error('User session not found. Please connect GitHub first.');
    }

    // Store encrypted Gmail refresh token in KV
    await storeEncryptedToken(
      c.env.KV,
      KV_KEYS.gmailToken(session.userId),
      JSON.stringify(tokens),
      c.env.ENCRYPTION_KEY
    );

    // Store Gmail secrets in GitHub repository for Actions workflow
    // Note: This is optional and only needed for automated unlock workflow (Phase 8)
    const githubToken = await getEncryptedToken(
      c.env.KV,
      KV_KEYS.githubToken(session.userId),
      c.env.ENCRYPTION_KEY
    );

    if (githubToken) {
      try {
        const octokit = createGitHubClient(githubToken);
        const [owner, repo] = session.repository.full_name.split('/');

        await Promise.all([
          createRepositorySecret(octokit, owner, repo, 'GMAIL_REFRESH_TOKEN', tokens.refresh_token),
          createRepositorySecret(octokit, owner, repo, 'GMAIL_CLIENT_ID', c.env.GMAIL_CLIENT_ID),
          createRepositorySecret(octokit, owner, repo, 'GMAIL_CLIENT_SECRET', c.env.GMAIL_CLIENT_SECRET),
        ]);
      } catch (error) {
        // Ignore errors - secrets are only needed for automated unlock workflow
        console.warn('Failed to store GitHub secrets (non-critical):', error);
      }
    }

    // Update user session
    session.gmailConnected = true;
    session.gmailEmail = session.githubUser.email || undefined;
    await storeJson(c.env.KV, KV_KEYS.userSession(session.userId), session);

    // Log for debugging
    console.log('Gmail OAuth completed successfully for userId:', session.userId);
    console.log('Session updated with gmailConnected:', session.gmailConnected);

    // Redirect to frontend with success
    const frontendUrl = new URL(c.env.FRONTEND_URL);
    frontendUrl.pathname = '/auth/callback';
    frontendUrl.searchParams.set('userId', session.userId);
    frontendUrl.searchParams.set('gmailSuccess', 'true');

    return c.redirect(frontendUrl.toString());

  } catch (error: any) {
    console.error('Gmail OAuth error:', error);
    
    // Redirect to frontend with error
    const frontendUrl = new URL(c.env.FRONTEND_URL);
    frontendUrl.pathname = '/auth/callback';
    frontendUrl.searchParams.set('error', error.message || 'Gmail OAuth failed');

    return c.redirect(frontendUrl.toString());
  }
});

export default auth;



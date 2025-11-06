import { Hono } from 'hono';
import type { Env } from '../index.js';
import {
  exchangeCodeForToken,
  getAuthenticatedUser,
  createGitHubClient,
} from '../lib/github.js';
import { initializeRepository } from '../lib/repo-init.js';
import { storeEncryptedToken, getEncryptedToken, storeJson, getJson } from '../utils/kv.js';
import { generateSecureToken } from '../utils/encryption.js';

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
    return c.redirect(`${c.env.FRONTEND_URL}/?error=missing_code`);
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
    const repo = await initializeRepository(accessToken, githubUser);
    
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
      createdAt: new Date().toISOString(),
    };
    
    await storeJson(c.env.KV, `user_session:${userId}`, session);
    
    // Redirect to frontend with success
    return c.redirect(`${c.env.FRONTEND_URL}/?userId=${userId}&success=true`);
    
  } catch (error: any) {
    console.error('GitHub OAuth callback error:', error);
    return c.redirect(`${c.env.FRONTEND_URL}/?error=oauth_failed&message=${encodeURIComponent(error.message)}`);
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

export default auth;



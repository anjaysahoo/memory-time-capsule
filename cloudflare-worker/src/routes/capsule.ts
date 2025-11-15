import { Hono } from 'hono';
import { Env } from '../index.js';
import { createGitHubClient } from '../lib/github.js';
import { uploadToGitHubLFS, updateCapsulesJson, getStorageUsage } from '../lib/github-lfs.js';
import { getEncryptedToken, getJson, storeJson, KV_KEYS } from '../utils/kv.js';
import { generateSecureToken, sha256Hash } from '../utils/encryption.js';
import { Capsule, CapsuleMetadata, PhotoAttachment, CONTENT_LIMITS, ALLOWED_MIME_TYPES, MAX_PHOTOS } from '../types/capsule.js';
import { getValidAccessToken, sendEmail, GmailTokens } from '../lib/gmail.js';
import { generateCreationEmail } from '../lib/email-templates.js';
import {
  getAllCapsules,
  findCapsuleByTokenHash,
  getContentUrl,
  sanitizeCapsule,
} from '../lib/capsule-retrieval.js';
import { checkPinRateLimit, incrementPinAttempts } from '../utils/rate-limit.js';

const capsule = new Hono<{ Bindings: Env }>();

/**
 * Create new time capsule
 */
capsule.post('/create', async (c) => {
  try {
    // Parse form data
    const formData = await c.req.formData();
    const userId = formData.get('userId') as string;
    const metadata = JSON.parse(formData.get('metadata') as string) as CapsuleMetadata;
    const file = formData.get('file') as File | null;

    // Get all photo files (photo0, photo1, etc.)
    const photoFiles: File[] = [];
    for (let i = 0; i < MAX_PHOTOS; i++) {
      const photo = formData.get(`photo${i}`) as File | null;
      if (photo) photoFiles.push(photo);
    }

    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }

    // Get user session
    const session = await getJson<any>(c.env.KV, KV_KEYS.userSession(userId));
    if (!session) {
      return c.json({ error: 'User session not found' }, 404);
    }

    // Check GitHub connection (has repository)
    if (!session.repository || !session.repository.full_name) {
      return c.json({ error: 'GitHub must be connected' }, 400);
    }

    // Check Gmail connection
    if (!session.gmailConnected) {
      return c.json({ error: 'Gmail must be connected' }, 400);
    }

    // Validate metadata
    if (!metadata.title || !metadata.unlockAt || !metadata.recipientEmail) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Validate preview message
    if (metadata.previewMessage && metadata.previewMessage.length > CONTENT_LIMITS.previewMessage) {
      return c.json({ error: `Preview message exceeds ${CONTENT_LIMITS.previewMessage} characters` }, 400);
    }

    // Validate additional message
    if (metadata.additionalMessage && metadata.additionalMessage.length > CONTENT_LIMITS.additionalMessage) {
      return c.json({ error: `Additional message exceeds ${CONTENT_LIMITS.additionalMessage} characters` }, 400);
    }

    // Validate photos
    if (photoFiles.length > MAX_PHOTOS) {
      return c.json({ error: `Maximum ${MAX_PHOTOS} photos allowed` }, 400);
    }

    for (const photo of photoFiles) {
      if (photo.size > CONTENT_LIMITS.photo) {
        return c.json({ error: `Photo size exceeds ${Math.floor(CONTENT_LIMITS.photo / 1024 / 1024)}MB limit` }, 400);
      }
      const allowedTypes = ALLOWED_MIME_TYPES.photo;
      if (!allowedTypes.includes(photo.type)) {
        return c.json({ error: `Invalid photo type: ${photo.type}` }, 400);
      }
    }

    // Validate content
    if (metadata.contentType === 'text') {
      if (!metadata.textContent) {
        return c.json({ error: 'Text content required' }, 400);
      }
      if (metadata.textContent.length > CONTENT_LIMITS.text) {
        return c.json({ error: `Text content exceeds ${CONTENT_LIMITS.text} characters` }, 400);
      }
    } else {
      if (!file) {
        return c.json({ error: 'File required for non-text capsules' }, 400);
      }

      // Validate file size
      const limit = CONTENT_LIMITS[metadata.contentType];
      if (file.size > limit) {
        return c.json({ error: `File size exceeds ${Math.floor(limit / 1024 / 1024)}MB limit` }, 400);
      }

      // Validate MIME type
      const allowedTypes = ALLOWED_MIME_TYPES[metadata.contentType];
      if (!allowedTypes.includes(file.type)) {
        return c.json({ error: `Invalid file type: ${file.type}` }, 400);
      }
    }

    // Get GitHub token
    const githubToken = await getEncryptedToken(
      c.env.KV,
      KV_KEYS.githubToken(userId),
      c.env.ENCRYPTION_KEY
    );

    if (!githubToken) {
      return c.json({ error: 'GitHub token not found' }, 404);
    }

    // Check storage usage
    const octokit = createGitHubClient(githubToken);
    const [owner, repo] = session.repository.full_name.split('/');
    const storageUsed = await getStorageUsage(octokit, owner, repo);
    const storageLimit = 1024 * 1024 * 1024; // 1GB

    const totalFileSize = (file?.size || 0) + photoFiles.reduce((sum, p) => sum + p.size, 0);
    if (totalFileSize > 0 && storageUsed + totalFileSize > storageLimit) {
      return c.json({
        error: 'Storage limit exceeded',
        storageUsed,
        storageLimit,
      }, 400);
    }

    // Generate capsule ID and tokens
    const capsuleId = crypto.randomUUID();
    const magicToken = generateSecureToken(16); // 128-bit token
    const magicTokenHash = await sha256Hash(magicToken);

    // Determine file path and upload if needed
    let filePath: string | undefined;
    let fileSize: number | undefined;

    if (file) {
      const extension = file.name.split('.').pop();
      filePath = `capsules/${capsuleId}.${extension}`;
      fileSize = file.size;

      // Upload to GitHub LFS
      const fileContent = await file.arrayBuffer();
      await uploadToGitHubLFS(octokit, owner, repo, filePath, fileContent);
    }

    // Upload photos if present
    const photos: PhotoAttachment[] = [];
    for (let i = 0; i < photoFiles.length; i++) {
      const photo = photoFiles[i];
      const photoId = crypto.randomUUID();
      const extension = photo.name.split('.').pop();
      const photoPath = `capsules/${capsuleId}/photo-${i}.${extension}`;

      const photoContent = await photo.arrayBuffer();
      await uploadToGitHubLFS(octokit, owner, repo, photoPath, photoContent);

      photos.push({
        id: photoId,
        filePath: photoPath,
        fileSize: photo.size,
        mimeType: photo.type,
      });
    }

    // Create capsule object
    const newCapsule: Capsule = {
      id: capsuleId,
      title: metadata.title,
      unlockAt: metadata.unlockAt,
      recipientEmail: metadata.recipientEmail,
      recipientName: metadata.recipientName,
      senderName: session.githubUser.name || session.githubUser.login,
      senderEmail: session.gmailEmail || session.githubUser.email || 'noreply@timecapsule.app',
      contentType: metadata.contentType,
      filePath,
      fileSize,
      textContent: metadata.textContent,
      previewMessage: metadata.previewMessage,
      additionalMessage: metadata.additionalMessage,
      photos: photos.length > 0 ? photos : undefined,
      magicToken,
      magicTokenHash,
      createdAt: Math.floor(Date.now() / 1000),
      creationEmailSent: false,
      unlockEmailSent: false,
      whatsappSharedAtCreation: false,
    };

    // Update capsules.json
    await updateCapsulesJson(octokit, owner, repo, newCapsule);

    // Store token mapping in KV
    await storeJson(c.env.KV, KV_KEYS.tokenToRepo(magicTokenHash), {
      userId,
      repoFullName: session.repository.full_name,
      capsuleId,
    });

    // Send creation email
    const gmailTokensJson = await getEncryptedToken(
      c.env.KV,
      KV_KEYS.gmailToken(userId),
      c.env.ENCRYPTION_KEY
    );

    if (gmailTokensJson) {
      const gmailTokens: GmailTokens = JSON.parse(gmailTokensJson);
      const accessToken = await getValidAccessToken(
        gmailTokens,
        c.env.GMAIL_CLIENT_ID,
        c.env.GMAIL_CLIENT_SECRET
      );

      const unlockDate = new Date(metadata.unlockAt * 1000).toLocaleDateString();
      const magicLink = `${c.env.FRONTEND_URL}/open?t=${magicToken}`;

      const emailData = {
        recipientEmail: metadata.recipientEmail,
        recipientName: metadata.recipientName,
        senderName: newCapsule.senderName,
        senderEmail: newCapsule.senderEmail,
        capsuleTitle: metadata.title,
        unlockDate,
        magicLink,
        previewMessage: metadata.previewMessage,
      };

      const { html, text } = generateCreationEmail(emailData);

      await sendEmail(
        metadata.recipientEmail,
        `🎁 Time capsule from ${newCapsule.senderName}`,
        html,
        text,
        accessToken
      );

      // Mark email as sent
      newCapsule.creationEmailSent = true;
    }

    // Generate WhatsApp link
    const whatsappMessage = encodeURIComponent(
      `Hi! I sent you a time capsule that unlocks on ${new Date(metadata.unlockAt * 1000).toLocaleDateString()}. ` +
      `Check your email or view it here: ${c.env.FRONTEND_URL}/open?t=${magicToken}`
    );
    const whatsappLink = `https://wa.me/?text=${whatsappMessage}`;

    return c.json({
      success: true,
      capsule: {
        id: capsuleId,
        title: metadata.title,
        unlockAt: metadata.unlockAt,
        magicLink: `${c.env.FRONTEND_URL}/open?t=${magicToken}`,
        whatsappLink,
      },
    });

  } catch (error: any) {
    console.error('Capsule creation error:', error);
    return c.json({
      error: 'Failed to create capsule',
      message: error.message,
    }, 500);
  }
});

/**
 * Get capsule by magic token
 * Returns metadata only (no content URL until PIN verified)
 */
capsule.get('/view/:token', async (c) => {
  try {
    const token = c.req.param('token');
    
    if (!token) {
      return c.json({ error: 'Missing token' }, 400);
    }

    // Hash the token to lookup
    const tokenHash = await sha256Hash(token);

    // Get token mapping from KV
    const mapping = await getJson<any>(c.env.KV, KV_KEYS.tokenToRepo(tokenHash));
    
    if (!mapping) {
      return c.json({ error: 'Capsule not found' }, 404);
    }

    // Get GitHub token
    const githubToken = await getEncryptedToken(
      c.env.KV,
      KV_KEYS.githubToken(mapping.userId),
      c.env.ENCRYPTION_KEY
    );

    if (!githubToken) {
      return c.json({ error: 'Access token not found' }, 500);
    }

    // Fetch capsule from repository
    const octokit = createGitHubClient(githubToken);
    const [owner, repo] = mapping.repoFullName.split('/');
    const capsule = await findCapsuleByTokenHash(octokit, owner, repo, tokenHash);

    if (!capsule) {
      return c.json({ error: 'Capsule not found in repository' }, 404);
    }

    // Check unlock status
    const now = Math.floor(Date.now() / 1000);
    const isUnlocked = capsule.unlockAt <= now && capsule.unlockEmailSent;
    const isPending = capsule.unlockAt <= now && !capsule.unlockEmailSent;

    // Check rate limiting for unlocked capsules
    let rateLimitInfo = null;
    if (isUnlocked) {
      const rateLimit = await checkPinRateLimit(c.env.KV, tokenHash);
      rateLimitInfo = {
        remaining: rateLimit.remaining,
        exceeded: rateLimit.exceeded,
      };
    }

    return c.json({
      capsule: sanitizeCapsule(capsule),
      status: {
        unlocked: isUnlocked,
        pending: isPending,
        requiresPin: isUnlocked && !!capsule.pin,
      },
      rateLimit: rateLimitInfo,
    });

  } catch (error: any) {
    console.error('Capsule retrieval error:', error);
    return c.json({
      error: 'Failed to retrieve capsule',
      message: error.message,
    }, 500);
  }
});

/**
 * Verify PIN and return content access URL
 */
capsule.post('/view/:token/verify-pin', async (c) => {
  try {
    const token = c.req.param('token');
    const { pin } = await c.req.json();

    if (!token || !pin) {
      return c.json({ error: 'Missing token or PIN' }, 400);
    }

    // Validate PIN format (4 digits)
    if (!/^\d{4}$/.test(pin)) {
      return c.json({ error: 'Invalid PIN format (must be 4 digits)' }, 400);
    }

    // Hash the token to lookup
    const tokenHash = await sha256Hash(token);

    // Check rate limiting
    const rateLimit = await checkPinRateLimit(c.env.KV, tokenHash);
    
    if (rateLimit.exceeded) {
      return c.json({
        error: 'Too many PIN attempts',
        message: 'Please try again in 1 hour',
        remaining: 0,
      }, 429);
    }

    // Get token mapping from KV
    const mapping = await getJson<any>(c.env.KV, KV_KEYS.tokenToRepo(tokenHash));
    
    if (!mapping) {
      return c.json({ error: 'Capsule not found' }, 404);
    }

    // Get GitHub token
    const githubToken = await getEncryptedToken(
      c.env.KV,
      KV_KEYS.githubToken(mapping.userId),
      c.env.ENCRYPTION_KEY
    );

    if (!githubToken) {
      return c.json({ error: 'Access token not found' }, 500);
    }

    // Fetch capsule from repository
    const octokit = createGitHubClient(githubToken);
    const [owner, repo] = mapping.repoFullName.split('/');
    const capsule = await findCapsuleByTokenHash(octokit, owner, repo, tokenHash);

    if (!capsule) {
      return c.json({ error: 'Capsule not found' }, 404);
    }

    // Verify capsule is unlocked
    const now = Math.floor(Date.now() / 1000);
    if (capsule.unlockAt > now || !capsule.unlockEmailSent) {
      return c.json({ error: 'Capsule not yet unlocked' }, 403);
    }

    // Hash provided PIN and compare
    const pinHash = await sha256Hash(pin);
    
    if (pinHash !== capsule.pinHash) {
      // Increment failed attempt counter
      await incrementPinAttempts(c.env.KV, tokenHash);
      const newRateLimit = await checkPinRateLimit(c.env.KV, tokenHash);

      return c.json({
        error: 'Incorrect PIN',
        remaining: newRateLimit.remaining,
      }, 401);
    }

    // PIN verified! Generate content URL
    let contentUrl = null;
    if (capsule.filePath) {
      contentUrl = getContentUrl(c.env.WORKER_URL, tokenHash);
    }

    // Generate photo URLs
    const photoUrls: string[] = [];
    if (capsule.photos && capsule.photos.length > 0) {
      for (let i = 0; i < capsule.photos.length; i++) {
        photoUrls.push(`${c.env.WORKER_URL}/api/capsule/photo/${tokenHash}/${i}`);
      }
    }

    // Update viewed timestamp (TODO: implement updateCapsuleMetadata helper)
    // For now, just return the data

    return c.json({
      success: true,
      capsule: {
        ...sanitizeCapsule(capsule, true),
        textContent: capsule.textContent, // Include text content after verification
      },
      contentUrl,
      photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
    });

  } catch (error: any) {
    console.error('PIN verification error:', error);
    return c.json({
      error: 'PIN verification failed',
      message: error.message,
    }, 500);
  }
});

/**
 * Proxy endpoint to fetch capsule content from GitHub
 * This handles authentication with GitHub's raw content API
 */
capsule.get('/content/:tokenHash', async (c) => {
  try {
    const tokenHash = c.req.param('tokenHash');

    // Get token mapping from KV
    const mapping = await getJson<any>(c.env.KV, KV_KEYS.tokenToRepo(tokenHash));
    
    if (!mapping) {
      return c.json({ error: 'Content not found' }, 404);
    }

    // Get GitHub token
    const githubToken = await getEncryptedToken(
      c.env.KV,
      KV_KEYS.githubToken(mapping.userId),
      c.env.ENCRYPTION_KEY
    );

    if (!githubToken) {
      return c.json({ error: 'Access token not found' }, 500);
    }

    // Fetch capsule from repository
    const octokit = createGitHubClient(githubToken);
    const [owner, repo] = mapping.repoFullName.split('/');
    const capsule = await findCapsuleByTokenHash(octokit, owner, repo, tokenHash);

    if (!capsule || !capsule.filePath) {
      return c.json({ error: 'Content not found' }, 404);
    }

    // Verify capsule is unlocked
    const now = Math.floor(Date.now() / 1000);
    if (capsule.unlockAt > now || !capsule.unlockEmailSent) {
      return c.json({ error: 'Content not yet available' }, 403);
    }

    // Fetch content from GitHub with proper authentication
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${capsule.filePath}`;
    const response = await fetch(rawUrl, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3.raw',
      },
    });

    if (!response.ok) {
      console.error('GitHub content fetch failed:', response.status, response.statusText);
      return c.json({ error: 'Failed to fetch content from repository' }, 500);
    }

    // Determine content type from file extension
    const extension = capsule.filePath.split('.').pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mp3': 'audio/mpeg',
      'm4a': 'audio/mp4',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
    };
    const contentType = contentTypeMap[extension || ''] || 'application/octet-stream';

    // Stream the content back to client
    return new Response(response.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${capsule.id}.${extension}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });

  } catch (error: any) {
    console.error('Content proxy error:', error);
    return c.json({
      error: 'Failed to fetch content',
      message: error.message,
    }, 500);
  }
});

/**
 * Proxy endpoint to fetch individual photo from GitHub
 */
capsule.get('/photo/:tokenHash/:photoIndex', async (c) => {
  try {
    const tokenHash = c.req.param('tokenHash');
    const photoIndex = parseInt(c.req.param('photoIndex'), 10);

    if (isNaN(photoIndex) || photoIndex < 0) {
      return c.json({ error: 'Invalid photo index' }, 400);
    }

    // Get token mapping from KV
    const mapping = await getJson<any>(c.env.KV, KV_KEYS.tokenToRepo(tokenHash));

    if (!mapping) {
      return c.json({ error: 'Photo not found' }, 404);
    }

    // Get GitHub token
    const githubToken = await getEncryptedToken(
      c.env.KV,
      KV_KEYS.githubToken(mapping.userId),
      c.env.ENCRYPTION_KEY
    );

    if (!githubToken) {
      return c.json({ error: 'Access token not found' }, 500);
    }

    // Fetch capsule from repository
    const octokit = createGitHubClient(githubToken);
    const [owner, repo] = mapping.repoFullName.split('/');
    const capsule = await findCapsuleByTokenHash(octokit, owner, repo, tokenHash);

    if (!capsule || !capsule.photos || photoIndex >= capsule.photos.length) {
      return c.json({ error: 'Photo not found' }, 404);
    }

    // Verify capsule is unlocked
    const now = Math.floor(Date.now() / 1000);
    if (capsule.unlockAt > now || !capsule.unlockEmailSent) {
      return c.json({ error: 'Photo not yet available' }, 403);
    }

    const photo = capsule.photos[photoIndex];

    // Fetch photo from GitHub
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${photo.filePath}`;
    const response = await fetch(rawUrl, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3.raw',
      },
    });

    if (!response.ok) {
      console.error('GitHub photo fetch failed:', response.status, response.statusText);
      return c.json({ error: 'Failed to fetch photo from repository' }, 500);
    }

    // Stream the photo back to client
    return new Response(response.body, {
      headers: {
        'Content-Type': photo.mimeType,
        'Content-Disposition': `inline; filename="${photo.id}.${photo.filePath.split('.').pop()}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });

  } catch (error: any) {
    console.error('Photo proxy error:', error);
    return c.json({
      error: 'Failed to fetch photo',
      message: error.message,
    }, 500);
  }
});

/**
 * Get user's dashboard data (all capsules + storage)
 */
capsule.get('/dashboard/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');

    // Get user session
    const session = await getJson<any>(c.env.KV, KV_KEYS.userSession(userId));
    if (!session) {
      return c.json({ error: 'User session not found' }, 404);
    }

    // Get GitHub token
    const githubToken = await getEncryptedToken(
      c.env.KV,
      KV_KEYS.githubToken(userId),
      c.env.ENCRYPTION_KEY
    );

    if (!githubToken) {
      return c.json({ error: 'GitHub token not found' }, 404);
    }

    // Fetch all capsules from repository
    const octokit = createGitHubClient(githubToken);
    const [owner, repo] = session.repository.full_name.split('/');
    const capsules = await getAllCapsules(octokit, owner, repo);

    // Get storage usage
    const storageUsed = await getStorageUsage(octokit, owner, repo);
    const storageLimit = 1024 * 1024 * 1024; // 1GB

    // Categorize capsules
    const now = Math.floor(Date.now() / 1000);
    const categorized = {
      pending: capsules.filter(c => c.unlockAt > now),
      unlocked: capsules.filter(c => c.unlockAt <= now && c.unlockEmailSent),
      failed: capsules.filter(c => c.unlockAt <= now && !c.unlockEmailSent),
    };

    return c.json({
      user: {
        id: userId,
        name: session.githubUser.name || session.githubUser.login,
        email: session.githubUser.email,
        avatar: session.githubUser.avatar_url,
      },
      storage: {
        used: storageUsed,
        limit: storageLimit,
        percentage: Math.round((storageUsed / storageLimit) * 100),
      },
      capsules: {
        total: capsules.length,
        pending: categorized.pending.length,
        unlocked: categorized.unlocked.length,
        failed: categorized.failed.length,
      },
      capsuleList: capsules.map(c => sanitizeCapsule(c)),
      repository: {
        name: session.repository.name,
        url: session.repository.html_url,
      },
    });

  } catch (error: any) {
    console.error('Dashboard fetch error:', error);
    return c.json({
      error: 'Failed to fetch dashboard data',
      message: error.message,
    }, 500);
  }
});

export default capsule;


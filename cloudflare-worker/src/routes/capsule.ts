import { Hono } from 'hono';
import { Env } from '../index.js';
import { createGitHubClient } from '../lib/github.js';
import { uploadToGitHubLFS, updateCapsulesJson, getStorageUsage } from '../lib/github-lfs.js';
import { getEncryptedToken, getJson, storeJson, KV_KEYS } from '../utils/kv.js';
import { generateSecureToken, sha256Hash } from '../utils/encryption.js';
import { Capsule, CapsuleMetadata, CONTENT_LIMITS, ALLOWED_MIME_TYPES } from '../types/capsule.js';
import { getValidAccessToken, sendEmail, GmailTokens } from '../lib/gmail.js';
import { generateCreationEmail } from '../lib/email-templates.js';

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

    if (file && storageUsed + file.size > storageLimit) {
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

    // Create capsule object
    const newCapsule: Capsule = {
      id: capsuleId,
      title: metadata.title,
      unlockAt: metadata.unlockAt,
      recipientEmail: metadata.recipientEmail,
      recipientName: metadata.recipientName,
      senderName: session.githubUser.name || session.githubUser.login,
      senderEmail: session.githubUser.email || 'noreply@timecapsule.app',
      contentType: metadata.contentType,
      filePath,
      fileSize,
      textContent: metadata.textContent,
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

export default capsule;


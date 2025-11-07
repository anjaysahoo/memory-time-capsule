import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Type definitions for environment bindings
export interface Env {
  KV: KVNamespace;
  ENCRYPTION_KEY: string;
  GITHUB_OAUTH_CLIENT_ID: string;
  GITHUB_OAUTH_CLIENT_SECRET: string;
  GMAIL_CLIENT_ID: string;
  GMAIL_CLIENT_SECRET: string;
  FRONTEND_URL: string;
  WORKER_URL: string;
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('/*', cors({
  origin: (origin) => origin, // Will be restricted to FRONTEND_URL in production
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Import routes
import auth from './routes/auth.js';

// Mount auth routes
app.route('/api/auth', auth);

// API routes (will be added in subsequent phases)
app.get('/api', (c) => {
  return c.json({
    message: 'Memory Time Capsule API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      capsule: '/api/capsule/*',
      dashboard: '/api/dashboard/*',
    },
  });
});

// Test encryption/decryption
app.post('/test/encryption', async (c) => {
  try {
    const { plaintext } = await c.req.json();
    
    if (!plaintext) {
      return c.json({ error: 'Missing plaintext field' }, 400);
    }

    const { encrypt, decrypt } = await import('./utils/encryption.js');
    
    // Encrypt
    const encrypted = await encrypt(plaintext, c.env.ENCRYPTION_KEY);
    
    // Decrypt
    const decrypted = await decrypt(encrypted, c.env.ENCRYPTION_KEY);
    
    // Verify
    const success = plaintext === decrypted;

    return c.json({
      success,
      encrypted,
      decrypted,
      match: success,
    });
  } catch (error: any) {
    return c.json({
      error: 'Encryption test failed',
      message: error.message,
    }, 500);
  }
});

// Test KV storage
app.post('/test/kv', async (c) => {
  try {
    const { key, value, encrypted } = await c.req.json();
    
    if (!key || !value) {
      return c.json({ error: 'Missing key or value fields' }, 400);
    }

    if (encrypted) {
      // Test encrypted storage
      const { storeEncryptedToken, getEncryptedToken } = await import('./utils/kv.js');
      
      await storeEncryptedToken(c.env.KV, key, value, c.env.ENCRYPTION_KEY);
      const retrieved = await getEncryptedToken(c.env.KV, key, c.env.ENCRYPTION_KEY);
      
      return c.json({
        success: value === retrieved,
        stored: value,
        retrieved,
      });
    } else {
      // Test plain JSON storage
      const { storeJson, getJson } = await import('./utils/kv.js');
      
      await storeJson(c.env.KV, key, { value });
      const retrieved = await getJson<{ value: string }>(c.env.KV, key);
      
      return c.json({
        success: retrieved?.value === value,
        stored: value,
        retrieved: retrieved?.value,
      });
    }
  } catch (error: any) {
    return c.json({
      error: 'KV test failed',
      message: error.message,
    }, 500);
  }
});

// Test additional crypto utilities
app.get('/test/crypto-utils', async (c) => {
  try {
    const { encrypt, decrypt, sha256Hash, generateSecureToken } = await import('./utils/encryption.js');
    
    // Test 3: Decryption with wrong key fails gracefully
    const testData = "test_secret_data";
    const encrypted = await encrypt(testData, c.env.ENCRYPTION_KEY);
    
    // Generate a fake wrong key (64 hex chars)
    const wrongKey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    
    let wrongKeyTest = {
      success: false,
      error: null as string | null,
    };
    
    try {
      await decrypt(encrypted, wrongKey);
      wrongKeyTest.success = false;
      wrongKeyTest.error = "Decryption should have failed but didn't!";
    } catch (error: any) {
      // Expected to fail
      wrongKeyTest.success = true;
      wrongKeyTest.error = error.message;
    }
    
    // Test 5: Token generation produces 22-character base64url strings
    const token = generateSecureToken(16); // 16 bytes
    const tokenTest = {
      token,
      length: token.length,
      expectedLength: 22,
      success: token.length === 22,
      isBase64Url: /^[A-Za-z0-9_-]+$/.test(token),
    };
    
    // Test 6: SHA-256 hashes are 64 hex characters
    const hash = await sha256Hash("test_data_to_hash");
    const hashTest = {
      hash,
      length: hash.length,
      expectedLength: 64,
      success: hash.length === 64,
      isHex: /^[0-9a-f]+$/.test(hash),
    };
    
    return c.json({
      wrongKeyDecryptionTest: wrongKeyTest,
      tokenGenerationTest: tokenTest,
      sha256HashTest: hashTest,
      allTestsPassed: wrongKeyTest.success && tokenTest.success && hashTest.success,
    });
  } catch (error: any) {
    return c.json({
      error: 'Crypto utils test failed',
      message: error.message,
    }, 500);
  }
});

// Test Gmail token refresh
app.post('/test/gmail-refresh', async (c) => {
  try {
    const { userId } = await c.req.json();
    
    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }

    const { getEncryptedToken, storeEncryptedToken, KV_KEYS } = await import('./utils/kv.js');
    const { getValidAccessToken } = await import('./lib/gmail.js');
    type GmailTokens = import('./lib/gmail.js').GmailTokens;

    // Get current tokens
    const tokensJson = await getEncryptedToken(
      c.env.KV,
      KV_KEYS.gmailToken(userId),
      c.env.ENCRYPTION_KEY
    );

    if (!tokensJson) {
      return c.json({ error: 'Gmail not connected for this user' }, 404);
    }

    const tokens: GmailTokens = JSON.parse(tokensJson);
    const originalExpiry = tokens.expiry_date;
    const originalAccessToken = tokens.access_token;

    // Force token expiry by setting expiry_date to the past
    tokens.expiry_date = Date.now() - 1000; // 1 second ago
    
    // Store the modified tokens temporarily
    await storeEncryptedToken(
      c.env.KV,
      KV_KEYS.gmailToken(userId),
      JSON.stringify(tokens),
      c.env.ENCRYPTION_KEY
    );

    // Now try to get a valid token - this should trigger refresh
    const newAccessToken = await getValidAccessToken(
      tokens,
      c.env.GMAIL_CLIENT_ID,
      c.env.GMAIL_CLIENT_SECRET
    );

    // Verify we got a new token
    const tokenRefreshed = newAccessToken !== originalAccessToken;

    return c.json({
      success: true,
      tokenRefreshed,
      originalExpiry: new Date(originalExpiry).toISOString(),
      wasExpired: true,
      message: tokenRefreshed 
        ? 'Token successfully refreshed!' 
        : 'Token was already valid (no refresh needed)',
    });

  } catch (error: any) {
    return c.json({
      error: 'Gmail token refresh test failed',
      message: error.message,
    }, 500);
  }
});

// Test email sending
app.post('/test/email', async (c) => {
  try {
    const { userId, recipientEmail } = await c.req.json();
    
    if (!userId || !recipientEmail) {
      return c.json({ error: 'Missing userId or recipientEmail' }, 400);
    }

    const { getEncryptedToken } = await import('./utils/kv.js');
    const { KV_KEYS } = await import('./utils/kv.js');
    const { getValidAccessToken, sendEmail } = await import('./lib/gmail.js');
    const { generateCreationEmail } = await import('./lib/email-templates.js');
    type GmailTokens = import('./lib/gmail.js').GmailTokens;

    // Get Gmail tokens
    const tokensJson = await getEncryptedToken(
      c.env.KV,
      KV_KEYS.gmailToken(userId),
      c.env.ENCRYPTION_KEY
    );

    if (!tokensJson) {
      return c.json({ error: 'Gmail not connected for this user' }, 404);
    }

    const tokens: GmailTokens = JSON.parse(tokensJson);

    // Get valid access token
    const accessToken = await getValidAccessToken(
      tokens,
      c.env.GMAIL_CLIENT_ID,
      c.env.GMAIL_CLIENT_SECRET
    );

    // Generate test email
    const emailData = {
      recipientEmail,
      senderName: 'Test User',
      senderEmail: 'test@example.com',
      capsuleTitle: 'Test Time Capsule',
      unlockDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
      magicLink: `${c.env.WORKER_URL}/test`,
    };

    const { html, text } = generateCreationEmail(emailData);

    // Send email
    await sendEmail(
      recipientEmail,
      `🎁 Test: Time Capsule from ${emailData.senderName}`,
      html,
      text,
      accessToken
    );

    return c.json({
      success: true,
      message: `Test email sent to ${recipientEmail}`,
    });

  } catch (error: any) {
    return c.json({
      error: 'Email test failed',
      message: error.message,
    }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    path: c.req.path,
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Worker error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message,
  }, 500);
});

export default app;


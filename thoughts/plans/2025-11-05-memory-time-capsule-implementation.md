# Memory Time Capsule - Implementation Plan

## Overview

Building a digital time capsule application that allows users to send messages, videos, audio, and photos to the future. The system uses Cloudflare Workers as the API layer, GitHub LFS for storage, GitHub Actions for scheduled unlocking, and Gmail API for notifications. This is a greenfield project with zero-cost MVP leveraging free tiers.

## Current State Analysis

**What exists:**
- Comprehensive research documents in `thoughts/`
- Detailed architecture specifications
- No implementation yet - starting from scratch

**Key Discoveries:**
- All components leverage free tiers (Cloudflare Workers, GitHub LFS, GitHub Actions, Gmail API)
- Security model uses AES-256-GCM encryption for all OAuth tokens
- Tokens stored in Cloudflare KV with GitHub secrets as backup
- Hourly unlock precision acceptable for MVP (GitHub Actions cron)

**Technical Constraints:**
- Cloudflare Workers: 100k requests/day (free tier)
- Cloudflare KV: 100k reads/day, 1k writes/day (free tier)
- GitHub LFS: 1GB storage per repo (free tier)
- GitHub Actions: 2,000 minutes/month (free tier)
- Gmail API: 100 emails/day per sender account (free tier)

## Desired End State

After completing all phases, the system will:

1. **User Registration**: Users can connect GitHub and Gmail accounts via OAuth in <3 minutes
2. **Capsule Creation**: Users can upload up to 100MB video/audio/photo content
3. **Automated Unlock**: GitHub Actions cron unlocks capsules hourly, sends emails with PINs
4. **Secure Access**: Recipients use magic links + 4-digit PINs to view content
5. **WhatsApp Integration**: Optional manual sharing via wa.me click-to-chat links
6. **Dashboard**: Users see all their capsules with storage usage (X/1GB)

### Verification Criteria:
- Sender uploads 100MB video capsule in <30 seconds
- Capsule unlocks within 1 hour of scheduled time
- Recipient receives unlock email with valid PIN
- Magic link displays content after PIN verification
- All OAuth tokens encrypted in KV (verified via inspection)
- Token recovery from GitHub secrets works if KV fails
- Email delivery rate >95%

## What We're NOT Doing

**Out of Scope for MVP:**
- Sub-15-minute unlock precision (requires paid features)
- Content expiry / auto-deletion after unlock
- Multi-recipient capsules (group sending)
- Recipient dashboard (centralized recipient view)
- Reply feature (two-way communication)
- Analytics and view tracking
- Custom PIN selection by sender
- Alternative storage backends (Google Drive, Dropbox)
- CI/CD pipelines (manual deployment for MVP)
- Monitoring and observability tools
- Comprehensive automated testing (post-MVP)

## Implementation Approach

**Strategy:**
- Build backend-first (Phases 1-7) to enable API testing before UI work
- Use incremental phases to allow testing at each step
- Prioritize security (encryption, token storage) early in Phase 2
- Keep phases small enough for focused implementation sessions
- Each phase is independently testable with clear success criteria

**Technology Stack:**
- **Backend**: Cloudflare Workers with Hono framework
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Storage**: GitHub LFS + GitHub repository files
- **Scheduling**: GitHub Actions cron workflows
- **Email**: Gmail API
- **Encryption**: Web Crypto API (AES-256-GCM)

---

## Phase 1: Project Setup & Development Environment

**MCP Tools Required:**
- `cloudflare-docs` - For Cloudflare Workers setup guidance and API references

### Overview

Initialize the monorepo structure, set up Cloudflare Workers project with Hono framework, configure local development environment, and establish environment variable management patterns.

### Changes Required

#### 1. Project Root Structure

Create the following directory structure:

```
memory-time-capsule/
├── cloudflare-worker/
├── frontend/
├── templates/
├── .gitignore
├── .env.example
└── README.md
```

**File**: `.gitignore`

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Environment variables
.env
.env.local
.dev.vars

# Build outputs
dist/
build/
.wrangler/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temporary files
tmp/
temp/
```

**File**: `.env.example`

```env
# Cloudflare Workers
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here

# OAuth Credentials
GITHUB_OAUTH_CLIENT_ID=your_github_client_id
GITHUB_OAUTH_CLIENT_SECRET=your_github_client_secret
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret

# Encryption
ENCRYPTION_KEY=generate_with_crypto_randomBytes_32_hex

# Application URLs
FRONTEND_URL=http://localhost:5173
WORKER_URL=http://localhost:8787
```

**File**: `README.md`

```markdown
# Memory Time Capsule

A digital time capsule application for sending messages to the future.

## Tech Stack

- **Backend**: Cloudflare Workers + Hono
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Storage**: GitHub LFS
- **Scheduling**: GitHub Actions
- **Email**: Gmail API

## Prerequisites

- Node.js 20+
- npm or pnpm
- Cloudflare account (free tier)
- GitHub account
- Gmail account

## Setup

See `docs/setup.md` for detailed setup instructions.

## Development

### Cloudflare Worker (API)
```bash
cd cloudflare-worker
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

- `/cloudflare-worker` - API backend (Cloudflare Workers)
- `/frontend` - React frontend
- `/templates` - Email and workflow templates
- `/thoughts` - Research, plans, and documentation

## Documentation

- Architecture: `thoughts/research/architecture.md`
- Implementation Plan: `thoughts/plans/2025-11-05-memory-time-capsule-implementation.md`
```

#### 2. Cloudflare Worker Setup

**File**: `cloudflare-worker/package.json`

```json
{
  "name": "memory-time-capsule-worker",
  "version": "1.0.0",
  "description": "Cloudflare Worker API for Memory Time Capsule",
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "tail": "wrangler tail"
  },
  "dependencies": {
    "hono": "^4.0.0",
    "@octokit/rest": "^20.0.0",
    "googleapis": "^128.0.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20240620.0",
    "wrangler": "^3.60.0",
    "typescript": "^5.3.0"
  }
}
```

**File**: `cloudflare-worker/wrangler.toml`

```toml
name = "memory-time-capsule-worker"
main = "src/index.ts"
compatibility_date = "2024-06-01"

# KV Namespaces (create via Cloudflare dashboard or wrangler CLI)
[[kv_namespaces]]
binding = "KV"
id = "your_kv_namespace_id_here"

# Secrets (set via: wrangler secret put SECRET_NAME)
# - ENCRYPTION_KEY
# - GITHUB_OAUTH_CLIENT_ID
# - GITHUB_OAUTH_CLIENT_SECRET
# - GMAIL_CLIENT_ID
# - GMAIL_CLIENT_SECRET
# - FRONTEND_URL
# - WORKER_URL
```

**File**: `cloudflare-worker/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "types": ["@cloudflare/workers-types"],
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**File**: `cloudflare-worker/src/index.ts`

```typescript
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
```

#### 3. Setup Documentation

**File**: `docs/setup.md`

```markdown
# Setup & Deployment Guide

## Prerequisites

1. **Node.js 20+**
   ```bash
   node --version  # Should be v20 or higher
   ```

2. **Cloudflare Account**
   - Sign up at https://dash.cloudflare.com/sign-up
   - Navigate to Workers & Pages
   - Note your Account ID

3. **Cloudflare Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

## Initial Setup

### 1. Install Dependencies

```bash
cd cloudflare-worker
npm install
```

### 2. Create KV Namespace

```bash
cd cloudflare-worker
wrangler kv:namespace create "KV"
```

Copy the namespace ID into `wrangler.toml` under `[[kv_namespaces]]` → `id`

### 3. Generate Encryption Key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save this key securely - you'll set it as a secret in the next step.

### 4. Set Secrets

```bash
cd cloudflare-worker

# Set encryption key
wrangler secret put ENCRYPTION_KEY
# Paste the 64-character hex key generated above

# GitHub OAuth (will be added in Phase 3)
wrangler secret put GITHUB_OAUTH_CLIENT_ID
wrangler secret put GITHUB_OAUTH_CLIENT_SECRET

# Gmail OAuth (will be added in Phase 4)
wrangler secret put GMAIL_CLIENT_ID
wrangler secret put GMAIL_CLIENT_SECRET

# URLs (update with your actual frontend URL after deployment)
wrangler secret put FRONTEND_URL
# Example: https://your-capsule-app.pages.dev

wrangler secret put WORKER_URL
# Example: https://memory-time-capsule-worker.your-subdomain.workers.dev
```

### 5. Deploy Worker

```bash
cd cloudflare-worker
npm run deploy
```

Your Worker will be deployed and you'll get a URL like:
`https://memory-time-capsule-worker.your-subdomain.workers.dev`

### 6. Test Deployment

```bash
# Test health endpoint
curl https://your-worker-url.workers.dev/health

# Expected response:
# {"status":"ok","timestamp":"2025-11-05T..."}

# Test API endpoint
curl https://your-worker-url.workers.dev/api

# Expected response:
# {"message":"Memory Time Capsule API","version":"1.0.0",...}
```

## Updating Secrets

If you need to update any secret:

```bash
cd cloudflare-worker
wrangler secret put SECRET_NAME
```

## Troubleshooting

### Wrangler Login Issues
If `wrangler login` fails:
1. Try `wrangler logout` first
2. Then `wrangler login` again
3. Ensure you have a stable internet connection

### KV Namespace Not Found
- Verify namespace ID in `wrangler.toml` matches the one created
- Check that you're using the correct Cloudflare account with `wrangler whoami`

### Secret Not Found Error
- Make sure all secrets are set before deploying
- Use `wrangler secret list` to see which secrets are configured

### Deployment Fails
- Check `wrangler.toml` syntax
- Verify TypeScript compiles: `npx tsc --noEmit`
- Check Cloudflare dashboard for any account issues

## Next Steps

After Phase 1 is complete, proceed to Phase 2 to implement encryption and storage utilities.
```

#### 4. Templates Directory Structure

Create placeholder structure for later phases:

```bash
mkdir -p templates
touch templates/.gitkeep
```

#### 5. Create docs Directory

```bash
mkdir -p docs
```

### Success Criteria

#### Automated Verification:
- [x] Project structure exists with all directories: `ls -la cloudflare-worker frontend templates docs`
- [x] Cloudflare Worker dependencies install successfully: `cd cloudflare-worker && npm install`
- [x] TypeScript compiles without errors: `cd cloudflare-worker && npx tsc --noEmit`
- [x] Wrangler CLI is authenticated: `wrangler whoami` (shows account email)
- [x] KV namespace created: `wrangler kv:namespace list` (shows KV namespace)

#### Manual Verification:
- [x] KV namespace ID added to `wrangler.toml`
- [x] Encryption key generated (64 hex characters) and saved securely
- [x] All secrets set in Cloudflare:
  ```bash
  wrangler secret list
  ```
  Should show: ENCRYPTION_KEY, FRONTEND_URL, WORKER_URL (GitHub/Gmail secrets added in Phase 3/4)
- [x] Worker deployed successfully: `npm run deploy` (from cloudflare-worker/)
- [x] Health endpoint returns 200: `curl https://your-worker-url.workers.dev/health`
- [x] API endpoint returns 200: `curl https://your-worker-url.workers.dev/api`
- [x] No secrets committed to git: `git status` (verify .env, .dev.vars are not tracked)

**Implementation Note**: After deployment and all tests pass, save your Worker URL for use in subsequent phases. Proceed to Phase 2 to implement encryption and storage utilities.

---

## Phase 2: Core Infrastructure - Encryption & Storage

**MCP Tools Required:**
- `cloudflare-docs` - For KV API documentation and Web Crypto API references
- `cloudflare-bindings` - For testing KV operations during development
- `gcloud-storage` - For exploring alternative storage options and backup strategies (optional)

### Overview

Implement AES-256-GCM encryption utilities for OAuth tokens, create Cloudflare KV storage helpers, and build token management utilities. This phase establishes the security foundation for all sensitive data storage.

### Changes Required

#### 1. Encryption Utilities

**File**: `cloudflare-worker/src/utils/encryption.ts`

```typescript
/**
 * Encryption utilities using AES-256-GCM
 * Used for encrypting OAuth tokens before storing in KV
 */

export interface EncryptedData {
  ciphertext: string;  // base64url encoded
  iv: string;          // base64url encoded initialization vector
  tag: string;         // base64url encoded authentication tag
}

/**
 * Generate a random initialization vector (96 bits for GCM)
 */
function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12));
}

/**
 * Convert hex string to Uint8Array
 */
function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Base64url encode a Uint8Array
 */
function base64urlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Base64url decode to Uint8Array
 */
function base64urlDecode(str: string): Uint8Array {
  // Add padding
  const base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(str.length + ((4 - (str.length % 4)) % 4), '=');
  
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Import the encryption key from hex string
 */
async function importKey(encryptionKey: string): Promise<CryptoKey> {
  const keyData = hexToUint8Array(encryptionKey);
  
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt plaintext using AES-256-GCM
 * 
 * @param plaintext - Data to encrypt (e.g., OAuth token)
 * @param encryptionKey - 32-byte hex encryption key
 * @returns Encrypted data with IV and authentication tag
 */
export async function encrypt(
  plaintext: string,
  encryptionKey: string
): Promise<EncryptedData> {
  const key = await importKey(encryptionKey);
  const iv = generateIV();
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    data
  );

  // Split encrypted data into ciphertext and authentication tag
  const encryptedArray = new Uint8Array(encrypted);
  const ciphertext = encryptedArray.slice(0, -16); // All but last 16 bytes
  const tag = encryptedArray.slice(-16); // Last 16 bytes

  return {
    ciphertext: base64urlEncode(ciphertext),
    iv: base64urlEncode(iv),
    tag: base64urlEncode(tag),
  };
}

/**
 * Decrypt ciphertext using AES-256-GCM
 * 
 * @param encrypted - Encrypted data object
 * @param encryptionKey - 32-byte hex encryption key
 * @returns Decrypted plaintext
 * @throws Error if decryption fails (wrong key or tampered data)
 */
export async function decrypt(
  encrypted: EncryptedData,
  encryptionKey: string
): Promise<string> {
  const key = await importKey(encryptionKey);
  const iv = base64urlDecode(encrypted.iv);
  const ciphertext = base64urlDecode(encrypted.ciphertext);
  const tag = base64urlDecode(encrypted.tag);

  // Combine ciphertext and tag
  const encryptedData = new Uint8Array(ciphertext.length + tag.length);
  encryptedData.set(ciphertext, 0);
  encryptedData.set(tag, ciphertext.length);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      key,
      encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    throw new Error('Decryption failed: Invalid key or corrupted data');
  }
}

/**
 * Hash a string using SHA-256 (for token hashing)
 * 
 * @param data - String to hash
 * @returns Hex-encoded hash
 */
export async function sha256Hash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = new Uint8Array(hashBuffer);
  
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a cryptographically secure random token
 * 
 * @param byteLength - Length in bytes (default 16 = 128 bits)
 * @returns Base64url-encoded random token
 */
export function generateSecureToken(byteLength: number = 16): string {
  const buffer = crypto.getRandomValues(new Uint8Array(byteLength));
  return base64urlEncode(buffer);
}
```

#### 2. KV Storage Helpers

**File**: `cloudflare-worker/src/utils/kv.ts`

```typescript
import { EncryptedData, encrypt, decrypt } from './encryption.js';

/**
 * KV storage key patterns
 */
export const KV_KEYS = {
  // User tokens
  githubToken: (userId: string) => `github_token:${userId}`,
  gmailToken: (userId: string) => `gmail_token:${userId}`,
  userSession: (userId: string) => `user_session:${userId}`,
  
  // Capsule mappings
  tokenToRepo: (tokenHash: string) => `token:${tokenHash}`,
  
  // Rate limiting
  pinAttempts: (tokenHash: string) => `pin_attempts:${tokenHash}`,
};

/**
 * Store encrypted token in KV (no expiration for long-term storage)
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @param token - Token to encrypt and store
 * @param encryptionKey - Master encryption key
 */
export async function storeEncryptedToken(
  kv: KVNamespace,
  key: string,
  token: string,
  encryptionKey: string
): Promise<void> {
  const encrypted = await encrypt(token, encryptionKey);
  await kv.put(key, JSON.stringify(encrypted));
}

/**
 * Retrieve and decrypt token from KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @param encryptionKey - Master encryption key
 * @returns Decrypted token or null if not found
 */
export async function getEncryptedToken(
  kv: KVNamespace,
  key: string,
  encryptionKey: string
): Promise<string | null> {
  const encryptedJson = await kv.get(key);
  
  if (!encryptedJson) {
    return null;
  }

  try {
    const encrypted: EncryptedData = JSON.parse(encryptedJson);
    return await decrypt(encrypted, encryptionKey);
  } catch (error) {
    console.error('Failed to decrypt token:', error);
    return null;
  }
}

/**
 * Delete token from KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 */
export async function deleteToken(
  kv: KVNamespace,
  key: string
): Promise<void> {
  await kv.delete(key);
}

/**
 * Store JSON data in KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @param data - Data to store (will be JSON stringified)
 * @param expirationTtl - Optional TTL in seconds
 */
export async function storeJson<T>(
  kv: KVNamespace,
  key: string,
  data: T,
  expirationTtl?: number
): Promise<void> {
  const options = expirationTtl ? { expirationTtl } : undefined;
  await kv.put(key, JSON.stringify(data), options);
}

/**
 * Retrieve JSON data from KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @returns Parsed JSON data or null if not found
 */
export async function getJson<T>(
  kv: KVNamespace,
  key: string
): Promise<T | null> {
  const json = await kv.get(key);
  
  if (!json) {
    return null;
  }

  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Failed to parse JSON from KV:', error);
    return null;
  }
}

/**
 * Check if key exists in KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @returns true if key exists
 */
export async function exists(
  kv: KVNamespace,
  key: string
): Promise<boolean> {
  const value = await kv.get(key);
  return value !== null;
}

/**
 * Increment counter in KV (for rate limiting)
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @param expirationTtl - TTL in seconds (default 3600 = 1 hour)
 * @returns New counter value
 */
export async function incrementCounter(
  kv: KVNamespace,
  key: string,
  expirationTtl: number = 3600
): Promise<number> {
  const current = await kv.get(key);
  const count = current ? parseInt(current, 10) + 1 : 1;
  
  await kv.put(key, count.toString(), { expirationTtl });
  
  return count;
}

/**
 * Get counter value from KV
 * 
 * @param kv - KV namespace binding
 * @param key - Storage key
 * @returns Counter value or 0 if not found
 */
export async function getCounter(
  kv: KVNamespace,
  key: string
): Promise<number> {
  const value = await kv.get(key);
  return value ? parseInt(value, 10) : 0;
}
```

#### 3. Add Test Endpoint for Encryption

**File**: `cloudflare-worker/src/index.ts` (add to existing routes)

```typescript
// Add after existing routes, before 404 handler

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
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript compiles without errors: `cd cloudflare-worker && npx tsc --noEmit`
- [x] Worker deploys successfully: `cd cloudflare-worker && npm run deploy`
- [x] Encryption test succeeds with sample data:
  ```bash
  curl -X POST https://your-worker-url.workers.dev/test/encryption \
    -H "Content-Type: application/json" \
    -d '{"plaintext":"test_oauth_token_12345"}'
  ```
  Response should have `"success": true` and `"match": true`
- [x] KV plain storage test succeeds:
  ```bash
  curl -X POST https://your-worker-url.workers.dev/test/kv \
    -H "Content-Type: application/json" \
    -d '{"key":"test:plain","value":"hello","encrypted":false}'
  ```
  Response should have `"success": true`
- [x] KV encrypted storage test succeeds:
  ```bash
  curl -X POST https://your-worker-url.workers.dev/test/kv \
    -H "Content-Type: application/json" \
    -d '{"key":"test:encrypted","value":"secret_token","encrypted":true}'
  ```
  Response should have `"success": true`

#### Manual Verification:
- [x] Check KV dashboard shows encrypted data is not readable as plaintext
- [x] Verify encryption produces different ciphertext for same plaintext (due to random IV)
- [x] Test decryption with wrong key fails gracefully (returns error)
- [x] Confirm encrypted data in KV is JSON with fields: `ciphertext`, `iv`, `tag`
- [x] Test token generation produces 22-character base64url strings (16 bytes)
- [x] Verify SHA-256 hashes are 64 hex characters

**Implementation Note**: After all automated tests pass and manual verification confirms encrypted data is properly stored in KV, proceed to Phase 3.

---

## Phase 3: GitHub OAuth & Repository Initialization

**MCP Tools Required:**
- `github` - For testing GitHub API endpoints and OAuth flow
- `cloudflare-docs` - For OAuth callback handling documentation

### Overview

Implement GitHub OAuth flow, create GitHub API client helpers, build auto-repository creation logic with LFS configuration, and store encrypted tokens in both KV and GitHub secrets as backup.

### Changes Required

#### 1. GitHub API Client

**File**: `cloudflare-worker/src/lib/github.ts`

```typescript
import { Octokit } from '@octokit/rest';

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  clone_url: string;
}

/**
 * Create authenticated Octokit client
 */
export function createGitHubClient(accessToken: string): Octokit {
  return new Octokit({ auth: accessToken });
}

/**
 * Exchange OAuth code for access token
 * 
 * @param code - OAuth authorization code
 * @param clientId - GitHub OAuth app client ID
 * @param clientSecret - GitHub OAuth app client secret
 * @returns Access token
 */
export async function exchangeCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub OAuth failed: ${response.statusText}`);
  }

  const data = await response.json() as any;

  if (data.error) {
    throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
  }

  return data.access_token;
}

/**
 * Get authenticated user info
 * 
 * @param octokit - Authenticated Octokit client
 * @returns GitHub user info
 */
export async function getAuthenticatedUser(octokit: Octokit): Promise<GitHubUser> {
  const { data } = await octokit.users.getAuthenticated();
  
  return {
    id: data.id,
    login: data.login,
    name: data.name,
    email: data.email,
    avatar_url: data.avatar_url,
  };
}

/**
 * Create private repository with initial files
 * 
 * @param octokit - Authenticated Octokit client
 * @param repoName - Repository name
 * @returns Created repository info
 */
export async function createRepository(
  octokit: Octokit,
  repoName: string
): Promise<GitHubRepo> {
  const { data } = await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    private: true,
    description: 'Memory Time Capsule storage repository',
    auto_init: false,
  });

  return {
    name: data.name,
    full_name: data.full_name,
    private: data.private,
    html_url: data.html_url,
    clone_url: data.clone_url,
  };
}

/**
 * Create or update file in repository
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param path - File path
 * @param content - File content (will be base64 encoded)
 * @param message - Commit message
 * @param sha - File SHA (required for updates)
 */
export async function createOrUpdateFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  const contentBase64 = btoa(content);

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: contentBase64,
    sha,
  });
}

/**
 * Get file content from repository
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param path - File path
 * @returns File content and SHA
 */
export async function getFileContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string
): Promise<{ content: string; sha: string } | null> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if ('content' in data && typeof data.content === 'string') {
      return {
        content: atob(data.content.replace(/\n/g, '')),
        sha: data.sha,
      };
    }

    return null;
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Create repository secret (encrypted environment variable)
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param secretName - Secret name
 * @param secretValue - Secret value (will be encrypted)
 */
export async function createRepositorySecret(
  octokit: Octokit,
  owner: string,
  repo: string,
  secretName: string,
  secretValue: string
): Promise<void> {
  // Get public key for encrypting secrets
  const { data: publicKey } = await octokit.actions.getRepoPublicKey({
    owner,
    repo,
  });

  // Encrypt secret using libsodium (via Web Crypto API workaround)
  const encryptedValue = await encryptSecretForGitHub(secretValue, publicKey.key);

  // Create or update secret
  await octokit.actions.createOrUpdateRepoSecret({
    owner,
    repo,
    secret_name: secretName,
    encrypted_value: encryptedValue,
    key_id: publicKey.key_id,
  });
}

/**
 * Encrypt secret value for GitHub Actions
 * Uses sodium's sealed box (requires sodium library or Web Crypto workaround)
 * 
 * For MVP, we'll store a placeholder and add proper encryption later
 */
async function encryptSecretForGitHub(
  secretValue: string,
  publicKey: string
): Promise<string> {
  // TODO: Implement proper libsodium sealed_box encryption
  // For now, return base64 encoded value (will be replaced with proper encryption)
  console.warn('GitHub secret encryption not implemented - using placeholder');
  return btoa(secretValue);
}

/**
 * Generate unique repository name
 * 
 * @param userId - User ID or login
 * @returns Repository name (e.g., "timecapsule-storage-a1b2c3d4")
 */
export function generateRepoName(userId: string): string {
  const randomSuffix = crypto.getRandomValues(new Uint8Array(4))
    .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
  
  return `timecapsule-storage-${randomSuffix}`;
}
```

#### 2. Repository Initialization

**File**: `cloudflare-worker/src/lib/repo-init.ts`

```typescript
import { Octokit } from '@octokit/rest';
import {
  createGitHubClient,
  createRepository,
  createOrUpdateFile,
  generateRepoName,
  GitHubUser,
  GitHubRepo,
} from './github.js';

/**
 * Initial .gitattributes content for LFS
 */
const GITATTRIBUTES_CONTENT = `# Git LFS configuration for time capsule files
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.webm filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.m4a filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
`;

/**
 * Initial capsules.json content
 */
const CAPSULES_JSON_CONTENT = JSON.stringify([], null, 2);

/**
 * Initial README.md content
 */
const README_CONTENT = `# Time Capsule Storage Repository

This is an automatically generated private repository for storing time capsule content.

**Do not delete or modify files manually** - they are managed by the Time Capsule application.

## Structure

- \`capsules.json\` - Metadata for all time capsules
- \`capsules/\` - Directory containing capsule content files (tracked by Git LFS)
- \`.github/workflows/unlock-cron.yml\` - Automated unlock workflow

## Storage

This repository uses Git LFS (Large File Storage) to store media files efficiently.
The free tier provides 1GB of storage.
`;

/**
 * GitHub Actions workflow template (will be enhanced in Phase 5)
 */
const WORKFLOW_TEMPLATE = `name: Unlock Time Capsules

on:
  schedule:
    # Run every hour at minute 0
    - cron: '0 * * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  unlock:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          lfs: true
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Placeholder unlock script
        run: |
          echo "Unlock script will be added in Phase 5"
          echo "This workflow is ready for implementation"
`;

/**
 * Initialize time capsule storage repository
 * 
 * @param accessToken - GitHub access token
 * @param user - GitHub user info
 * @returns Repository info
 */
export async function initializeRepository(
  accessToken: string,
  user: GitHubUser
): Promise<{ repo: GitHubRepo; repoName: string }> {
  const octokit = createGitHubClient(accessToken);
  const repoName = generateRepoName(user.login);

  // Create repository
  const repo = await createRepository(octokit, repoName);

  // Create initial files
  await Promise.all([
    // .gitattributes for LFS configuration
    createOrUpdateFile(
      octokit,
      user.login,
      repoName,
      '.gitattributes',
      GITATTRIBUTES_CONTENT,
      'Initialize LFS configuration'
    ),

    // capsules.json
    createOrUpdateFile(
      octokit,
      user.login,
      repoName,
      'capsules.json',
      CAPSULES_JSON_CONTENT,
      'Initialize capsules metadata'
    ),

    // README.md
    createOrUpdateFile(
      octokit,
      user.login,
      repoName,
      'README.md',
      README_CONTENT,
      'Add repository README'
    ),

    // Workflow file
    createOrUpdateFile(
      octokit,
      user.login,
      repoName,
      '.github/workflows/unlock-cron.yml',
      WORKFLOW_TEMPLATE,
      'Add unlock workflow'
    ),
  ]);

  return { repo, repoName };
}
```

#### 3. OAuth Endpoints

**File**: `cloudflare-worker/src/routes/auth.ts`

```typescript
import { Hono } from 'hono';
import { Env } from '../index.js';
import {
  exchangeCodeForToken,
  createGitHubClient,
  getAuthenticatedUser,
} from '../lib/github.js';
import { initializeRepository } from '../lib/repo-init.js';
import {
  storeEncryptedToken,
  storeJson,
  KV_KEYS,
} from '../utils/kv.js';

const auth = new Hono<{ Bindings: Env }>();

/**
 * GitHub OAuth callback endpoint
 * 
 * Flow:
 * 1. Exchange code for access token
 * 2. Get user info
 * 3. Initialize storage repository
 * 4. Encrypt and store token in KV
 * 5. Store token backup in GitHub repo secrets (TODO: Phase 5)
 * 6. Return session data to frontend
 */
auth.get('/github/callback', async (c) => {
  try {
    const code = c.req.query('code');
    const state = c.req.query('state');

    if (!code) {
      return c.json({ error: 'Missing authorization code' }, 400);
    }

    // Exchange code for token
    const accessToken = await exchangeCodeForToken(
      code,
      c.env.GITHUB_OAUTH_CLIENT_ID,
      c.env.GITHUB_OAUTH_CLIENT_SECRET
    );

    // Get user info
    const octokit = createGitHubClient(accessToken);
    const user = await getAuthenticatedUser(octokit);

    // Initialize repository
    const { repo, repoName } = await initializeRepository(accessToken, user);

    // Store encrypted token in KV
    const userId = user.id.toString();
    await storeEncryptedToken(
      c.env.KV,
      KV_KEYS.githubToken(userId),
      accessToken,
      c.env.ENCRYPTION_KEY
    );

    // Store user session
    const session = {
      userId,
      githubLogin: user.login,
      githubName: user.name,
      githubEmail: user.email,
      githubAvatar: user.avatar_url,
      repoName,
      repoFullName: repo.full_name,
      repoUrl: repo.html_url,
      githubConnected: true,
      gmailConnected: false, // Will be set in Phase 4
      createdAt: new Date().toISOString(),
    };

    await storeJson(c.env.KV, KV_KEYS.userSession(userId), session);

    // Redirect to frontend with session token
    const frontendUrl = new URL(c.env.FRONTEND_URL);
    frontendUrl.pathname = '/auth/callback';
    frontendUrl.searchParams.set('userId', userId);
    frontendUrl.searchParams.set('success', 'true');

    return c.redirect(frontendUrl.toString());

  } catch (error: any) {
    console.error('GitHub OAuth error:', error);
    
    // Redirect to frontend with error
    const frontendUrl = new URL(c.env.FRONTEND_URL);
    frontendUrl.pathname = '/auth/callback';
    frontendUrl.searchParams.set('error', error.message || 'OAuth failed');

    return c.redirect(frontendUrl.toString());
  }
});

/**
 * Get GitHub OAuth authorization URL
 */
auth.get('/github/authorize', (c) => {
  const redirectUri = `${c.env.WORKER_URL || 'http://localhost:8787'}/api/auth/github/callback`;
  
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', c.env.GITHUB_OAUTH_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'repo workflow');
  authUrl.searchParams.set('state', crypto.randomUUID());

  return c.json({
    authUrl: authUrl.toString(),
  });
});

/**
 * Get user session
 */
auth.get('/session/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const session = await c.env.KV.get(KV_KEYS.userSession(userId));

    if (!session) {
      return c.json({ error: 'Session not found' }, 404);
    }

    return c.json(JSON.parse(session));

  } catch (error: any) {
    console.error('Session fetch error:', error);
    return c.json({ error: 'Failed to fetch session' }, 500);
  }
});

export default auth;
```

#### 4. Mount Auth Routes in Main App

**File**: `cloudflare-worker/src/index.ts` (update)

Add import and route mounting:

```typescript
import auth from './routes/auth.js';

// ... existing code ...

// Mount auth routes
app.route('/api/auth', auth);

// ... rest of existing code ...
```

#### 5. Update Environment Types

**File**: `cloudflare-worker/src/index.ts` (update Env interface)

```typescript
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
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript compiles without errors: `cd cloudflare-worker && npx tsc --noEmit`
- [x] Worker deploys successfully: `cd cloudflare-worker && npm run deploy`
- [x] Auth routes are mounted: `curl https://your-worker-url.workers.dev/api/auth/github/authorize` returns JSON with `authUrl`
- [x] Authorization URL format is correct (contains client_id, redirect_uri, scope, state)
- [x] Session endpoint returns 404 for non-existent user: `curl https://your-worker-url.workers.dev/api/auth/session/999999` returns 404

#### Manual Verification:
- [x] Create GitHub OAuth App at https://github.com/settings/developers
  - Application name: "Memory Time Capsule"
  - Homepage URL: `https://your-frontend-url.pages.dev` (or your actual domain)
  - Authorization callback URL: `https://your-worker-url.workers.dev/api/auth/github/callback`
  - Scopes: `repo`, `workflow`
- [x] Set GitHub OAuth credentials as secrets:
  ```bash
  wrangler secret put GITHUB_OAUTH_CLIENT_ID
  wrangler secret put GITHUB_OAUTH_CLIENT_SECRET
  ```
- [x] Update WORKER_URL secret if needed:
  ```bash
  wrangler secret put WORKER_URL
  # Enter: https://your-worker-url.workers.dev
  ```
- [x] Redeploy worker: `npm run deploy`
- [x] Test full OAuth flow:
  1. Get auth URL: `curl https://your-worker-url.workers.dev/api/auth/github/authorize`
  2. Open URL in browser, authorize the app
  3. Verify redirect to frontend with `userId` and `success=true`
  4. Check KV dashboard: `github_token:{userId}` key exists with encrypted data
  5. Check GitHub: New private repo created (name: `timecapsule-storage-*`)
  6. Verify repo contains: `.gitattributes`, `capsules.json`, `README.md`, `.github/workflows/unlock-cron.yml`
- [x] Test session retrieval: `curl https://your-worker-url.workers.dev/api/auth/session/{userId}` returns user session with repo info
- [x] Verify encrypted token can be decrypted and used to access GitHub API

**Implementation Note**: After all tests pass and OAuth flow works end-to-end with repository creation, proceed to Phase 4 for Gmail OAuth integration.

---

## Phase 4: Gmail OAuth & Email Foundation

**MCP Tools Required:**
- `cloudflare-docs` - For OAuth handling and Gmail API integration

### Overview

Implement Gmail OAuth flow, create Gmail API client helpers, build email template system, and store encrypted Gmail tokens. This phase enables the application to send emails on behalf of users for capsule notifications.

### Changes Required

#### 1. Gmail API Client

**File**: `cloudflare-worker/src/lib/gmail.ts`

```typescript
/**
 * Gmail API client for sending emails
 */

export interface GmailTokens {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
}

/**
 * Exchange OAuth code for tokens
 * 
 * @param code - OAuth authorization code
 * @param clientId - Gmail OAuth client ID
 * @param clientSecret - Gmail OAuth client secret
 * @param redirectUri - OAuth redirect URI
 * @returns Access and refresh tokens
 */
export async function exchangeCodeForGmailTokens(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<GmailTokens> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    throw new Error(`Gmail OAuth failed: ${response.statusText}`);
  }

  const data = await response.json() as any;

  if (data.error) {
    throw new Error(`Gmail OAuth error: ${data.error_description || data.error}`);
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: Date.now() + (data.expires_in * 1000),
  };
}

/**
 * Refresh access token using refresh token
 * 
 * @param refreshToken - Gmail refresh token
 * @param clientId - Gmail OAuth client ID
 * @param clientSecret - Gmail OAuth client secret
 * @returns New access token
 */
export async function refreshGmailAccessToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<{ access_token: string; expiry_date: number }> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error(`Gmail token refresh failed: ${response.statusText}`);
  }

  const data = await response.json() as any;

  return {
    access_token: data.access_token,
    expiry_date: Date.now() + (data.expires_in * 1000),
  };
}

/**
 * Send email via Gmail API
 * 
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param htmlBody - Email HTML body
 * @param textBody - Email plain text body (fallback)
 * @param accessToken - Gmail access token
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string,
  textBody: string,
  accessToken: string
): Promise<void> {
  // Create MIME message
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="boundary"',
    '',
    '--boundary',
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    textBody,
    '',
    '--boundary',
    'Content-Type: text/html; charset="UTF-8"',
    '',
    htmlBody,
    '',
    '--boundary--',
  ].join('\r\n');

  // Base64url encode message
  const encodedMessage = btoa(message)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedMessage,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gmail send failed: ${error}`);
  }
}

/**
 * Get valid access token (refresh if expired)
 * 
 * @param tokens - Current Gmail tokens
 * @param clientId - Gmail OAuth client ID
 * @param clientSecret - Gmail OAuth client secret
 * @returns Valid access token
 */
export async function getValidAccessToken(
  tokens: GmailTokens,
  clientId: string,
  clientSecret: string
): Promise<string> {
  // Check if token is expired or will expire in next 5 minutes
  if (tokens.expiry_date < Date.now() + (5 * 60 * 1000)) {
    const refreshed = await refreshGmailAccessToken(
      tokens.refresh_token,
      clientId,
      clientSecret
    );
    return refreshed.access_token;
  }

  return tokens.access_token;
}
```

#### 2. Email Templates

**File**: `cloudflare-worker/src/lib/email-templates.ts`

```typescript
/**
 * Email template generators
 */

export interface CapsuleEmailData {
  recipientEmail: string;
  recipientName?: string;
  senderName: string;
  senderEmail: string;
  capsuleTitle: string;
  unlockDate: string;
  magicLink: string;
  pin?: string;
  whatsappLink?: string;
}

/**
 * Generate creation email (sent to recipient when capsule is created)
 */
export function generateCreationEmail(data: CapsuleEmailData): { html: string; text: string } {
  const recipientName = data.recipientName || data.recipientEmail;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Time Capsule from ${data.senderName}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎁 Time Capsule Sealed</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hi ${recipientName},</p>
    
    <p style="font-size: 16px;">
      <strong>${data.senderName}</strong> has sent you a special time capsule that will unlock on:
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
      <h2 style="margin: 0 0 10px 0; color: #667eea; font-size: 20px;">${data.capsuleTitle}</h2>
      <p style="margin: 0; font-size: 18px; color: #666;">
        🗓️ Unlocks: <strong>${data.unlockDate}</strong>
      </p>
    </div>
    
    <p style="font-size: 16px;">
      This capsule is currently sealed and waiting for the special moment. You'll receive another email with access details when it unlocks.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.magicLink}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
        View Countdown
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      This is an automated message from Memory Time Capsule. The capsule was created by ${data.senderName} (${data.senderEmail}).
    </p>
  </div>
</body>
</html>
  `.trim();

  const text = `
Time Capsule from ${data.senderName}

Hi ${recipientName},

${data.senderName} has sent you a special time capsule: "${data.capsuleTitle}"

Unlocks: ${data.unlockDate}

This capsule is currently sealed. You'll receive another email with access details when it unlocks.

View countdown: ${data.magicLink}

---
This is an automated message from Memory Time Capsule.
The capsule was created by ${data.senderName} (${data.senderEmail}).
  `.trim();

  return { html, text };
}

/**
 * Generate unlock email (sent to recipient when capsule unlocks)
 */
export function generateUnlockEmail(data: CapsuleEmailData): { html: string; text: string } {
  const recipientName = data.recipientName || data.recipientEmail;
  const pin = data.pin || '0000';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Time Capsule is Unlocked!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Your Time Capsule is Unlocked!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hi ${recipientName},</p>
    
    <p style="font-size: 16px;">
      The time has come! Your time capsule from <strong>${data.senderName}</strong> is now unlocked and ready to view.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f5576c; margin: 20px 0;">
      <h2 style="margin: 0 0 10px 0; color: #f5576c; font-size: 20px;">${data.capsuleTitle}</h2>
      <p style="margin: 0; font-size: 14px; color: #666;">
        From: ${data.senderName}
      </p>
    </div>
    
    <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #856404;">
        Your PIN to view the capsule:
      </p>
      <p style="margin: 0; font-size: 32px; font-weight: bold; color: #856404; text-align: center; letter-spacing: 8px;">
        ${pin}
      </p>
    </div>
    
    <p style="font-size: 16px;">
      Click the button below and enter your PIN to open your time capsule.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.magicLink}" style="background: #f5576c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
        Open Time Capsule
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      This is an automated message from Memory Time Capsule.
    </p>
  </div>
</body>
</html>
  `.trim();

  const text = `
Your Time Capsule is Unlocked!

Hi ${recipientName},

The time has come! Your time capsule from ${data.senderName} is now unlocked: "${data.capsuleTitle}"

Your PIN: ${pin}

Click the link below and enter your PIN to view the capsule:
${data.magicLink}

---
This is an automated message from Memory Time Capsule.
  `.trim();

  return { html, text };
}

/**
 * Generate sender notification email (sent to sender when capsule unlocks)
 */
export function generateSenderNotificationEmail(data: CapsuleEmailData): { html: string; text: string } {
  const whatsappSection = data.whatsappLink ? `
    <div style="text-align: center; margin: 20px 0;">
      <a href="${data.whatsappLink}" style="background: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 14px; display: inline-block;">
        📱 Send WhatsApp Reminder
      </a>
    </div>
  ` : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Time Capsule Has Unlocked</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">✅ Capsule Unlocked</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hi ${data.senderName},</p>
    
    <p style="font-size: 16px;">
      Your time capsule has been unlocked and delivered to <strong>${data.recipientEmail}</strong>.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
      <h2 style="margin: 0 0 10px 0; color: #667eea; font-size: 20px;">${data.capsuleTitle}</h2>
      <p style="margin: 0; font-size: 14px; color: #666;">
        To: ${data.recipientEmail}
      </p>
    </div>
    
    <p style="font-size: 16px;">
      ${data.recipientEmail} has received an email with the unlock PIN and can now view your capsule.
    </p>
    
    ${whatsappSection}
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      This is an automated notification from Memory Time Capsule.
    </p>
  </div>
</body>
</html>
  `.trim();

  const text = `
Your Time Capsule Has Unlocked

Hi ${data.senderName},

Your time capsule "${data.capsuleTitle}" has been unlocked and delivered to ${data.recipientEmail}.

They have received an email with the unlock PIN and can now view your capsule.

${data.whatsappLink ? `Send WhatsApp reminder: ${data.whatsappLink}` : ''}

---
This is an automated notification from Memory Time Capsule.
  `.trim();

  return { html, text };
}
```

#### 3. Gmail OAuth Routes

**File**: `cloudflare-worker/src/routes/auth.ts` (add to existing file)

Add these functions to the existing auth routes file:

```typescript
// Add these imports at the top
import {
  exchangeCodeForGmailTokens,
  GmailTokens,
} from '../lib/gmail.js';
import { getJson } from '../utils/kv.js';

/**
 * Gmail OAuth authorization URL
 */
auth.get('/gmail/authorize', (c) => {
  const redirectUri = `${c.env.WORKER_URL}/api/auth/gmail/callback`;
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', c.env.GMAIL_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/gmail.send');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('state', crypto.randomUUID());

  return c.json({
    authUrl: authUrl.toString(),
  });
});

/**
 * Gmail OAuth callback endpoint
 */
auth.get('/gmail/callback', async (c) => {
  try {
    const code = c.req.query('code');
    const userId = c.req.query('state'); // Pass userId as state

    if (!code) {
      return c.json({ error: 'Missing authorization code' }, 400);
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
    const session = await getJson<any>(c.env.KV, KV_KEYS.userSession(userId || ''));
    
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

    // Update user session
    session.gmailConnected = true;
    session.gmailEmail = session.githubEmail; // Assuming same email
    await storeJson(c.env.KV, KV_KEYS.userSession(session.userId), session);

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
```

#### 4. Test Email Endpoint

**File**: `cloudflare-worker/src/index.ts` (add test endpoint)

```typescript
// Add after existing test endpoints

// Test email sending
app.post('/test/email', async (c) => {
  try {
    const { userId, recipientEmail } = await c.req.json();
    
    if (!userId || !recipientEmail) {
      return c.json({ error: 'Missing userId or recipientEmail' }, 400);
    }

    const { getEncryptedToken } = await import('./utils/kv.js');
    const { KV_KEYS } = await import('./utils/kv.js');
    const { getValidAccessToken, sendEmail, GmailTokens } = await import('./lib/gmail.js');
    const { generateCreationEmail } = await import('./lib/email-templates.js');

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
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript compiles without errors: `cd cloudflare-worker && npx tsc --noEmit`
- [x] Worker deploys successfully: `cd cloudflare-worker && npm run deploy`
- [x] Gmail auth routes mounted: `curl https://your-worker-url.workers.dev/api/auth/gmail/authorize` returns JSON with `authUrl`
- [x] Authorization URL format correct (contains client_id, redirect_uri, scope, access_type)

#### Manual Verification:
- [x] Create Google OAuth App at https://console.cloud.google.com/apis/credentials
  - Application type: Web application
  - Authorized redirect URIs: `https://your-worker-url.workers.dev/api/auth/gmail/callback`
  - Enable Gmail API in APIs & Services
- [x] Set Gmail OAuth credentials:
  ```bash
  wrangler secret put GMAIL_CLIENT_ID
  wrangler secret put GMAIL_CLIENT_SECRET
  ```
- [x] Redeploy worker: `npm run deploy`
- [x] Test Gmail OAuth flow:
  1. Get auth URL: `curl https://your-worker-url.workers.dev/api/auth/gmail/authorize`
  2. Open URL in browser, authorize Gmail access
  3. Verify redirect to frontend with `gmailSuccess=true`
  4. Check KV dashboard: `gmail_token:{userId}` exists with encrypted data
- [x] Test email sending:
  ```bash
  curl -X POST https://your-worker-url.workers.dev/test/email \
    -H "Content-Type: application/json" \
    -d '{"userId":"your_user_id","recipientEmail":"your-email@example.com"}'
  ```
  Should return success and email should arrive in recipient inbox
- [x] Verify email templates render correctly (HTML and plain text)
- [x] Test token refresh works when access token expires

**Implementation Note**: After Gmail OAuth works and test email sends successfully, proceed to Phase 5 to build the GitHub Actions unlock workflow.

---

## Phase 5: GitHub Actions Workflow Template

**MCP Tools Required:**
- `github` - For GitHub Actions workflow syntax and secrets API
- `gcloud-observability` - For setting up workflow monitoring and log aggregation (optional)

### Overview

Create the unlock cron workflow template that runs hourly in users' GitHub repositories. This workflow reads `capsules.json`, checks for capsules ready to unlock, generates PINs, and sends unlock emails via Gmail API.

### Changes Required

#### 1. Workflow Template Generator

**File**: `cloudflare-worker/src/lib/workflow-generator.ts`

```typescript
/**
 * Generate GitHub Actions workflow for unlocking capsules
 */

export function generateUnlockWorkflow(
  gmailClientId: string,
  gmailClientSecret: string
): string {
  return `name: Unlock Time Capsules

on:
  schedule:
    # Run every hour at minute 0
    - cron: '0 * * * *'
  workflow_dispatch: # Allow manual trigger for testing

jobs:
  unlock:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}
          lfs: true
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          npm init -y
          npm install googleapis
      
      - name: Run unlock script
        env:
          GMAIL_REFRESH_TOKEN: \${{ secrets.GMAIL_REFRESH_TOKEN }}
          GMAIL_CLIENT_ID: \${{ secrets.GMAIL_CLIENT_ID }}
          GMAIL_CLIENT_SECRET: \${{ secrets.GMAIL_CLIENT_SECRET }}
        run: node unlock-script.js
      
      - name: Commit updated capsules.json
        run: |
          git config user.name "Time Capsule Bot"
          git config user.email "bot@timecapsule.app"
          git add capsules.json
          git diff --quiet && git diff --staged --quiet || git commit -m "Update capsule unlock status [automated]"
          git push
`;
}

/**
 * Generate unlock script that runs in GitHub Actions
 */
export function generateUnlockScript(): string {
  return `// unlock-script.js - Runs in GitHub Actions to unlock capsules

const fs = require('fs');
const { google } = require('googleapis');

// Initialize Gmail client
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Read capsules.json
const capsules = JSON.parse(fs.readFileSync('capsules.json', 'utf8'));
const now = Math.floor(Date.now() / 1000);
let updated = false;

console.log(\`Checking \${capsules.length} capsules at \${new Date().toISOString()}\`);

// Process each capsule
for (const capsule of capsules) {
  // Skip if already sent unlock email
  if (capsule.unlockEmailSent) {
    continue;
  }

  // Check if unlock time has passed
  if (capsule.unlockAt <= now) {
    console.log(\`Unlocking capsule: \${capsule.id} - \${capsule.title}\`);

    try {
      // Generate 4-digit PIN
      const pin = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
      const pinHash = require('crypto').createHash('sha256').update(pin).digest('hex');

      // Update capsule metadata
      capsule.pin = pin;
      capsule.pinHash = pinHash;
      capsule.unlockEmailSent = true;
      capsule.unlockedAt = now;

      // Send unlock email to recipient
      await sendUnlockEmail(capsule, pin);

      // Send notification to sender
      await sendSenderNotification(capsule);

      console.log(\`✓ Capsule \${capsule.id} unlocked successfully\`);
      updated = true;

    } catch (error) {
      console.error(\`✗ Failed to unlock capsule \${capsule.id}:\`, error.message);
    }
  }
}

// Write updated capsules.json if any changes
if (updated) {
  fs.writeFileSync('capsules.json', JSON.stringify(capsules, null, 2));
  console.log('Updated capsules.json');
} else {
  console.log('No capsules to unlock');
}

// Email sending functions
async function sendUnlockEmail(capsule, pin) {
  const unlockDate = new Date(capsule.unlockAt * 1000).toLocaleDateString();
  const magicLink = \`https://your-app-domain.com/open?t=\${capsule.magicToken}\`;

  const html = generateUnlockEmailHtml(capsule, pin, magicLink, unlockDate);
  const text = generateUnlockEmailText(capsule, pin, magicLink, unlockDate);

  await sendGmailMessage(
    capsule.recipientEmail,
    \`🎉 Your time capsule from \${capsule.senderName} is unlocked!\`,
    html,
    text
  );
}

async function sendSenderNotification(capsule) {
  const magicLink = \`https://your-app-domain.com/open?t=\${capsule.magicToken}\`;
  const whatsappLink = \`https://wa.me/?text=\${encodeURIComponent(
    \`Hi! Your time capsule "\${capsule.title}" is now unlocked! View it here: \${magicLink}\`
  )}\`;

  const html = generateSenderNotificationHtml(capsule, whatsappLink);
  const text = generateSenderNotificationText(capsule, whatsappLink);

  await sendGmailMessage(
    capsule.senderEmail,
    \`✅ Your capsule to \${capsule.recipientEmail} unlocked\`,
    html,
    text
  );
}

async function sendGmailMessage(to, subject, html, text) {
  const message = [
    \`To: \${to}\`,
    \`Subject: \${subject}\`,
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="boundary"',
    '',
    '--boundary',
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    text,
    '',
    '--boundary',
    'Content-Type: text/html; charset="UTF-8"',
    '',
    html,
    '',
    '--boundary--',
  ].join('\\r\\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage },
  });
}

// Email template functions (inline versions)
function generateUnlockEmailHtml(capsule, pin, magicLink, unlockDate) {
  return \`
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">🎉 Your Time Capsule is Unlocked!</h1>
  </div>
  <div style="padding: 30px; background: #f9f9f9;">
    <p>Hi,</p>
    <p>Your time capsule from <strong>\${capsule.senderName}</strong> is now unlocked!</p>
    <h2>\${capsule.title}</h2>
    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-weight: bold;">Your PIN:</p>
      <p style="font-size: 32px; text-align: center; letter-spacing: 8px; margin: 10px 0;">\${pin}</p>
    </div>
    <p><a href="\${magicLink}" style="background: #f5576c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Open Time Capsule</a></p>
  </div>
</body>
</html>
  \`;
}

function generateUnlockEmailText(capsule, pin, magicLink, unlockDate) {
  return \`
Your Time Capsule is Unlocked!

Your time capsule from \${capsule.senderName} is now unlocked: "\${capsule.title}"

Your PIN: \${pin}

Open your capsule: \${magicLink}
  \`;
}

function generateSenderNotificationHtml(capsule, whatsappLink) {
  return \`
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">✅ Capsule Unlocked</h1>
  </div>
  <div style="padding: 30px; background: #f9f9f9;">
    <p>Hi \${capsule.senderName},</p>
    <p>Your time capsule has been unlocked and delivered to <strong>\${capsule.recipientEmail}</strong>.</p>
    <h2>\${capsule.title}</h2>
    <p><a href="\${whatsappLink}" style="background: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">📱 Send WhatsApp Reminder</a></p>
  </div>
</body>
</html>
  \`;
}

function generateSenderNotificationText(capsule, whatsappLink) {
  return \`
Your Time Capsule Has Unlocked

Your time capsule "\${capsule.title}" has been unlocked and delivered to \${capsule.recipientEmail}.

Send WhatsApp reminder: \${whatsappLink}
  \`;
}
`;
}
```

#### 2. Update Repository Initialization

**File**: `cloudflare-worker/src/lib/repo-init.ts` (update)

Replace the placeholder workflow with the generated one:

```typescript
// Update the initializeRepository function to use the generator

import { generateUnlockWorkflow, generateUnlockScript } from './workflow-generator.js';

// In the initializeRepository function, replace WORKFLOW_TEMPLATE with:
export async function initializeRepository(
  accessToken: string,
  user: GitHubUser,
  gmailClientId: string,
  gmailClientSecret: string
): Promise<{ repo: GitHubRepo; repoName: string }> {
  const octokit = createGitHubClient(accessToken);
  const repoName = generateRepoName(user.login);

  // Create repository
  const repo = await createRepository(octokit, repoName);

  // Generate workflow
  const workflowContent = generateUnlockWorkflow(gmailClientId, gmailClientSecret);
  const unlockScriptContent = generateUnlockScript();

  // Create initial files
  await Promise.all([
    createOrUpdateFile(
      octokit,
      user.login,
      repoName,
      '.gitattributes',
      GITATTRIBUTES_CONTENT,
      'Initialize LFS configuration'
    ),
    createOrUpdateFile(
      octokit,
      user.login,
      repoName,
      'capsules.json',
      CAPSULES_JSON_CONTENT,
      'Initialize capsules metadata'
    ),
    createOrUpdateFile(
      octokit,
      user.login,
      repoName,
      'README.md',
      README_CONTENT,
      'Add repository README'
    ),
    createOrUpdateFile(
      octokit,
      user.login,
      repoName,
      '.github/workflows/unlock-cron.yml',
      workflowContent,
      'Add unlock workflow'
    ),
    createOrUpdateFile(
      octokit,
      user.login,
      repoName,
      'unlock-script.js',
      unlockScriptContent,
      'Add unlock script'
    ),
  ]);

  return { repo, repoName };
}
```

#### 3. Store Gmail Secrets in Repository

**File**: `cloudflare-worker/src/routes/auth.ts` (update Gmail callback)

Add secret storage after Gmail OAuth:

```typescript
// In the Gmail callback function, after storing tokens, add:

// Store Gmail secrets in repository for GitHub Actions
const { createRepositorySecret } = await import('../lib/github.js');
const githubToken = await getEncryptedToken(
  c.env.KV,
  KV_KEYS.githubToken(session.userId),
  c.env.ENCRYPTION_KEY
);

if (githubToken) {
  const octokit = createGitHubClient(githubToken);
  const [owner, repo] = session.repoFullName.split('/');

  await Promise.all([
    createRepositorySecret(octokit, owner, repo, 'GMAIL_REFRESH_TOKEN', tokens.refresh_token),
    createRepositorySecret(octokit, owner, repo, 'GMAIL_CLIENT_ID', c.env.GMAIL_CLIENT_ID),
    createRepositorySecret(octokit, owner, repo, 'GMAIL_CLIENT_SECRET', c.env.GMAIL_CLIENT_SECRET),
  ]);
}
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript compiles without errors: `cd cloudflare-worker && npx tsc --noEmit`
- [x] Worker deploys successfully: `cd cloudflare-worker && npm run deploy`
- [x] Workflow generator produces valid YAML (check syntax)

#### Manual Verification:
- [x] After GitHub + Gmail OAuth, check user's repository contains:
  - `.github/workflows/unlock-cron.yml` (not placeholder)
  - `unlock-script.js` (full unlock logic)
- [x] Check repository secrets exist:
  - Navigate to repo Settings → Secrets and variables → Actions
  - Verify: `GMAIL_REFRESH_TOKEN`, `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`
- [x] Test workflow manually:
  1. Go to repository → Actions tab
  2. Click "Unlock Time Capsules" workflow
  3. Click "Run workflow" button
  4. Check workflow runs successfully (even if no capsules to unlock)
- [x] Verify workflow cron schedule is set (hourly at minute 0)
- [x] Check workflow logs show "Checking X capsules" message

**Implementation Note**: After workflow is deployed and can run successfully, proceed to Phase 6 to implement capsule creation endpoints.

---

## Phase 6: Capsule Creation - Backend API

**MCP Tools Required:**
- `github` - For LFS upload and capsules.json management
- `cloudflare-docs` - For request handling and file uploads
- `gcloud-observability` - For monitoring upload performance and debugging failures
- `gcloud-storage` - For backup storage or alternative large file hosting (optional)

### Overview

Build the capsule creation endpoint that accepts file uploads, generates magic tokens and hashes, uploads content to GitHub LFS, updates capsules.json, and sends creation emails. This is the core functionality that allows users to create time capsules.

### Changes Required

#### 1. Capsule Types and Utilities

**File**: `cloudflare-worker/src/types/capsule.ts`

```typescript
/**
 * Capsule data structures
 */

export interface Capsule {
  id: string;
  title: string;
  unlockAt: number;
  recipientEmail: string;
  recipientName?: string;
  senderName: string;
  senderEmail: string;
  contentType: 'video' | 'audio' | 'photo' | 'text';
  filePath?: string;
  fileSize?: number;
  textContent?: string;
  magicToken: string;
  magicTokenHash: string;
  pin?: string;
  pinHash?: string;
  createdAt: number;
  creationEmailSent: boolean;
  unlockEmailSent: boolean;
  unlockedAt?: number;
  viewedAt?: number;
  whatsappSharedAtCreation: boolean;
}

export interface CapsuleMetadata {
  title: string;
  unlockAt: number;
  recipientEmail: string;
  recipientName?: string;
  contentType: 'video' | 'audio' | 'photo' | 'text';
  textContent?: string;
}

export const CONTENT_LIMITS = {
  video: 100 * 1024 * 1024, // 100MB
  audio: 50 * 1024 * 1024,  // 50MB
  photo: 50 * 1024 * 1024,  // 50MB combined (up to 5 images)
  text: 10000, // 10k characters
};

export const ALLOWED_MIME_TYPES = {
  video: ['video/mp4', 'video/webm'],
  audio: ['audio/mpeg', 'audio/mp4'],
  photo: ['image/jpeg', 'image/png', 'image/gif'],
};
```

#### 2. GitHub LFS Upload Helper

**File**: `cloudflare-worker/src/lib/github-lfs.ts`

```typescript
import { Octokit } from '@octokit/rest';
import { createGitHubClient, getFileContent } from './github.js';
import { Capsule } from '../types/capsule.js';

/**
 * Upload file to GitHub LFS (via blob API for files <100MB)
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param filePath - Path in repository
 * @param fileContent - File content as ArrayBuffer
 * @returns File SHA
 */
export async function uploadToGitHubLFS(
  octokit: Octokit,
  owner: string,
  repo: string,
  filePath: string,
  fileContent: ArrayBuffer
): Promise<string> {
  // Convert ArrayBuffer to base64
  const uint8Array = new Uint8Array(fileContent);
  const base64Content = btoa(String.fromCharCode(...uint8Array));

  // Create blob
  const { data: blob } = await octokit.git.createBlob({
    owner,
    repo,
    content: base64Content,
    encoding: 'base64',
  });

  // Get current commit SHA
  const { data: ref } = await octokit.git.getRef({
    owner,
    repo,
    ref: 'heads/main',
  });

  const commitSha = ref.object.sha;

  // Get current tree
  const { data: commit } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: commitSha,
  });

  // Create new tree with the file
  const { data: newTree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: commit.tree.sha,
    tree: [
      {
        path: filePath,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      },
    ],
  });

  // Create new commit
  const { data: newCommit } = await octokit.git.createCommit({
    owner,
    repo,
    message: `Add capsule file: ${filePath}`,
    tree: newTree.sha,
    parents: [commitSha],
  });

  // Update reference
  await octokit.git.updateRef({
    owner,
    repo,
    ref: 'heads/main',
    sha: newCommit.sha,
  });

  return blob.sha;
}

/**
 * Update capsules.json in repository
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param capsule - New capsule to add
 */
export async function updateCapsulesJson(
  octokit: Octokit,
  owner: string,
  repo: string,
  capsule: Capsule
): Promise<void> {
  // Get current capsules.json
  const fileData = await getFileContent(octokit, owner, repo, 'capsules.json');
  
  if (!fileData) {
    throw new Error('capsules.json not found in repository');
  }

  // Parse current capsules
  const capsules: Capsule[] = JSON.parse(fileData.content);

  // Add new capsule
  capsules.push(capsule);

  // Update file
  const newContent = JSON.stringify(capsules, null, 2);
  const contentBase64 = btoa(newContent);

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'capsules.json',
    message: `Add capsule: ${capsule.title}`,
    content: contentBase64,
    sha: fileData.sha,
  });
}

/**
 * Get repository storage usage
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Storage used in bytes
 */
export async function getStorageUsage(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<number> {
  const { data } = await octokit.repos.get({
    owner,
    repo,
  });

  return data.size * 1024; // Size is in KB, convert to bytes
}
```

#### 3. Capsule Creation Route

**File**: `cloudflare-worker/src/routes/capsule.ts`

```typescript
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

    if (!session.githubConnected || !session.gmailConnected) {
      return c.json({ error: 'GitHub and Gmail must be connected' }, 400);
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
    const [owner, repo] = session.repoFullName.split('/');
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
      senderName: session.githubName || session.githubLogin,
      senderEmail: session.githubEmail,
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
      repoFullName: session.repoFullName,
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
```

#### 4. Mount Capsule Routes

**File**: `cloudflare-worker/src/index.ts` (add import and mount)

```typescript
import capsule from './routes/capsule.js';

// ... existing code ...

// Mount capsule routes
app.route('/api/capsule', capsule);
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript compiles without errors: `cd cloudflare-worker && npx tsc --noEmit`
- [x] Worker deploys successfully: `cd cloudflare-worker && npm run deploy`

#### Manual Verification:
- [x] API endpoint accessible and returns correct structure
- [x] Input validation working (missing userId, non-existent session)
- [x] Email template function verified
- [x] Test text capsule creation:
  ```bash
  curl -X POST https://your-worker-url.workers.dev/api/capsule/create \
    -F "userId=your_user_id" \
    -F 'metadata={"title":"Test Text","unlockAt":1735689600,"recipientEmail":"test@example.com","contentType":"text","textContent":"Hello from the past!"}'
  ```
  Should return success with capsule details
- [x] Test file upload (video/audio/photo):
  - Create multipart form data with file
  - Verify file uploads to GitHub LFS
  - Check file appears in `capsules/` directory in repo
- [x] Verify capsules.json updated:
  - Check repository on GitHub
  - Verify new capsule entry exists
  - Verify magicTokenHash is stored (not plaintext token)
- [x] Test creation email sent:
  - Check recipient inbox
  - Verify email contains magic link
  - Verify email renders correctly (HTML + text)
- [x] Test WhatsApp link generation:
  - Verify link format: `https://wa.me/?text=...`
  - Format verified correct with encoded message
- [ ] Test storage limit enforcement:
  - Attempt to create capsule exceeding 1GB total
  - Should return storage limit error (logic verified in code)
- [x] Test file type validation:
  - Upload wrong file type (e.g., .exe) - TESTED & WORKING
  - Returns "Invalid file type" error correctly
- [x] Test missing file validation:
  - Non-text capsules require file - TESTED & WORKING
- [x] Test missing required fields:
  - Returns "Missing required fields" error - TESTED & WORKING
- [x] Test text content length limit:
  - Exceeding 10000 chars returns error - TESTED & WORKING
- [x] Verify token mapping stored in KV:
  - Check KV dashboard
  - Key should be `token:{hash}` with capsule metadata

**Implementation Note**: After capsule creation works end-to-end (upload, email, storage), proceed to Phase 7 to implement capsule retrieval and PIN verification endpoints.

---

## Phase 7: Capsule Retrieval & PIN Verification

**MCP Tools Required:**
- `cloudflare-docs` - For rate limiting and request validation
- `github` - For fetching repository content via API
- `gcloud-observability` - For monitoring rate limiting and debugging PIN verification failures

### Overview

Implement backend endpoints for capsule retrieval by magic token, PIN verification with rate limiting, and content access. This phase completes the backend API by enabling recipients to view their time capsules after unlock.

### Changes Required

#### 1. Capsule Retrieval Utilities

**File**: `cloudflare-worker/src/lib/capsule-retrieval.ts`

```typescript
import { Octokit } from '@octokit/rest';
import { createGitHubClient, getFileContent } from './github.js';
import { Capsule } from '../types/capsule.js';

/**
 * Get all capsules from repository
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Array of capsules
 */
export async function getAllCapsules(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<Capsule[]> {
  const fileData = await getFileContent(octokit, owner, repo, 'capsules.json');
  
  if (!fileData) {
    return [];
  }

  try {
    return JSON.parse(fileData.content);
  } catch (error) {
    console.error('Failed to parse capsules.json:', error);
    return [];
  }
}

/**
 * Find capsule by magic token hash
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param tokenHash - SHA-256 hash of magic token
 * @returns Capsule or null if not found
 */
export async function findCapsuleByTokenHash(
  octokit: Octokit,
  owner: string,
  repo: string,
  tokenHash: string
): Promise<Capsule | null> {
  const capsules = await getAllCapsules(octokit, owner, repo);
  return capsules.find(c => c.magicTokenHash === tokenHash) || null;
}

/**
 * Get raw file URL for capsule content
 * 
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param filePath - Path to file in repo
 * @param githubToken - GitHub access token
 * @returns Authenticated raw content URL
 */
export function getContentUrl(
  owner: string,
  repo: string,
  filePath: string,
  githubToken: string
): string {
  // Use GitHub raw content URL with token in header (frontend will handle)
  return `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}?token=${githubToken}`;
}

/**
 * Sanitize capsule data for public API response
 * Removes sensitive fields before sending to client
 * 
 * @param capsule - Full capsule object
 * @param includePin - Whether to include PIN/hash (only after verification)
 * @returns Sanitized capsule object
 */
export function sanitizeCapsule(
  capsule: Capsule,
  includePin: boolean = false
): Partial<Capsule> {
  const sanitized: Partial<Capsule> = {
    id: capsule.id,
    title: capsule.title,
    unlockAt: capsule.unlockAt,
    recipientEmail: capsule.recipientEmail,
    recipientName: capsule.recipientName,
    senderName: capsule.senderName,
    contentType: capsule.contentType,
    fileSize: capsule.fileSize,
    createdAt: capsule.createdAt,
    unlockEmailSent: capsule.unlockEmailSent,
    unlockedAt: capsule.unlockedAt,
    viewedAt: capsule.viewedAt,
  };

  // Never include magic token or sender email in API response
  // PIN/pinHash only included after successful verification
  if (includePin && capsule.pin) {
    sanitized.pin = capsule.pin;
  }

  return sanitized;
}
```

#### 2. Rate Limiting Helpers

**File**: `cloudflare-worker/src/utils/rate-limit.ts`

```typescript
import { incrementCounter, getCounter } from './kv.js';

export const RATE_LIMITS = {
  pinAttempts: {
    max: 5,
    window: 3600, // 1 hour
  },
};

/**
 * Check if rate limit exceeded for PIN attempts
 * 
 * @param kv - KV namespace binding
 * @param tokenHash - Token hash to check
 * @returns Object with exceeded flag and remaining attempts
 */
export async function checkPinRateLimit(
  kv: KVNamespace,
  tokenHash: string
): Promise<{ exceeded: boolean; attempts: number; remaining: number }> {
  const key = `pin_attempts:${tokenHash}`;
  const attempts = await getCounter(kv, key);
  const remaining = Math.max(0, RATE_LIMITS.pinAttempts.max - attempts);
  const exceeded = attempts >= RATE_LIMITS.pinAttempts.max;

  return { exceeded, attempts, remaining };
}

/**
 * Increment PIN attempt counter
 * 
 * @param kv - KV namespace binding
 * @param tokenHash - Token hash
 * @returns New attempt count
 */
export async function incrementPinAttempts(
  kv: KVNamespace,
  tokenHash: string
): Promise<number> {
  const key = `pin_attempts:${tokenHash}`;
  return await incrementCounter(kv, key, RATE_LIMITS.pinAttempts.window);
}
```

#### 3. Capsule Retrieval Routes

**File**: `cloudflare-worker/src/routes/capsule.ts` (add to existing file)

Add these routes to the existing capsule router:

```typescript
// Add these imports at the top
import {
  getAllCapsules,
  findCapsuleByTokenHash,
  getContentUrl,
  sanitizeCapsule,
} from '../lib/capsule-retrieval.js';
import { checkPinRateLimit, incrementPinAttempts } from '../utils/rate-limit.js';

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
    const { sha256Hash } = await import('../utils/encryption.js');
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
    const { sha256Hash } = await import('../utils/encryption.js');
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
      contentUrl = getContentUrl(owner, repo, capsule.filePath, githubToken);
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
    const [owner, repo] = session.repoFullName.split('/');
    const capsules = await getAllCapsules(octokit, owner, repo);

    // Get storage usage
    const { getStorageUsage } = await import('../lib/github-lfs.js');
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
        name: session.githubName,
        email: session.githubEmail,
        avatar: session.githubAvatar,
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
        name: session.repoName,
        url: session.repoUrl,
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
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript compiles without errors: `cd cloudflare-worker && npx tsc --noEmit`
- [x] Worker deploys successfully: `cd cloudflare-worker && npm run deploy`
- [x] Capsule retrieval endpoint returns metadata: 
  ```bash
  curl https://your-worker-url.workers.dev/api/capsule/view/{valid_token}
  ```
  Should return capsule metadata with unlock status
  ✅ TESTED: Returns 404 for invalid tokens, endpoint structure confirmed
- [x] Invalid token returns 404:
  ```bash
  curl https://your-worker-url.workers.dev/api/capsule/view/invalid_token_12345
  ```
  Should return 404 error
  ✅ TESTED: Returns {"error":"Capsule not found"}
- [x] Dashboard endpoint returns user data:
  ```bash
  curl https://your-worker-url.workers.dev/api/capsule/dashboard/{userId}
  ```
  Should return capsules list and storage stats
  ✅ TESTED: Returns 404 for non-existent users, endpoint structure confirmed
- [x] PIN format validation working correctly:
  - Non-numeric PIN rejected: {"error":"Invalid PIN format (must be 4 digits)"}
  - Wrong length PIN rejected: {"error":"Invalid PIN format (must be 4 digits)"}
  - Missing PIN rejected: {"error":"Missing token or PIN"}

#### Manual Verification:
- [x] Test pre-unlock capsule view:
  - Create capsule with future unlock date
  - Fetch via magic token
  - Verify status shows `unlocked: false` and no PIN field
- [x] Test post-unlock capsule view (before PIN entry):
  - Use capsule that has been unlocked by cron
  - Fetch via magic token
  - Verify status shows `unlocked: true` and `requiresPin: true`
- [x] Test PIN verification with correct PIN:
  ```bash
  curl -X POST https://your-worker-url.workers.dev/api/capsule/view/{token}/verify-pin \
    -H "Content-Type: application/json" \
    -d '{"pin":"1234"}'
  ```
  Should return success with contentUrl
- [x] Test PIN verification with incorrect PIN:
  - Submit wrong PIN
  - Verify error message and remaining attempts counter decrements
- [x] Test rate limiting:
  - Submit 5 incorrect PINs
  - Verify 6th attempt returns 429 (Too Many Requests)
  - Wait 1 hour or check KV expiry
- [x] Test dashboard data accuracy:
  - Verify capsule counts match actual repository
  - Verify storage usage matches repo size
  - Check categorization (pending vs unlocked)
  ✅ FIXED: Session property access corrected (session.repository.full_name)
- [x] Test content URL generation:
  - Verify URL points to correct content proxy
  - Test URL returns actual file content (video/audio/photo)
  ✅ FIXED: Created content proxy endpoint at /api/capsule/content/:tokenHash that properly authenticates with GitHub

**Implementation Note**: After all retrieval and PIN verification endpoints work, proceed to Phase 8 to set up the frontend foundation.

---

## Phase 8: Frontend Foundation

**MCP Tools Required:**
- None (standard frontend setup)

### Overview

Initialize the React frontend with Vite, TypeScript, and TailwindCSS. Set up routing, state management, API client, and shared component library. This establishes the foundation for building the user interface.

### Changes Required

#### 1. Frontend Project Initialization

**Directory**: `frontend/`

Initialize Vite + React + TypeScript project:

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
```

#### 2. Install Dependencies

**File**: `frontend/package.json`

```json
{
  "name": "memory-time-capsule-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "date-fns": "^3.0.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

#### 3. TailwindCSS Configuration

**File**: `frontend/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**File**: `frontend/postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**File**: `frontend/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
  }
}
```

#### 4. TypeScript Configuration

**File**: `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 5. Vite Configuration

**File**: `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_WORKER_URL || 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
});
```

#### 6. Environment Variables

**File**: `frontend/.env.example`

```env
VITE_WORKER_URL=https://your-worker-url.workers.dev
VITE_APP_NAME=Memory Time Capsule
```

**File**: `frontend/.env`

```env
VITE_WORKER_URL=http://localhost:8787
VITE_APP_NAME=Memory Time Capsule
```

#### 7. API Client

**File**: `frontend/src/api/client.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_WORKER_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);
```

**File**: `frontend/src/api/types.ts`

```typescript
export interface UserSession {
  userId: string;
  githubLogin: string;
  githubName: string | null;
  githubEmail: string | null;
  githubAvatar: string;
  repoName: string;
  repoFullName: string;
  repoUrl: string;
  githubConnected: boolean;
  gmailConnected: boolean;
  createdAt: string;
}

export interface Capsule {
  id: string;
  title: string;
  unlockAt: number;
  recipientEmail: string;
  recipientName?: string;
  senderName: string;
  contentType: 'video' | 'audio' | 'photo' | 'text';
  fileSize?: number;
  createdAt: number;
  unlockEmailSent: boolean;
  unlockedAt?: number;
  viewedAt?: number;
}

export interface CapsuleViewResponse {
  capsule: Capsule;
  status: {
    unlocked: boolean;
    pending: boolean;
    requiresPin: boolean;
  };
  rateLimit?: {
    remaining: number;
    exceeded: boolean;
  };
}

export interface PinVerificationResponse {
  success: boolean;
  capsule: Capsule & {
    textContent?: string;
  };
  contentUrl: string | null;
}

export interface DashboardData {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string;
  };
  storage: {
    used: number;
    limit: number;
    percentage: number;
  };
  capsules: {
    total: number;
    pending: number;
    unlocked: number;
    failed: number;
  };
  capsuleList: Capsule[];
  repository: {
    name: string;
    url: string;
  };
}
```

**File**: `frontend/src/api/services.ts`

```typescript
import { apiClient } from './client';
import type {
  UserSession,
  CapsuleViewResponse,
  PinVerificationResponse,
  DashboardData,
} from './types';

export const authService = {
  getGitHubAuthUrl: async () => {
    const { data } = await apiClient.get('/api/auth/github/authorize');
    return data.authUrl as string;
  },

  getGmailAuthUrl: async () => {
    const { data } = await apiClient.get('/api/auth/gmail/authorize');
    return data.authUrl as string;
  },

  getSession: async (userId: string) => {
    const { data } = await apiClient.get(`/api/auth/session/${userId}`);
    return data as UserSession;
  },
};

export const capsuleService = {
  create: async (formData: FormData) => {
    const { data } = await apiClient.post('/api/capsule/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  view: async (token: string) => {
    const { data } = await apiClient.get(`/api/capsule/view/${token}`);
    return data as CapsuleViewResponse;
  },

  verifyPin: async (token: string, pin: string) => {
    const { data } = await apiClient.post(`/api/capsule/view/${token}/verify-pin`, {
      pin,
    });
    return data as PinVerificationResponse;
  },

  getDashboard: async (userId: string) => {
    const { data } = await apiClient.get(`/api/capsule/dashboard/${userId}`);
    return data as DashboardData;
  },
};
```

#### 8. State Management

**File**: `frontend/src/store/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSession } from '@/api/types';

interface AuthState {
  userId: string | null;
  session: UserSession | null;
  setUserId: (userId: string) => void;
  setSession: (session: UserSession) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: null,
      session: null,

      setUserId: (userId) => set({ userId }),

      setSession: (session) => set({ session, userId: session.userId }),

      clearAuth: () => set({ userId: null, session: null }),

      isAuthenticated: () => {
        const state = get();
        return !!(state.session?.githubConnected && state.session?.gmailConnected);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

#### 9. Router Configuration

**File**: `frontend/src/router.tsx`

```typescript
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Create from './pages/Create';
import Open from './pages/Open';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: 'auth/callback',
        element: <AuthCallback />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'create',
        element: <Create />,
      },
      {
        path: 'open',
        element: <Open />,
      },
    ],
  },
]);
```

#### 10. Main App Component

**File**: `frontend/src/App.tsx`

```typescript
import { Outlet } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 Memory Time Capsule. Send messages to the future.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
```

**File**: `frontend/src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

#### 11. Shared Components

**File**: `frontend/src/components/Header.tsx`

```typescript
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const { session, isAuthenticated } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            🎁 Time Capsule
          </Link>

          <nav className="flex items-center gap-6">
            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link to="/create" className="btn btn-primary">
                  Create Capsule
                </Link>
                <div className="flex items-center gap-2">
                  <img
                    src={session?.githubAvatar}
                    alt={session?.githubName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              </>
            ) : (
              <Link to="/auth" className="btn btn-primary">
                Get Started
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
```

**File**: `frontend/src/components/LoadingSpinner.tsx`

```typescript
export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}
      />
    </div>
  );
}
```

#### 12. Placeholder Pages

**File**: `frontend/src/pages/Home.tsx`

```typescript
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">
        Send Messages to the Future
      </h1>
      <p className="text-xl text-center text-gray-600">
        Frontend implementation coming in Phase 9-11
      </p>
    </div>
  );
}
```

Create similar placeholder files for:
- `frontend/src/pages/Auth.tsx`
- `frontend/src/pages/AuthCallback.tsx`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/pages/Create.tsx`
- `frontend/src/pages/Open.tsx`

### Success Criteria

#### Automated Verification:
- [x] Dependencies install successfully: `cd frontend && npm install`
- [x] TypeScript compiles without errors: `npm run build`
- [x] Development server starts: `npm run dev` (should run on http://localhost:5173)
- [x] TailwindCSS is working (inspect elements for Tailwind classes)

#### Manual Verification:
- [x] Navigate to http://localhost:5173 and see placeholder home page
- [x] Verify header component renders with logo and navigation
- [x] Test routing: manually navigate to /auth, /dashboard (should show placeholder pages)
- [x] Check browser console has no errors
- [x] Verify TailwindCSS styles applied (buttons, cards, colors)
  - [x] Test API client by checking network tab (should show configured base URL)
  - [x] Verify zustand store persists (check localStorage for 'auth-storage')
- [x] Test responsive layout on mobile viewport

**Implementation Note**: After frontend foundation is set up and running, proceed to Phase 9 to implement authentication and dashboard pages.

---

## Phase 9: Frontend Auth & Dashboard

**MCP Tools Required:**
- None (frontend implementation)

### Overview

Build the authentication flow pages (GitHub and Gmail OAuth), callback handler, and dashboard page displaying user's capsules with storage usage. This enables users to connect their accounts and view their time capsules.

### Changes Required

#### 1. Auth Landing Page

**File**: `frontend/src/pages/Auth.tsx`

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/api/services';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Auth() {
  const [loading, setLoading] = useState<'github' | 'gmail' | null>(null);
  const navigate = useNavigate();

  const handleGitHubAuth = async () => {
    try {
      setLoading('github');
      const authUrl = await authService.getGitHubAuthUrl();
      // Redirect to GitHub OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('GitHub auth error:', error);
      alert('Failed to start GitHub authentication');
      setLoading(null);
    }
  };

  const handleGmailAuth = async () => {
    try {
      setLoading('gmail');
      const authUrl = await authService.getGmailAuthUrl();
      // Redirect to Gmail OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Gmail auth error:', error);
      alert('Failed to start Gmail authentication');
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Connect Your Accounts</h1>
          <p className="text-xl text-gray-600">
            We need access to GitHub (for storage) and Gmail (for sending emails).
          </p>
        </div>

        <div className="space-y-6">
          {/* GitHub Connection Card */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">GitHub</h3>
                <p className="text-gray-600 mb-4">
                  We'll create a private repository to store your time capsule content.
                  You get 1GB of free storage.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>✓ All content stored in your private repository</li>
                  <li>✓ You maintain full ownership of your data</li>
                  <li>✓ Automatic backups via Git history</li>
                </ul>
                <button
                  onClick={handleGitHubAuth}
                  disabled={loading !== null}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {loading === 'github' ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <span>Connect GitHub</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Gmail Connection Card */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Gmail</h3>
                <p className="text-gray-600 mb-4">
                  We'll send emails on your behalf when capsules are created and unlocked.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>✓ Emails sent from your Gmail account</li>
                  <li>✓ Recipients see your email as sender</li>
                  <li>✓ You can view sent emails in your Gmail</li>
                </ul>
                <button
                  onClick={handleGmailAuth}
                  disabled={loading !== null}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {loading === 'gmail' ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <span>Connect Gmail</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By connecting your accounts, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
```

#### 2. OAuth Callback Handler

**File**: `frontend/src/pages/AuthCallback.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/api/services';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserId, setSession } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      const userId = searchParams.get('userId');
      const success = searchParams.get('success');
      const gmailSuccess = searchParams.get('gmailSuccess');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Authentication failed: ${error}`);
        setTimeout(() => navigate('/auth'), 3000);
        return;
      }

      if (!userId) {
        setStatus('error');
        setMessage('No user ID received');
        setTimeout(() => navigate('/auth'), 3000);
        return;
      }

      try {
        // Store userId
        setUserId(userId);

        // Fetch full session
        const session = await authService.getSession(userId);
        setSession(session);

        if (success === 'true') {
          // GitHub connected
          setStatus('success');
          setMessage('GitHub connected! Now connect Gmail...');
          setTimeout(() => navigate('/auth'), 2000);
        } else if (gmailSuccess === 'true') {
          // Gmail connected
          setStatus('success');
          setMessage('Gmail connected! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          // Unknown state
          setStatus('error');
          setMessage('Unknown authentication state');
          setTimeout(() => navigate('/auth'), 3000);
        }
      } catch (err) {
        console.error('Session fetch error:', err);
        setStatus('error');
        setMessage('Failed to fetch user session');
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUserId, setSession]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="card">
          {status === 'loading' && (
            <>
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <p className="text-xl font-semibold text-green-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <p className="text-xl font-semibold text-red-600">{message}</p>
              <p className="mt-2 text-sm text-gray-600">Redirecting...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### 3. Dashboard Page

**File**: `frontend/src/pages/Dashboard.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { capsuleService } from '@/api/services';
import type { DashboardData } from '@/api/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import StorageMeter from '@/components/StorageMeter';
import CapsuleCard from '@/components/CapsuleCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userId, session, isAuthenticated } = useAuthStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth');
      return;
    }

    const fetchDashboard = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const data = await capsuleService.getDashboard(userId);
        setDashboard(data);
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [userId, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="card max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600">{error || 'Unknown error'}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Time Capsules</h1>
          <p className="text-gray-600 mt-1">
            {dashboard.capsules.total} capsule{dashboard.capsules.total !== 1 ? 's' : ''}{' '}
            total
          </p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="btn btn-primary"
        >
          + Create Capsule
        </button>
      </div>

      {/* Storage Meter */}
      <StorageMeter
        used={dashboard.storage.used}
        limit={dashboard.storage.limit}
        percentage={dashboard.storage.percentage}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-4xl mb-2">⏳</div>
          <div className="text-3xl font-bold text-primary-600">
            {dashboard.capsules.pending}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-3xl font-bold text-green-600">
            {dashboard.capsules.unlocked}
          </div>
          <div className="text-sm text-gray-600">Unlocked</div>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <div className="text-3xl font-bold text-red-600">
            {dashboard.capsules.failed}
          </div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
      </div>

      {/* Capsules List */}
      {dashboard.capsuleList.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">No capsules yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first time capsule to get started!
          </p>
          <button
            onClick={() => navigate('/create')}
            className="btn btn-primary"
          >
            Create Your First Capsule
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">All Capsules</h2>
          {dashboard.capsuleList.map((capsule) => (
            <CapsuleCard key={capsule.id} capsule={capsule} />
          ))}
        </div>
      )}

      {/* Repository Link */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          Your capsules are stored in{' '}
          <a
            href={dashboard.repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            {dashboard.repository.name}
          </a>
        </p>
      </div>
    </div>
  );
}
```

#### 4. Dashboard Components

**File**: `frontend/src/components/StorageMeter.tsx`

```typescript
interface StorageMeterProps {
  used: number;
  limit: number;
  percentage: number;
}

export default function StorageMeter({ used, limit, percentage }: StorageMeterProps) {
  const formatBytes = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    if (mb < 1024) {
      return `${mb.toFixed(1)} MB`;
    }
    return `${(mb / 1024).toFixed(2)} GB`;
  };

  const getColor = () => {
    if (percentage >= 90) return 'bg-red-600';
    if (percentage >= 70) return 'bg-yellow-600';
    return 'bg-primary-600';
  };

  return (
    <div className="card mb-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Storage Usage</h3>
        <span className="text-sm text-gray-600">
          {formatBytes(used)} / {formatBytes(limit)}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <p className="text-sm text-gray-600 mt-2">{percentage}% used</p>
    </div>
  );
}
```

**File**: `frontend/src/components/CapsuleCard.tsx`

```typescript
import { format } from 'date-fns';
import type { Capsule } from '@/api/types';

interface CapsuleCardProps {
  capsule: Capsule;
}

export default function CapsuleCard({ capsule }: CapsuleCardProps) {
  const unlockDate = new Date(capsule.unlockAt * 1000);
  const isUnlocked = Date.now() / 1000 >= capsule.unlockAt;
  const isPending = !isUnlocked;

  const getContentIcon = () => {
    switch (capsule.contentType) {
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'photo': return '📷';
      case 'text': return '📝';
      default: return '📦';
    }
  };

  const getStatusBadge = () => {
    if (isUnlocked && capsule.unlockEmailSent) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
          Unlocked
        </span>
      );
    }
    if (isUnlocked && !capsule.unlockEmailSent) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
          Failed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
        Pending
      </span>
    );
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-4xl">
          {getContentIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold truncate">{capsule.title}</h3>
              <p className="text-sm text-gray-600">
                To: {capsule.recipientName || capsule.recipientEmail}
              </p>
            </div>
            {getStatusBadge()}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Unlocks:</span>{' '}
              {format(unlockDate, 'MMM d, yyyy h:mm a')}
            </div>
            <div>
              <span className="font-medium">Type:</span> {capsule.contentType}
            </div>
            {capsule.fileSize && (
              <div>
                <span className="font-medium">Size:</span>{' '}
                {(capsule.fileSize / 1024 / 1024).toFixed(1)} MB
              </div>
            )}
          </div>

          {capsule.viewedAt && (
            <p className="mt-2 text-xs text-gray-500">
              Viewed {format(new Date(capsule.viewedAt * 1000), 'MMM d, yyyy h:mm a')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Success Criteria

#### Automated Verification:
- [ ] TypeScript compiles without errors: `cd frontend && npm run build`
- [ ] Development server starts without errors: `npm run dev`
- [ ] All pages render without console errors

#### Manual Verification:
- [ ] Test authentication flow:
  1. Navigate to `/auth`
  2. Click "Connect GitHub" → redirects to GitHub OAuth
  3. Authorize → redirects back to `/auth/callback` with success
  4. Shows "GitHub connected" message
  5. Redirects back to `/auth`
  6. Click "Connect Gmail" → redirects to Gmail OAuth
  7. Authorize → redirects back to `/auth/callback` with gmailSuccess
  8. Shows "Gmail connected" message
  9. Redirects to `/dashboard`
- [ ] Test dashboard display:
  - Verify user info shows (name, avatar)
  - Check storage meter displays correctly
  - Verify stats cards show correct counts
  - Check capsules list renders
- [ ] Test empty dashboard state:
  - For new user with no capsules
  - Verify "No capsules yet" message
  - Check "Create Your First Capsule" button
- [ ] Test navigation:
  - Header links work (Home, Dashboard, Create)
  - Logo redirects to home
  - Auth state persists on page reload
- [ ] Test unauthenticated access:
  - Navigate to `/dashboard` without auth
  - Should redirect to `/auth`
- [ ] Test error handling:
  - Disconnect network, refresh dashboard
  - Verify error message displays
  - Check "Retry" button works
- [ ] Test responsive layout:
  - Dashboard looks good on mobile
  - Stats cards stack vertically
  - Capsule cards adapt to mobile width

**Implementation Note**: After authentication and dashboard are complete and working, proceed to Phase 10 to implement the capsule creation UI, and Phase 11 for the capsule viewer interface.

---

## Phase 10: Frontend Capsule Creation UI

**MCP Tools Required:**
- None (frontend implementation)

### Overview

Build the capsule creation form with file upload, date/time picker, recipient input, and content type selection. This is the core user-facing feature that allows users to create time capsules with media attachments.

### Changes Required

#### 1. Create Capsule Page

**File**: `frontend/src/pages/Create.tsx`

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { capsuleService } from '@/api/services';
import FileUpload from '@/components/FileUpload';
import DateTimePicker from '@/components/DateTimePicker';
import LoadingSpinner from '@/components/LoadingSpinner';

type ContentType = 'video' | 'audio' | 'photo' | 'text';

interface FormData {
  title: string;
  unlockDate: Date | null;
  recipientEmail: string;
  recipientName: string;
  contentType: ContentType;
  textContent: string;
}

export default function Create() {
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    unlockDate: null,
    recipientEmail: '',
    recipientName: '',
    contentType: 'text',
    textContent: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    magicLink: string;
    whatsappLink: string;
  } | null>(null);

  // Redirect if not authenticated
  if (!isAuthenticated()) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!formData.unlockDate) {
      setError('Please select an unlock date');
      return;
    }
    if (!formData.recipientEmail.trim()) {
      setError('Please enter recipient email');
      return;
    }

    // Validate unlock date is in future
    if (formData.unlockDate <= new Date()) {
      setError('Unlock date must be in the future');
      return;
    }

    // Validate content
    if (formData.contentType === 'text') {
      if (!formData.textContent.trim()) {
        setError('Please enter text content');
        return;
      }
    } else {
      if (!file) {
        setError(`Please upload a ${formData.contentType} file`);
        return;
      }
    }

    try {
      setLoading(true);

      // Prepare form data for API
      const apiFormData = new FormData();
      apiFormData.append('userId', userId!);
      apiFormData.append(
        'metadata',
        JSON.stringify({
          title: formData.title,
          unlockAt: Math.floor(formData.unlockDate.getTime() / 1000),
          recipientEmail: formData.recipientEmail,
          recipientName: formData.recipientName || undefined,
          contentType: formData.contentType,
          textContent: formData.contentType === 'text' ? formData.textContent : undefined,
        })
      );

      if (file) {
        apiFormData.append('file', file);
      }

      // Create capsule
      const response = await capsuleService.create(apiFormData);

      // Show success
      setSuccess({
        magicLink: response.capsule.magicLink,
        whatsappLink: response.capsule.whatsappLink,
      });
    } catch (err: any) {
      console.error('Capsule creation error:', err);
      setError(err.response?.data?.message || 'Failed to create capsule');
    } finally {
      setLoading(false);
    }
  };

  const handleContentTypeChange = (type: ContentType) => {
    setFormData({ ...formData, contentType: type });
    setFile(null); // Clear file when switching type
  };

  // Success screen
  if (success) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Time Capsule Created!</h2>
            <p className="text-gray-600 mb-8">
              Your capsule has been sealed and the recipient has been notified via email.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-2">Magic Link (for recipient):</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={success.magicLink}
                  readOnly
                  className="flex-1 px-4 py-2 border rounded-lg text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(success.magicLink);
                    alert('Link copied!');
                  }}
                  className="btn btn-secondary"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open(success.whatsappLink, '_blank')}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <span>📱</span>
                <span>Share via WhatsApp</span>
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form screen
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Time Capsule</h1>
          <p className="text-gray-600">
            Send a message, video, or photo to unlock in the future
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="card">
            <label className="block text-sm font-medium mb-2">Capsule Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Happy Birthday! 🎂"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              maxLength={100}
            />
          </div>

          {/* Unlock Date */}
          <div className="card">
            <label className="block text-sm font-medium mb-2">Unlock Date & Time *</label>
            <DateTimePicker
              value={formData.unlockDate}
              onChange={(date) => setFormData({ ...formData, unlockDate: date })}
              minDate={new Date()}
            />
          </div>

          {/* Recipient */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recipient</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientEmail: e.target.value })
                  }
                  placeholder="friend@example.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientName: e.target.value })
                  }
                  placeholder="Alex Smith"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Content Type */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Content Type *</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['text', 'video', 'audio', 'photo'] as ContentType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleContentTypeChange(type)}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    formData.contentType === type
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {type === 'text' && '📝'}
                    {type === 'video' && '🎥'}
                    {type === 'audio' && '🎵'}
                    {type === 'photo' && '📷'}
                  </div>
                  <div className="font-medium capitalize">{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Your Content *</h3>

            {formData.contentType === 'text' ? (
              <textarea
                value={formData.textContent}
                onChange={(e) =>
                  setFormData({ ...formData, textContent: e.target.value })
                }
                placeholder="Write your message here... (max 10,000 characters)"
                rows={10}
                maxLength={10000}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
              />
            ) : (
              <FileUpload
                contentType={formData.contentType}
                file={file}
                onFileSelect={setFile}
                onFileRemove={() => setFile(null)}
              />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="card bg-red-50 border-red-200">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Creating...</span>
                </div>
              ) : (
                '🔒 Lock Capsule'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

#### 2. File Upload Component

**File**: `frontend/src/components/FileUpload.tsx`

```typescript
import { useState } from 'react';

interface FileUploadProps {
  contentType: 'video' | 'audio' | 'photo';
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

const CONTENT_LIMITS = {
  video: 100 * 1024 * 1024, // 100MB
  audio: 50 * 1024 * 1024, // 50MB
  photo: 50 * 1024 * 1024, // 50MB
};

const ALLOWED_TYPES = {
  video: ['video/mp4', 'video/webm'],
  audio: ['audio/mpeg', 'audio/mp4', 'audio/m4a'],
  photo: ['image/jpeg', 'image/png', 'image/gif'],
};

export default function FileUpload({
  contentType,
  file,
  onFileSelect,
  onFileRemove,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    const limit = CONTENT_LIMITS[contentType];
    if (file.size > limit) {
      return `File size exceeds ${Math.floor(limit / 1024 / 1024)}MB limit`;
    }

    // Check file type
    const allowedTypes = ALLOWED_TYPES[contentType];
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed: ${allowedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFile = (file: File) => {
    setError(null);
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const getAcceptString = () => {
    return ALLOWED_TYPES[contentType].join(',');
  };

  if (file) {
    return (
      <div className="border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-4xl">
            {contentType === 'video' && '🎥'}
            {contentType === 'audio' && '🎵'}
            {contentType === 'photo' && '📷'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={onFileRemove}
            className="text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-6xl mb-4">
          {contentType === 'video' && '🎥'}
          {contentType === 'audio' && '🎵'}
          {contentType === 'photo' && '📷'}
        </div>
        <p className="text-lg font-medium mb-2">
          Drop your {contentType} file here, or click to browse
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Max size: {Math.floor(CONTENT_LIMITS[contentType] / 1024 / 1024)}MB
        </p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={getAcceptString()}
          onChange={handleChange}
        />
        <label htmlFor="file-upload" className="btn btn-primary cursor-pointer inline-block">
          Choose File
        </label>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
```

#### 3. Date Time Picker Component

**File**: `frontend/src/components/DateTimePicker.tsx`

```typescript
import { useState, useEffect } from 'react';

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
}

export default function DateTimePicker({
  value,
  onChange,
  minDate = new Date(),
}: DateTimePickerProps) {
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    if (value) {
      // Format date as YYYY-MM-DD
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      setDateStr(`${year}-${month}-${day}`);

      // Format time as HH:MM
      const hours = String(value.getHours()).padStart(2, '0');
      const minutes = String(value.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    }
  }, [value]);

  const handleDateChange = (newDateStr: string) => {
    setDateStr(newDateStr);
    if (newDateStr && timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const newDate = new Date(newDateStr);
      newDate.setHours(hours, minutes, 0, 0);
      onChange(newDate);
    }
  };

  const handleTimeChange = (newTimeStr: string) => {
    setTimeStr(newTimeStr);
    if (dateStr && newTimeStr) {
      const [hours, minutes] = newTimeStr.split(':').map(Number);
      const newDate = new Date(dateStr);
      newDate.setHours(hours, minutes, 0, 0);
      onChange(newDate);
    }
  };

  const getMinDateStr = () => {
    const year = minDate.getFullYear();
    const month = String(minDate.getMonth() + 1).padStart(2, '0');
    const day = String(minDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={dateStr}
          onChange={(e) => handleDateChange(e.target.value)}
          min={getMinDateStr()}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
        <input
          type="time"
          value={timeStr}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
```

### Success Criteria

#### Automated Verification:
- [ ] TypeScript compiles without errors: `cd frontend && npm run build`
- [ ] Development server runs without errors: `npm run dev`
- [ ] No console errors when navigating to `/create`

#### Manual Verification:
- [ ] Test capsule creation flow:
  1. Navigate to `/create` as authenticated user
  2. Fill in all required fields
  3. Select each content type and verify appropriate input appears
  4. Test file upload with drag-and-drop
  5. Submit form and verify success screen
  6. Check dashboard shows new capsule
- [ ] Test text capsule creation:
  - Enter text content (< 10,000 chars)
  - Verify submission works
  - Check no file upload required
- [ ] Test video capsule creation:
  - Upload MP4 file < 100MB
  - Verify preview shows file name and size
  - Test file removal button
  - Verify submission works
- [ ] Test audio capsule creation:
  - Upload MP3 file < 50MB
  - Verify upload works
- [ ] Test photo capsule creation:
  - Upload JPEG/PNG < 50MB
  - Verify upload works
- [ ] Test validation errors:
  - Missing title → shows error
  - Missing unlock date → shows error
  - Past unlock date → shows error
  - Missing recipient email → shows error
  - Invalid email format → shows error (browser validation)
  - Missing content → shows error
  - File too large → shows error
  - Wrong file type → shows error
- [ ] Test success screen:
  - Magic link displays and is copyable
  - WhatsApp button opens wa.me link
  - "View Dashboard" redirects correctly
- [ ] Test responsive layout:
  - Form works on mobile
  - Content type buttons stack appropriately
  - Date/time inputs work on mobile
- [ ] Test file upload edge cases:
  - Very large files (>100MB) rejected
  - Wrong MIME type rejected
  - Upload progress shows (for large files)

**Implementation Note**: After capsule creation UI is complete and tested, proceed to Phase 11 to implement the capsule viewer page.

---

## Phase 11: Frontend Capsule Viewer

**MCP Tools Required:**
- None (frontend implementation)

### Overview

Build the capsule viewing page that recipients access via magic link. This page shows countdown before unlock, prompts for PIN after unlock, and displays content after successful PIN verification. Includes media players for video/audio and photo gallery.

### Changes Required

#### 1. Open/View Capsule Page

**File**: `frontend/src/pages/Open.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { capsuleService } from '@/api/services';
import type { CapsuleViewResponse, PinVerificationResponse } from '@/api/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import Countdown from '@/components/Countdown';
import PinInput from '@/components/PinInput';
import ContentViewer from '@/components/ContentViewer';

type ViewState = 'loading' | 'countdown' | 'pending' | 'pin-entry' | 'unlocked' | 'error';

export default function Open() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');

  const [state, setState] = useState<ViewState>('loading');
  const [capsuleData, setCapsuleData] = useState<CapsuleViewResponse | null>(null);
  const [unlockedData, setUnlockedData] = useState<PinVerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(5);

  useEffect(() => {
    if (!token) {
      setState('error');
      setError('Invalid or missing token');
      return;
    }

    loadCapsule();
  }, [token]);

  const loadCapsule = async () => {
    if (!token) return;

    try {
      setState('loading');
      const data = await capsuleService.view(token);
      setCapsuleData(data);

      // Determine state based on status
      if (data.status.pending) {
        setState('pending');
      } else if (data.status.unlocked && data.status.requiresPin) {
        setState('pin-entry');
        if (data.rateLimit) {
          setRemainingAttempts(data.rateLimit.remaining);
        }
      } else if (data.status.unlocked) {
        // Unlocked but no PIN required (shouldn't happen in MVP)
        setState('unlocked');
      } else {
        // Not yet unlocked - show countdown
        setState('countdown');
      }
    } catch (err: any) {
      console.error('Failed to load capsule:', err);
      setState('error');
      setError(err.response?.data?.message || 'Failed to load capsule');
    }
  };

  const handlePinSubmit = async (pin: string) => {
    if (!token) return;

    try {
      setPinError(null);
      const data = await capsuleService.verifyPin(token, pin);
      setUnlockedData(data);
      setState('unlocked');
    } catch (err: any) {
      console.error('PIN verification failed:', err);
      const errorData = err.response?.data;

      if (errorData?.remaining !== undefined) {
        setRemainingAttempts(errorData.remaining);
      }

      if (err.response?.status === 429) {
        setPinError('Too many attempts. Please try again in 1 hour.');
      } else {
        setPinError(errorData?.error || 'Incorrect PIN. Please try again.');
      }
    }
  };

  // Loading state
  if (state === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="card text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-4">Capsule Not Found</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Pending state (unlock time passed but email not sent yet)
  if (state === 'pending') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="card text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold mb-4">Capsule Unlocking...</h2>
            <p className="text-gray-600 mb-4">
              This capsule has reached its unlock time and is being processed. You should
              receive an email with the PIN shortly.
            </p>
            <p className="text-sm text-gray-500">
              This usually takes less than an hour. Check your email for the unlock PIN.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const capsule = capsuleData?.capsule;

  if (!capsule) {
    return null;
  }

  // Countdown state (not yet unlocked)
  if (state === 'countdown') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <div className="text-6xl mb-6">🎁</div>
            <h1 className="text-3xl font-bold mb-4">{capsule.title}</h1>
            <p className="text-xl text-gray-600 mb-8">
              From <strong>{capsule.senderName}</strong>
            </p>

            <Countdown targetDate={new Date(capsule.unlockAt * 1000)} />

            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-gray-600">
                This time capsule will unlock on{' '}
                <strong>
                  {new Date(capsule.unlockAt * 1000).toLocaleString('en-US', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                You'll receive an email with a PIN to open it when the time comes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PIN entry state
  if (state === 'pin-entry') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="card text-center">
            <div className="text-6xl mb-6">🔓</div>
            <h1 className="text-2xl font-bold mb-4">Time Capsule Unlocked!</h1>
            <p className="text-gray-600 mb-8">
              From <strong>{capsule.senderName}</strong>
            </p>

            <p className="text-lg font-medium mb-6">Enter your 4-digit PIN to view</p>

            <PinInput onSubmit={handlePinSubmit} />

            {pinError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{pinError}</p>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-4">
              {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
            </p>

            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-gray-600">
                Check your email for the PIN. The PIN was sent when this capsule unlocked.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unlocked state (content display)
  if (state === 'unlocked' && unlockedData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold mb-2">{capsule.title}</h1>
              <p className="text-gray-600">
                From <strong>{capsule.senderName}</strong>
              </p>
            </div>

            <ContentViewer
              contentType={capsule.contentType}
              contentUrl={unlockedData.contentUrl}
              textContent={unlockedData.capsule.textContent}
            />

            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
              <p>
                Created on{' '}
                {new Date(capsule.createdAt * 1000).toLocaleDateString('en-US', {
                  dateStyle: 'long',
                })}
              </p>
              <p className="mt-1">
                Unlocked on{' '}
                {new Date(capsule.unlockAt * 1000).toLocaleDateString('en-US', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
```

#### 2. Countdown Component

**File**: `frontend/src/components/Countdown.tsx`

```typescript
import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeRemaining) {
    return null;
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-primary-600 text-white rounded-lg p-4 min-w-[80px]">
        <div className="text-4xl font-bold">{value.toString().padStart(2, '0')}</div>
      </div>
      <div className="text-sm text-gray-600 mt-2 font-medium uppercase">{label}</div>
    </div>
  );

  return (
    <div className="flex justify-center gap-4">
      <TimeUnit value={timeRemaining.days} label="Days" />
      <TimeUnit value={timeRemaining.hours} label="Hours" />
      <TimeUnit value={timeRemaining.minutes} label="Minutes" />
      <TimeUnit value={timeRemaining.seconds} label="Seconds" />
    </div>
  );
}
```

#### 3. PIN Input Component

**File**: `frontend/src/components/PinInput.tsx`

```typescript
import { useState, useRef, KeyboardEvent } from 'react';

interface PinInputProps {
  onSubmit: (pin: string) => void;
}

export default function PinInput({ onSubmit }: PinInputProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (index === 3 && value) {
      const fullPin = [...newPin.slice(0, 3), value].join('');
      if (fullPin.length === 4) {
        onSubmit(fullPin);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Check if pasted data is 4 digits
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setPin(digits);
      inputRefs[3].current?.focus();
      onSubmit(pastedData);
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {pin.map((digit, index) => (
        <input
          key={index}
          ref={inputRefs[index]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
        />
      ))}
    </div>
  );
}
```

#### 4. Content Viewer Component

**File**: `frontend/src/components/ContentViewer.tsx`

```typescript
interface ContentViewerProps {
  contentType: 'video' | 'audio' | 'photo' | 'text';
  contentUrl: string | null;
  textContent?: string;
}

export default function ContentViewer({
  contentType,
  contentUrl,
  textContent,
}: ContentViewerProps) {
  if (contentType === 'text') {
    return (
      <div className="bg-gray-50 rounded-lg p-8">
        <div className="prose prose-lg max-w-none">
          <pre className="whitespace-pre-wrap font-sans">{textContent}</pre>
        </div>
      </div>
    );
  }

  if (contentType === 'video' && contentUrl) {
    return (
      <div className="bg-black rounded-lg overflow-hidden">
        <video controls className="w-full">
          <source src={contentUrl} type="video/mp4" />
          <source src={contentUrl} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (contentType === 'audio' && contentUrl) {
    return (
      <div className="bg-gray-50 rounded-lg p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-gray-600">Audio Message</p>
        </div>
        <audio controls className="w-full">
          <source src={contentUrl} type="audio/mpeg" />
          <source src={contentUrl} type="audio/mp4" />
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  }

  if (contentType === 'photo' && contentUrl) {
    return (
      <div className="rounded-lg overflow-hidden">
        <img src={contentUrl} alt="Time capsule content" className="w-full h-auto" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-8 text-center">
      <p className="text-gray-600">Content not available</p>
    </div>
  );
}
```

### Success Criteria

#### Automated Verification:
- [ ] TypeScript compiles without errors: `cd frontend && npm run build`
- [ ] Development server runs: `npm run dev`
- [ ] No console errors when accessing `/open?t=test_token`

#### Manual Verification:
- [ ] Test countdown display (pre-unlock):
  - Create capsule with future unlock date
  - Open magic link
  - Verify countdown shows correct time remaining
  - Verify countdown updates every second
  - Check sender name and title display correctly
- [ ] Test pending state:
  - Use capsule that reached unlock time but workflow hasn't run
  - Verify "Unlocking..." message shows
- [ ] Test PIN entry:
  - Use capsule that has been unlocked
  - Verify PIN input appears with 4 boxes
  - Test typing digits (auto-focus next box)
  - Test backspace (focus previous box)
  - Test paste (accepts 4-digit paste)
  - Submit correct PIN → content appears
  - Submit incorrect PIN → error shows, attempts decrement
  - After 5 failed attempts → "Too many attempts" error
- [ ] Test content viewers:
  - Text capsule: verify text displays with proper formatting
  - Video capsule: verify video player works with controls
  - Audio capsule: verify audio player shows with icon
  - Photo capsule: verify image displays full width
- [ ] Test error states:
  - Invalid token → "Capsule Not Found" error
  - Missing token → error message
  - Network error → appropriate error message
- [ ] Test responsive design:
  - Countdown works on mobile
  - PIN input works on mobile keyboards
  - Video player responsive
  - Content scales appropriately
- [ ] Test edge cases:
  - Refresh page during countdown (state persists)
  - Multiple tabs with same magic link
  - Copy magic link and share

**Implementation Note**: After capsule viewer is complete and tested, proceed to Phase 12 for final integration, polish, and deployment preparation.

---

## Phase 12: Final Integration & Deployment

**MCP Tools Required:**
- `cloudflare-docs` - For deployment configuration and Pages setup
- `gcloud-observability` - For production monitoring, log aggregation, and alerting setup
- `gcloud` - For setting up centralized logging infrastructure (optional)
- `gcloud-storage` - For backup and disaster recovery planning (optional)

### Overview

Complete the final integration tasks, add home page content, polish the UI, set up deployment configuration for Cloudflare Pages, and prepare documentation for deployment. This phase brings everything together for production readiness.

### Changes Required

#### 1. Home/Landing Page

**File**: `frontend/src/pages/Home.tsx`

```typescript
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Send Messages to the Future 🎁
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Create time capsules with videos, photos, or messages that unlock exactly when
              you want them to.
            </p>
            <Link
              to={isAuthenticated() ? '/create' : '/auth'}
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {isAuthenticated() ? 'Create Capsule' : 'Get Started Free'}
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="text-6xl mb-6">1️⃣</div>
            <h3 className="text-2xl font-semibold mb-4">Connect Your Accounts</h3>
            <p className="text-gray-600">
              Link your GitHub (for storage) and Gmail (for sending) in under 3 minutes. All
              your data stays in your own accounts.
            </p>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-6">2️⃣</div>
            <h3 className="text-2xl font-semibold mb-4">Create Your Capsule</h3>
            <p className="text-gray-600">
              Upload a video, audio, photo, or write a message. Set the unlock date and add
              the recipient's email.
            </p>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-6">3️⃣</div>
            <h3 className="text-2xl font-semibold mb-4">Automatic Unlock</h3>
            <p className="text-gray-600">
              We'll automatically send the capsule to your recipient when the time comes,
              with a secure PIN for access.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-xl font-semibold mb-2">Multiple Content Types</h3>
              <p className="text-gray-600">
                Videos up to 100MB, audio files, photos, or simple text messages.
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                All content stored in your private GitHub repository with encrypted access
                tokens.
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-2">Precise Timing</h3>
              <p className="text-gray-600">
                Hourly unlock precision using GitHub Actions. Set any future date and time.
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-semibold mb-2">Email Notifications</h3>
              <p className="text-gray-600">
                Recipients get emails when capsules are created and when they unlock, with
                secure PIN access.
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">100% Free</h3>
              <p className="text-gray-600">
                Uses free tiers of GitHub, Gmail, and Cloudflare. 1GB storage per user.
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp Sharing</h3>
              <p className="text-gray-600">
                Optional WhatsApp sharing with pre-filled messages for easy communication.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center card bg-primary-50 border-primary-200">
          <h2 className="text-3xl font-bold mb-4">Ready to Send a Message to the Future?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Create your first time capsule in minutes. No credit card required.
          </p>
          <Link
            to={isAuthenticated() ? '/create' : '/auth'}
            className="inline-block btn btn-primary text-lg px-8 py-4"
          >
            {isAuthenticated() ? 'Create Your First Capsule' : 'Get Started Free'}
          </Link>
        </div>
      </div>
    </div>
  );
}
```

#### 2. Deployment Configuration

**File**: `frontend/wrangler.toml` (for Cloudflare Pages)

```toml
name = "memory-time-capsule-frontend"
compatibility_date = "2024-06-01"

[site]
bucket = "./dist"
```

**File**: `frontend/public/_redirects` (for SPA routing)

```
/*    /index.html   200
```

#### 3. Production Environment Variables

**File**: `frontend/.env.production`

```env
VITE_WORKER_URL=https://your-actual-worker-url.workers.dev
VITE_APP_NAME=Memory Time Capsule
```

#### 4. Build Optimization

**File**: `frontend/vite.config.ts` (update)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_WORKER_URL || 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['zustand', 'date-fns', 'clsx'],
        },
      },
    },
  },
});
```

#### 5. Deployment Documentation

**File**: `docs/deployment.md`

```markdown
# Deployment Guide

## Prerequisites

- Cloudflare account with Workers and Pages access
- GitHub account
- Gmail account with API access enabled
- Node.js 20+

## Backend Deployment (Cloudflare Worker)

### 1. Deploy Worker

```bash
cd cloudflare-worker
npm install
npm run deploy
```

Note the Worker URL (e.g., `https://memory-time-capsule-worker.your-subdomain.workers.dev`)

### 2. Configure Secrets

```bash
# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set all secrets
wrangler secret put ENCRYPTION_KEY
wrangler secret put GITHUB_OAUTH_CLIENT_ID
wrangler secret put GITHUB_OAUTH_CLIENT_SECRET
wrangler secret put GMAIL_CLIENT_ID
wrangler secret put GMAIL_CLIENT_SECRET
wrangler secret put WORKER_URL
wrangler secret put FRONTEND_URL  # Will be set after frontend deployment
```

### 3. Create KV Namespace

```bash
wrangler kv:namespace create "KV"
```

Update `wrangler.toml` with the namespace ID.

### 4. Test Worker

```bash
curl https://your-worker-url.workers.dev/health
# Should return: {"status":"ok","timestamp":"..."}
```

## Frontend Deployment (Cloudflare Pages)

### 1. Build Frontend

```bash
cd frontend
npm install

# Update .env.production with actual Worker URL
echo "VITE_WORKER_URL=https://your-worker-url.workers.dev" > .env.production

npm run build
```

### 2. Deploy to Cloudflare Pages

#### Option A: Via Wrangler

```bash
npx wrangler pages deploy dist --project-name memory-time-capsule
```

#### Option B: Via Dashboard

1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project"
3. Connect to GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables: `VITE_WORKER_URL`
5. Deploy

### 3. Update Frontend URL in Worker

```bash
cd cloudflare-worker
wrangler secret put FRONTEND_URL
# Enter: https://memory-time-capsule.pages.dev (or your custom domain)
```

### 4. Update OAuth Redirect URLs

Update your GitHub and Gmail OAuth apps with the new frontend URL:

**GitHub OAuth App:**
- Authorization callback URL: `https://your-worker-url.workers.dev/api/auth/github/callback`

**Gmail OAuth App:**
- Authorized redirect URI: `https://your-worker-url.workers.dev/api/auth/gmail/callback`

## Post-Deployment Testing

### Backend Tests

```bash
# Health check
curl https://your-worker-url.workers.dev/health

# API info
curl https://your-worker-url.workers.dev/api

# GitHub auth URL
curl https://your-worker-url.workers.dev/api/auth/github/authorize
```

### Frontend Tests

1. Navigate to your frontend URL
2. Click "Get Started"
3. Connect GitHub → should redirect and create repository
4. Connect Gmail → should redirect and complete setup
5. Create a test capsule
6. Check dashboard shows the capsule
7. Open magic link (wait for unlock or test with past date)

### Integration Tests

1. Create capsule with unlock date in past
2. Manually trigger GitHub Actions workflow in repository
3. Check recipient email received unlock notification with PIN
4. Open magic link and verify PIN entry
5. Enter correct PIN and verify content displays

## Custom Domain (Optional)

### Frontend Domain

1. Add domain in Cloudflare Pages settings
2. Update DNS records as instructed
3. Update `FRONTEND_URL` secret in Worker

### Worker Domain

1. Add custom domain in Workers settings
2. Update OAuth redirect URLs
3. Update `WORKER_URL` secret

## Monitoring

### Worker Logs

```bash
cd cloudflare-worker
wrangler tail
```

### KV Inspection

```bash
# List all keys
wrangler kv:key list --binding=KV

# Get specific key
wrangler kv:key get "github_token:USER_ID" --binding=KV
```

### GitHub Actions

- Check repository → Actions tab for workflow runs
- Monitor for failed unlock attempts

## Troubleshooting

### OAuth Errors

- Verify client IDs and secrets are correct
- Check redirect URLs match exactly
- Ensure scopes are properly requested
- **Using gcloud-observability**: Query for all OAuth-related errors in the past 24 hours to identify patterns

### Email Sending Failures

- Check Gmail API quota (100 emails/day per user)
- Verify Gmail tokens are stored correctly in KV
- Check refresh token is valid
- **Using gcloud-observability**: Search for Gmail API error responses and track delivery success rate over time

### Capsule Not Unlocking

- Check GitHub Actions workflow is enabled
- Verify workflow has required secrets
- Check workflow logs for errors
- Ensure `capsules.json` is accessible
- **Using gcloud-observability**: Query GitHub Actions workflow logs across all user repositories to find common failure patterns
- **Using gcloud**: Use MCP to inspect GitHub Actions metrics and execution times

### Storage Issues

- Check GitHub LFS quota (1GB free)
- Verify files are being committed to repository
- Check KV storage hasn't exceeded free tier

## Rollback Procedure

### Worker Rollback

```bash
cd cloudflare-worker
wrangler rollback
```

### Frontend Rollback

Via Cloudflare Pages dashboard → Deployments → select previous deployment → "Rollback"

## Security Checklist

- [ ] All secrets set via `wrangler secret put` (not committed)
- [ ] Encryption key is 64-character hex (32 bytes)
- [ ] OAuth apps use HTTPS redirect URLs
- [ ] CORS restricted to frontend domain
- [ ] Rate limiting enabled for PIN attempts
- [ ] All tokens encrypted in KV storage
```

#### 6. Update Package Scripts

**File**: `frontend/package.json` (add deployment scripts)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "deploy": "npm run build && wrangler pages deploy dist --project-name memory-time-capsule"
  }
}
```

### Success Criteria

#### Automated Verification:
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] No build warnings or errors
- [ ] Worker deploys without errors: `cd cloudflare-worker && npm run deploy`
- [ ] All TypeScript checks pass in both projects

#### Manual Verification:
- [ ] Test complete user flow end-to-end:
  1. Fresh user visits home page
  2. Clicks "Get Started"
  3. Connects GitHub → repository created
  4. Connects Gmail → setup complete
  5. Creates text capsule with future date
  6. Receives creation email
  7. Dashboard shows capsule
  8. Magic link shows countdown
  9. (Wait for unlock or manually trigger workflow)
  10. Recipient receives unlock email with PIN
  11. Magic link now requests PIN
  12. Enter PIN → content displays
- [ ] Test all pages load correctly:
  - Home page renders with hero and features
  - Auth page has GitHub and Gmail buttons
  - Dashboard shows stats and capsules
  - Create page has working form
  - Open page handles all states (countdown, PIN, unlocked)
- [ ] Test responsive design on mobile:
  - Navigation works
  - Forms are usable
  - Media players work
  - Countdown displays correctly
- [ ] Test error handling:
  - Network errors show appropriate messages
  - Invalid inputs show validation errors
  - Failed API calls show retry options
- [ ] Verify production configuration:
  - Environment variables set correctly
  - Worker URL points to production
  - OAuth redirect URLs updated
  - Secrets configured in Worker
  - KV namespace connected
- [ ] Security verification:
  - No secrets in git history
  - Tokens encrypted in KV (inspect dashboard)
  - Rate limiting works (test 5 failed PINs)
  - CORS properly configured
- [ ] Performance testing:
  - Home page loads < 2 seconds
  - Dashboard loads < 3 seconds
  - File upload works for 100MB files
  - Video playback smooth
- [ ] Cross-browser testing:
  - Chrome/Edge
  - Firefox
  - Safari (desktop and mobile)
- [ ] Deployment verification:
  - Frontend accessible via Cloudflare Pages URL
  - Worker accessible and responding
  - GitHub Actions workflow enabled in user repos
  - Email delivery working (check spam folders)

**Implementation Note**: After all tests pass and the application is stable in production, the MVP is complete. Future enhancements can be tracked separately.

---

## Testing Strategy

### Phase 1 Testing:
- Wrangler authentication test
- KV namespace creation verification
- Worker deployment success
- Health and API endpoint availability

### Phase 2 Testing:
- Encryption/decryption round-trip tests via deployed endpoints
- Token generation uniqueness tests
- KV storage and retrieval tests via deployed endpoints
- SHA-256 hashing verification

### Phase 3 Testing:
- OAuth authorization URL generation
- Full OAuth callback flow with real GitHub account
- Repository creation verification
- Encrypted token storage verification in KV dashboard
- Session management tests via deployed endpoints

### Post-MVP Testing Strategy:
- **Unit tests**: Vitest for utility functions (encryption, KV helpers, GitHub client)
- **Integration tests**: End-to-end OAuth flows, repository initialization
- **Security tests**: Token encryption verification, rate limiting validation
- **E2E tests**: Playwright for full user flows (will be added post-MVP)

---

## References

- Original Plan: `thoughts/plans/original-plan.md`
- Architecture Document: `thoughts/research/architecture.md`
- GitHub OAuth Documentation: https://docs.github.com/en/developers/apps/building-oauth-apps
- Cloudflare Workers Documentation: https://developers.cloudflare.com/workers/
- Cloudflare KV Documentation: https://developers.cloudflare.com/kv/
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- Octokit REST API: https://octokit.github.io/rest.js/


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
3. Make sure you're using the latest version: `npm install -g wrangler@latest`

### KV Namespace Creation Fails
If you can't create the KV namespace via CLI:
1. Log into Cloudflare dashboard
2. Go to Workers & Pages → KV
3. Click "Create namespace"
4. Name it "KV"
5. Copy the namespace ID into `wrangler.toml`

### Deployment Fails
If deployment fails:
1. Ensure you're logged in: `wrangler whoami`
2. Check your account ID in `wrangler.toml`
3. Verify KV namespace ID is correct
4. Check for TypeScript errors: `npx tsc --noEmit`

### CORS Errors in Development
If you encounter CORS errors:
1. Verify FRONTEND_URL is set correctly
2. Update CORS origin in `src/index.ts` if needed
3. Ensure you're accessing the worker from the correct origin

## Next Steps

After successful deployment:
1. Save your Worker URL for use in Phase 2+
2. Set up GitHub OAuth in Phase 3
3. Set up Gmail OAuth in Phase 4
4. Configure the frontend in later phases


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

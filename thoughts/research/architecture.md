# Digital Time Capsule - Architecture Overview

## System Architecture

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────┐
│     Cloudflare Workers (API)        │
│  ┌──────────┐  ┌───────────────┐   │
│  │  Router  │  │ Auth Handler  │   │
│  └────┬─────┘  └───────┬───────┘   │
│       │                 │            │
│  ┌────▼─────────────────▼──────┐   │
│  │   Business Logic Layer      │   │
│  │  - Capsule Management       │   │
│  │  - Token Generation         │   │
│  │  - PIN Verification         │   │
│  └────┬──────────────────┬─────┘   │
└───────┼──────────────────┼──────────┘
        │                  │
        ▼                  ▼
┌──────────────┐   ┌────────────────┐
│  KV Storage  │   │  GitHub API    │
│  - Tokens    │   │  - Repos       │
│  - Sessions  │   │  - LFS Files   │
│  - Mappings  │   │  - Actions     │
└──────────────┘   └────────┬───────┘
                            │
                            ▼
                   ┌────────────────┐
                   │ GitHub Actions │
                   │  Cron Workflow │
                   │  (Hourly)      │
                   └───────┬────────┘
                           │
                           ▼
                   ┌────────────────┐
                   │   Gmail API    │
                   │  Send Emails   │
                   └────────────────┘
```

## Data Flow

### 1. User Registration Flow

```
User → Frontend → Cloudflare Worker
                        │
                        ├─→ GitHub OAuth
                        │     └─→ Store access_token in KV
                        │
                        └─→ Gmail OAuth
                              └─→ Store refresh_token in KV
```

### 2. Capsule Creation Flow

```
User uploads file → Frontend → Cloudflare Worker
                                     │
                                     ├─→ Validate content
                                     ├─→ Generate magic token
                                     ├─→ Upload to GitHub LFS
                                     ├─→ Update capsules.json
                                     ├─→ Send creation email (Gmail API)
                                     └─→ Return magic link + WhatsApp link
```

### 3. Capsule Unlock Flow (Automated)

```
GitHub Actions Cron (hourly)
    │
    ├─→ Read capsules.json
    ├─→ Check unlock times
    ├─→ For each unlocked capsule:
    │      ├─→ Generate 4-digit PIN
    │      ├─→ Send unlock email to recipient (with PIN)
    │      ├─→ Send notification to sender
    │      └─→ Update capsules.json (mark as sent)
    └─→ Commit changes
```

### 4. Capsule Viewing Flow

```
Recipient clicks magic link
    │
    └─→ Frontend fetches metadata
          │
          └─→ Cloudflare Worker
                │
                ├─→ Validate token
                ├─→ Lookup capsule in KV
                └─→ Return: unlocked status + metadata
                      │
                      └─→ If unlocked:
                            │
                            └─→ User enters PIN
                                  │
                                  └─→ Verify PIN
                                        │
                                        └─→ Return content URL
```

## Storage Architecture

### Cloudflare KV (Key-Value Store)

| Key Pattern | Value | TTL |
|-------------|-------|-----|
| `github_token:{userId}` | GitHub access token | 90 days |
| `gmail_token:{userId}` | Gmail refresh token | 90 days |
| `user_session:{userId}` | Full user session JSON | 90 days |
| `token:{tokenHash}` | Token mapping (repo + capsuleId) | None |
| `pin_attempts:{tokenHash}` | Rate limit counter | 1 hour |

### GitHub Repository Structure

```
timecapsule-storage-{uuid}/
├── .github/
│   └── workflows/
│       └── unlock-cron.yml       # Automated unlock workflow
├── .gitattributes                # LFS configuration
├── capsules.json                 # Metadata for all capsules
├── capsules/                     # Content files
│   ├── {capsuleId1}.mp4
│   ├── {capsuleId2}.mp3
│   └── {capsuleId3}.jpg
└── README.md
```

### capsules.json Schema

```json
[
  {
    "id": "uuid",
    "title": "Happy Birthday",
    "unlockAt": 1735689600,
    "recipientEmail": "friend@example.com",
    "recipientName": "Jane",
    "senderName": "Alice",
    "senderEmail": "alice@gmail.com",
    "contentType": "video/mp4",
    "filePath": "capsules/uuid.mp4",
    "fileSize": 52428800,
    "magicTokenHash": "sha256...",
    "pin": "1234",
    "pinHash": "sha256...",
    "createdAt": 1704067200,
    "creationEmailSent": true,
    "unlockEmailSent": true,
    "whatsappSharedAtCreation": false,
    "viewedAt": 1735689700
  }
]
```

## Security Model

### Authentication

- **GitHub OAuth**: Grants access to create private repos and upload files
- **Gmail OAuth**: Grants permission to send emails on behalf of user
- **Session Storage**: Encrypted tokens stored in Cloudflare KV with 90-day expiry

### Authorization

- **Magic Tokens**: 128-bit random tokens (base64url encoded)
- **Token Hashing**: Only SHA-256 hashes stored in capsules.json
- **PIN Protection**: 4-digit PINs hashed with SHA-256
- **Rate Limiting**: Max 5 PIN attempts per hour per token

### Data Protection

- **Private Repos**: All content stored in private GitHub repositories
- **LFS Encryption**: Files tracked by Git LFS (binary storage)
- **Token Mapping**: Separate KV store maps token hashes to repos
- **No Plaintext**: Tokens and PINs never stored in plaintext

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/github` | GitHub OAuth callback |
| POST | `/api/auth/gmail` | Gmail OAuth callback |

### Repository Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/repo/init` | Initialize user's storage repo |

### Capsule Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/capsule/create` | Create new time capsule |
| GET | `/api/capsule/:token` | Get capsule metadata |
| POST | `/api/capsule/:token/verify-pin` | Verify PIN and get content |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/:userId` | Get user's capsules and storage |

## Technology Stack

### Backend (Cloudflare Workers)

- **Runtime**: V8 JavaScript/TypeScript
- **Framework**: Hono (lightweight web framework)
- **Storage**: Cloudflare KV (key-value store)
- **APIs**: 
  - GitHub REST API (@octokit/rest)
  - Gmail API (googleapis)

### Storage

- **Primary**: GitHub LFS (Large File Storage)
- **Metadata**: GitHub repository files (capsules.json)
- **Caching**: Cloudflare KV

### Automation

- **Scheduler**: GitHub Actions cron
- **Frequency**: Hourly (`0 * * * *`)
- **Runtime**: Node.js 20

### Frontend (Planned)

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State**: Zustand
- **Router**: React Router v6

## Scalability Considerations

### Free Tier Limits

- **Cloudflare Workers**: 100k requests/day
- **Cloudflare KV**: 100k reads/day, 1k writes/day
- **GitHub LFS**: 1 GB storage per repo
- **GitHub Actions**: 2,000 minutes/month
- **Gmail API**: 100 emails/day (sender account)

### Performance

- **Worker Latency**: <50ms average
- **KV Read Latency**: <100ms
- **GitHub API**: Rate limited to 5,000 requests/hour
- **Email Delivery**: <5 seconds via Gmail API

### Optimization Strategies

1. **Caching**: Use KV to cache frequently accessed data
2. **Batching**: Process multiple capsules in single workflow run
3. **Lazy Loading**: Only fetch content when PIN verified
4. **CDN**: Leverage Cloudflare's global network for static assets

## Cost Breakdown (MVP)

| Service | Tier | Cost |
|---------|------|------|
| Cloudflare Workers | Free | $0 |
| Cloudflare KV | Free | $0 |
| GitHub LFS | Free (1GB) | $0 |
| GitHub Actions | Free (2k min) | $0 |
| Gmail API | Free (100/day) | $0 |
| **Total** | | **$0/month** |

## Monitoring & Observability

### Metrics to Track

- Capsule creation rate
- Email delivery success rate
- PIN verification attempts
- Storage usage per user
- API response times
- Error rates

### Logging

- Cloudflare Workers logs (via `wrangler tail`)
- GitHub Actions workflow logs
- Email delivery logs (Gmail API responses)

### Alerts

- Failed email deliveries
- Storage quota exceeded
- API rate limit warnings
- Workflow failures

## Future Enhancements

### Planned Features

1. **Sub-15-minute precision**: Use Cloudflare Workers Cron Triggers
2. **Content expiry**: Auto-delete after N days
3. **Multi-recipient**: Send to groups
4. **Recipient dashboard**: Centralized view for recipients
5. **Reply feature**: Two-way communication
6. **Analytics**: View tracking, engagement metrics

### Potential Integrations

- **Storage**: Google Drive, Dropbox, AWS S3
- **Notifications**: Telegram, Slack, Discord
- **Calendar**: Add to Google Calendar, iCal
- **Webhooks**: Custom integrations





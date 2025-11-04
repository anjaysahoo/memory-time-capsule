# Memory                                                                                            Time Capsule MVP – Implementation Plan

## Architecture

**Stack:**

- **Storage**: GitHub Git LFS (1GB free per sender, private repos)
- **Metadata**: `capsules.json` in sender's GitHub repo
- **Scheduling**: GitHub Actions cron (hourly, 2k min/mo free)
- **Email**: Gmail API (sender's account)
- **WhatsApp**: Click-to-chat (`wa.me` links, manual send)
- **Security**: Cloudflare Workers proxy (hides GitHub tokens)
- **Frontend**: Static site (Cloudflare Pages or GitHub Pages)

**Cost**: $0 for MVP (all free tiers)

---

## Core Features (MVP)

### 1. Content & Limits

- **Video**: MP4/WebM, max 100MB
- **Audio**: MP3/M4A, max 50MB
- **Photos**: Up to 5 images, max 50MB combined (JPEG/PNG)
- **Text-only**: Stored in metadata (no file upload)
- **Storage per sender**: 1GB total (~10-20 capsules)

### 2. Security

- **Magic link**: 128-bit random token (base64url)
- **PIN protection**: Auto-generated 4-digit PIN (sent in unlock email, required to view content post-unlock)
- **Token storage**: Hashed (SHA-256) in metadata; only hash stored

### 3. Timing

- **Unlock precision**: Hourly cron (0-59 min delay acceptable for MVP)
- **Timezone**: Sender sets date/time/timezone → stored as UNIX timestamp (UTC)

### 4. WhatsApp Integration

- **Creation**: Optional "Share via WhatsApp" button → `wa.me/?text=...` (generic, no phone number stored) → sender manually selects recipient
- **Unlock**: Sender gets email with WhatsApp button → `wa.me/?text=...` → sender manually sends reminder

---

## Implementation Phases

### Phase 1: Core Infrastructure (Cloudflare Workers + GitHub API)

**Components:**

1. **Cloudflare Worker API** (`/api/*` endpoints)

   - `POST /api/auth/github` - OAuth callback for GitHub
   - `POST /api/auth/gmail` - OAuth callback for Gmail
   - `POST /api/repo/init` - Create private repo with LFS + workflow
   - `POST /api/capsule/create` - Upload content to GitHub LFS
   - `GET /api/capsule/:token` - Fetch capsule metadata (validates PIN)
   - `POST /api/capsule/:token/verify-pin` - Verify PIN, return content URL

2. **GitHub OAuth Flow**

   - Request scopes: `repo`, `workflow`
   - Encrypt access token using AES-256-GCM with `ENCRYPTION_KEY`
   - Store encrypted token in Workers KV: `github_token:{userId}` (no TTL)
   - Backup encrypted token to GitHub repo secrets

3. **Gmail OAuth Flow**

   - Request scope: `https://www.googleapis.com/auth/gmail.send`
   - Encrypt refresh token using AES-256-GCM with `ENCRYPTION_KEY`
   - Store encrypted token in Workers KV: `gmail_token:{userId}` (no TTL)
   - Backup encrypted token to GitHub repo secrets

4. **Auto-create GitHub Repo** (via GitHub API)

   - Repo name: `timecapsule-storage-{uuid}`
   - Visibility: Private
   - Files to commit:
     - `.github/workflows/unlock-cron.yml` (see Phase 2)
     - `.gitattributes` (LFS config: `*.mp4 filter=lfs`, `*.mp3 filter=lfs`, `*.jpg filter=lfs`, `*.png filter=lfs`)
     - `capsules.json` (empty array: `[]`)
   - Store GitHub secrets via API:
     - `GITHUB_ACCESS_TOKEN` (encrypted, for recovery)
     - `GMAIL_REFRESH_TOKEN` (encrypted, for recovery & Actions)
     - `GMAIL_CLIENT_ID`
     - `GMAIL_CLIENT_SECRET`

**Files to create:**

- `cloudflare-worker/src/index.ts` (main Worker)
- `cloudflare-worker/src/github.ts` (GitHub API helpers)
- `cloudflare-worker/src/gmail.ts` (Gmail API helpers)
- `cloudflare-worker/src/encryption.ts` (AES-256-GCM helpers for token encryption)
- `cloudflare-worker/wrangler.toml` (config)

---

### Phase 2: GitHub Actions Workflow (Unlock Cron)

**Workflow file:** `.github/workflows/unlock-cron.yml`

**Trigger:** `cron: '0 * * * *'` (every hour)

**Job steps:**

1. Checkout repo (with LFS)
2. Install Node.js + googleapis npm package
3. Parse `capsules.json`
4. Find capsules where `unlockAt <= now()` AND `unlockEmailSent == false`
5. For each unlocked capsule:

   - Generate 4-digit PIN (random, 0000-9999)
   - Update capsule metadata: `{ pin: "1234", unlockEmailSent: true }`
   - Send email to **recipient**:
     - Subject: "🎁 Your time capsule from {sender} is unlocked!"
     - Body: Magic link + **PIN** (e.g., "Your PIN is: 1234")
   - Send email to **sender**:
     - Subject: "✅ Your capsule to {recipient} unlocked"
     - Body: Confirmation + WhatsApp button (generic `wa.me/?text=...`)

6. Commit updated `capsules.json` (mark as sent)

**Files to create:**

- `templates/github-workflow.yml` (template for auto-generated workflow)
- `cloudflare-worker/src/workflow-template.ts` (generate workflow YAML)

---

### Phase 3: Frontend (Static Site)

**Pages:**

1. **Home / Landing** (`/`)

   - Hero: "Send messages to the future"
   - CTA: "Create Your First Capsule"
   - How it works (3 steps)

2. **Auth** (`/auth`)

   - "Connect GitHub" button (OAuth)
   - "Connect Gmail" button (OAuth)
   - On success → redirect to `/create`

3. **Create Capsule** (`/create`)

   - Form fields:
     - Title (text)
     - Unlock date/time (datetime-local input)
     - Timezone selector (detect browser TZ, allow override)
     - Recipient email (required)
     - Content type: Video | Audio | Photos | Text
     - File upload (drag-drop + progress bar)
   - Preview (before upload)
   - "Lock Capsule" button → uploads to Cloudflare Worker → Worker uploads to GitHub LFS
   - Success screen:
     - "Capsule created! Recipient email sent."
     - "Share via WhatsApp" button → `wa.me/?text=...`

4. **Magic Link Viewer** (`/open?t={token}`)

   - Fetch metadata from Cloudflare Worker
   - **Pre-unlock**: Show countdown, title, sender name, duration
   - **Post-unlock**:
     - Prompt for 4-digit PIN
     - On correct PIN → fetch presigned GitHub LFS URL from Worker
     - Display content (video player, audio player, photo gallery, or text)

5. **Dashboard** (`/dashboard`)

   - List sender's capsules (from GitHub repo via Worker)
   - Storage meter (X MB / 1 GB used)
   - Capsule cards: title, recipient, unlock date, status (sealed/unlocked/viewed)

**Tech stack:**

- React + TypeScript + Vite
- TailwindCSS for styling
- React Router for navigation
- Zustand for state management
- Axios for API calls

**Files to create:**

- `frontend/src/pages/Home.tsx`
- `frontend/src/pages/Auth.tsx`
- `frontend/src/pages/Create.tsx`
- `frontend/src/pages/Open.tsx`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/components/FileUpload.tsx`
- `frontend/src/components/Countdown.tsx`
- `frontend/src/components/PinInput.tsx`
- `frontend/src/api/worker.ts` (API client)

---

### Phase 4: Content Upload & Storage

**Flow:**

1. User selects files in frontend
2. Frontend compresses/validates (check size limits)
3. Frontend calls `POST /api/capsule/create` with:

   - Metadata (title, unlockAt, recipientEmail, etc.)
   - File blob (FormData)

4. Cloudflare Worker:

   - Generates `capsuleId` (UUID)
   - Generates `magicToken` (128-bit random)
   - Uploads file to GitHub LFS via GitHub API:
     - For <100MB: Use Git blob API + commit API
     - Path: `capsules/{capsuleId}.{ext}`
   - Appends metadata to `capsules.json`:
     ```json
     {
       "id": "uuid",
       "title": "Happy Birthday",
       "unlockAt": 1735689600,
       "recipientEmail": "friend@example.com",
       "senderName": "Alice",
       "senderEmail": "alice@gmail.com",
       "contentType": "video/mp4",
       "filePath": "capsules/uuid.mp4",
       "fileSize": 52428800,
       "magicTokenHash": "sha256_hash",
       "pin": null,
       "creationEmailSent": false,
       "unlockEmailSent": false,
       "whatsappSharedAtCreation": false
     }
     ```


5. Worker commits updated `capsules.json` to repo
6. Worker sends creation email via Gmail API
7. Worker returns success + WhatsApp share link to frontend

**Key helpers:**

- `uploadToGitHubLFS(repo, path, blob, token)` - Upload file via Git API
- `updateCapsulesJson(repo, capsule, token)` - Append to JSON + commit
- `sendEmail(to, subject, body, refreshToken)` - Gmail API

---

### Phase 5: Magic Link & PIN Verification

**Pre-unlock flow:**

1. Recipient clicks `https://timecapsule.app/open?t={token}`
2. Frontend calls `GET /api/capsule/{token}`
3. Worker:

   - Hashes token → looks up in all repos (stored in KV: `token_to_repo` mapping)
   - Fetches capsule metadata
   - Checks `unlockAt`
   - If `now < unlockAt`: return metadata only (no PIN, no content URL)
   - If `now >= unlockAt` AND `pin == null`: return "Capsule not yet sent unlock email"

4. Frontend shows countdown + sealed state

**Post-unlock flow (after cron sends unlock email with PIN):**

1. Recipient clicks magic link again
2. Frontend calls `GET /api/capsule/{token}` → sees `unlocked: true`
3. Frontend prompts for 4-digit PIN
4. Frontend calls `POST /api/capsule/{token}/verify-pin` with `{ pin: "1234" }`
5. Worker:

   - Validates PIN against stored hash
   - If correct: generates presigned GitHub raw file URL (valid 1 hour)
   - Returns `{ contentUrl: "https://raw.githubusercontent.com/..." }`

6. Frontend displays content (video/audio player or photo gallery)

**Security notes:**

- Store `pinHash` (SHA-256) in metadata, not plaintext
- Rate-limit PIN attempts (max 5 per hour per token)
- Log failed attempts

---

### Phase 6: WhatsApp Integration (Click-to-Chat)

**Creation flow:**

1. After capsule created, frontend shows "Share via WhatsApp" button
2. On click, generate `wa.me` link:
   ```javascript
   const message = encodeURIComponent(
     `Hi! I sent you a time capsule that unlocks on ${unlockDate}. ` +
     `Check your email or view it here: https://timecapsule.app/open?t=${token}`
   );
   window.open(`https://wa.me/?text=${message}`, '_blank');
   ```

3. Sender manually selects recipient in WhatsApp, taps "Send"
4. (Optional) Frontend calls Worker to mark `whatsappSharedAtCreation: true` in metadata

**Unlock flow:**

1. GitHub Actions cron sends unlock email to **sender** (not just recipient)
2. Sender email body includes:
   ```html
   <p>Your capsule to {recipient} just unlocked!</p>
   <p><a href="https://wa.me/?text={unlockMessage}">📱 Send WhatsApp Reminder</a></p>
   ```

3. Sender clicks → WhatsApp opens → manually sends

**No phone numbers stored; sender types recipient in WhatsApp UI.**

---

### Phase 7: Email Templates

**3 email templates (HTML + plain text fallbacks):**

1. **Creation email** (to recipient)

   - Subject: "🎁 A time capsule from {sender} unlocks on {date}"
   - Body:
     - Greeting
     - Sealed preview (title, unlock date, countdown link)
     - Magic link button
     - Footer (unsubscribe, privacy policy)

2. **Unlock email** (to recipient)

   - Subject: "🎉 Your time capsule from {sender} is unlocked!"
   - Body:
     - "Your capsule is ready to open"
     - **PIN: {pin}** (highlighted)
     - Magic link button
     - Footer

3. **Sender notification** (to sender, at unlock)

   - Subject: "✅ Your capsule to {recipient} unlocked"
   - Body:
     - Confirmation message
     - WhatsApp share button (optional, if sender shared at creation)
     - Footer

**Files to create:**

- `templates/email-creation.html`
- `templates/email-unlock-recipient.html`
- `templates/email-unlock-sender.html`
- `cloudflare-worker/src/email-templates.ts` (template renderer)

---

## Post-MVP Enhancements (Future)

1. **Storage options**: Add Google Drive as alternative to GitHub LFS
2. **Timing precision**: Sub-15-minute cron (via Cloudflare Workers cron or paid GitHub Actions minutes)
3. **Recipient dashboard**: Let recipients claim capsules by email, see all in one place
4. **PIN options**: Let sender choose to enable/disable PIN, or set custom PIN
5. **Content expiry**: Auto-delete content N days after unlock
6. **Reply feature**: Let recipient send a message back to sender
7. **Multi-recipient**: Send same capsule to group (CC-style)
8. **Calendar integration**: ICS file attached to emails
9. **Webhook notifications**: Notify sender via webhook when capsule is viewed
10. **Analytics**: Track open rates, view duration, bounce rates

---

## Development Workflow

### Setup

1. Create Cloudflare account → Workers + KV namespace
2. Create GitHub OAuth app (client ID/secret)
3. Create Google OAuth app (Gmail API client ID/secret)
4. Generate encryption key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
5. Clone repo, install dependencies:
   ```bash
   npm install -g wrangler
   cd cloudflare-worker && npm install
   cd ../frontend && npm install
   ```
6. Set environment variables/secrets:
   ```bash
   wrangler secret put ENCRYPTION_KEY
   wrangler secret put GITHUB_OAUTH_CLIENT_ID
   wrangler secret put GITHUB_OAUTH_CLIENT_SECRET
   wrangler secret put GMAIL_CLIENT_ID
   wrangler secret put GMAIL_CLIENT_SECRET
   wrangler secret put FRONTEND_URL
   ```


### Local Development

1. Run Cloudflare Worker locally: `wrangler dev`
2. Run frontend locally: `npm run dev` (proxies API to localhost:8787)
3. Use ngrok for OAuth callbacks during dev

### Deployment

1. Deploy Worker: `wrangler publish`
2. Deploy frontend: Push to GitHub → auto-deploy via Cloudflare Pages
3. Set environment variables in Cloudflare dashboard:
   - OAuth secrets (GitHub & Gmail)
   - `ENCRYPTION_KEY` (32-byte hex, never commit to git)
   - KV namespace bindings
   - `FRONTEND_URL`

### Testing

1. Unit tests for Worker API endpoints (Vitest)
2. E2E tests for user flows (Playwright)
3. Manual testing with real GitHub repo + Gmail sending
4. Security testing:
   - Verify tokens in KV are encrypted (not readable)
   - Check GitHub repo has correct encrypted secrets
   - Test token recovery from GitHub secrets
   - Verify encryption key not in git
   - Confirm no plaintext tokens stored anywhere

---

## File Structure

```
time-capsule/
├── cloudflare-worker/
│   ├── src/
│   │   ├── index.ts              # Main Worker entry
│   │   ├── github.ts             # GitHub API helpers
│   │   ├── gmail.ts              # Gmail API helpers
│   │   ├── encryption.ts         # AES-256-GCM token encryption
│   │   ├── email-templates.ts   # Email HTML generators
│   │   └── workflow-template.ts # GitHub Actions YAML generator
│   ├── wrangler.toml             # Cloudflare config
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── Create.tsx
│   │   │   ├── Open.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── components/
│   │   │   ├── FileUpload.tsx
│   │   │   ├── Countdown.tsx
│   │   │   ├── PinInput.tsx
│   │   │   └── VideoPlayer.tsx
│   │   ├── api/
│   │   │   └── worker.ts         # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── templates/
│   ├── github-workflow.yml       # Template for Actions workflow
│   ├── email-creation.html
│   ├── email-unlock-recipient.html
│   └── email-unlock-sender.html
└── README.md
```

---

## Success Criteria (MVP Launch)

- [ ] Sender can create GitHub + Gmail accounts in <3 minutes
- [ ] Sender can upload 100MB video capsule in <30 seconds
- [ ] Capsule unlocks within 1 hour of set time
- [ ] Recipient receives unlock email with correct PIN
- [ ] PIN verification works; invalid PIN shows error
- [ ] Magic link displays video player with controls
- [ ] WhatsApp share button opens wa.me with pre-filled message
- [ ] Storage meter shows accurate usage (X / 1GB)
- [ ] All OAuth tokens encrypted in KV (AES-256-GCM)
- [ ] Token recovery from GitHub secrets works if KV fails
- [ ] No crashes, no data loss, email delivery >95%

---

## Timeline Estimate

| Phase | Effort | Dependencies |

|-------|--------|--------------|

| Phase 1: Cloudflare Worker + Auth | 3-4 days | None |

| Phase 2: GitHub Actions Workflow | 2 days | Phase 1 |

| Phase 3: Frontend (basic UI) | 3-4 days | Phase 1 |

| Phase 4: Content Upload | 2-3 days | Phase 1, 3 |

| Phase 5: Magic Link + PIN | 2 days | Phase 1, 3 |

| Phase 6: WhatsApp Integration | 1 day | Phase 3 |

| Phase 7: Email Templates | 1-2 days | Phase 2 |

| Testing + Polish | 2-3 days | All phases |

**Total: ~16-21 days** (2.5-3 weeks for solo dev, 1-1.5 weeks for small team)

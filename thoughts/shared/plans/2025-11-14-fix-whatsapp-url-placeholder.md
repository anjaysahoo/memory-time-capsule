# Fix WhatsApp URL Placeholder Implementation Plan

## Overview

Fix the hardcoded placeholder domain `https://your-app-domain.com` in the GitHub Actions unlock workflow that affects WhatsApp reminder emails. The placeholder appears in two email functions within the generated unlock script, causing recipients to receive non-functional URLs. This fix implements the same GitHub Secrets pattern used for Gmail credentials to inject the actual `FRONTEND_URL` dynamically.

## Current State Analysis

### Problem

The workflow generator (`cloudflare-worker/src/lib/workflow-generator.ts`) contains hardcoded placeholder URLs:
- **Line 137**: `sendUnlockEmail()` - Unlock notification to recipient
- **Line 152**: `sendSenderNotification()` - Sender notification with "Send WhatsApp Reminder" button

Both functions construct magic links with `https://your-app-domain.com/open?t=${magicToken}` instead of using the actual domain.

### Why This Happens

The workflow generator creates JavaScript code that runs in **GitHub Actions**, not in the Cloudflare Worker. This generated code doesn't have access to `c.env.FRONTEND_URL` because it executes in a completely different environment.

### Current Correct Implementation

The capsule creation endpoint (`cloudflare-worker/src/routes/capsule.ts:202-212`) correctly uses:
```typescript
const whatsappMessage = encodeURIComponent(
  `Hi! I sent you a time capsule... ${c.env.FRONTEND_URL}/open?t=${magicToken}`
);
```

### Key Discoveries

1. **Architecture**: workflow-generator.ts generates code as strings that execute in GitHub Actions
2. **Pattern**: Gmail credentials are already stored as GitHub Secrets (auth.ts:289-293)
3. **Access**: `FRONTEND_URL` is available in Cloudflare Worker environment (index.ts:12)
4. **Timing**: Secrets are created during Gmail OAuth callback

## Desired End State

After implementation:
1. `FRONTEND_URL` stored as GitHub Repository Secret alongside Gmail secrets
2. Workflow YAML includes `FRONTEND_URL` in environment variables section
3. Unlock script uses `process.env.FRONTEND_URL` instead of hardcoded placeholder
4. All emails contain functional URLs with actual domain
5. New users get correct URLs immediately after Gmail OAuth

### Verification

Run a complete OAuth flow and verify:
- GitHub Secret `FRONTEND_URL` exists in repository
- Workflow file contains `FRONTEND_URL: ${{ secrets.FRONTEND_URL }}`
- Generated unlock script uses `process.env.FRONTEND_URL`
- Test unlock email contains actual domain (not placeholder)

## What We're NOT Doing

- NOT changing the function signature of `generateUnlockScript()` (using secrets pattern instead)
- NOT modifying existing repository workflows (only affects new repositories)
- NOT migrating existing users' repositories (they need manual fix or reconnection)
- NOT changing the bot email `bot@timecapsule.app` (intentional branding)
- NOT modifying the cron schedule or other workflow configuration

## Implementation Approach

Use the existing GitHub Secrets pattern established for Gmail credentials:
1. Add `FRONTEND_URL` to secrets created during Gmail OAuth
2. Update workflow YAML template to include `FRONTEND_URL` environment variable
3. Replace hardcoded domain with `process.env.FRONTEND_URL` in unlock script

This approach:
- Follows existing patterns (auth.ts:289-293)
- Requires no new dependencies
- Leverages GitHub's secret encryption
- Allows dynamic updates without code regeneration

## Phase 1: Add FRONTEND_URL to Workflow Environment

### Overview
Update the workflow YAML generator to include `FRONTEND_URL` as an environment variable that will be provided by GitHub Secrets.

### Changes Required

#### 1. Workflow Generator - Add Environment Variable
**File**: `cloudflare-worker/src/lib/workflow-generator.ts`
**Changes**: Add `FRONTEND_URL` to the workflow's environment variables section

**Current code (lines 42-46)**:
```yaml
      - name: Run unlock script
        env:
          GMAIL_REFRESH_TOKEN: \${{ secrets.GMAIL_REFRESH_TOKEN }}
          GMAIL_CLIENT_ID: \${{ secrets.GMAIL_CLIENT_ID }}
          GMAIL_CLIENT_SECRET: \${{ secrets.GMAIL_CLIENT_SECRET }}
        run: node unlock-script.js
```

**Updated code**:
```yaml
      - name: Run unlock script
        env:
          GMAIL_REFRESH_TOKEN: \${{ secrets.GMAIL_REFRESH_TOKEN }}
          GMAIL_CLIENT_ID: \${{ secrets.GMAIL_CLIENT_ID }}
          GMAIL_CLIENT_SECRET: \${{ secrets.GMAIL_CLIENT_SECRET }}
          FRONTEND_URL: \${{ secrets.FRONTEND_URL }}
        run: node unlock-script.js
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript compilation passes: `npx tsc --noEmit` (in cloudflare-worker/)
- [x] No linting errors: Project has no lint script, TypeScript passes
- [x] Generated workflow YAML includes `FRONTEND_URL` env var when inspected

#### Manual Verification:
- [ ] Review generated workflow string contains `FRONTEND_URL: \${{ secrets.FRONTEND_URL }}`
- [ ] Verify YAML syntax is valid (no extra spaces/indentation issues)

**Implementation Note**: After completing automated verification, manually inspect the generated YAML string to confirm proper formatting before proceeding to Phase 2.

---

## Phase 2: Update Unlock Script to Use Environment Variable

### Overview
Replace hardcoded `https://your-app-domain.com` with `process.env.FRONTEND_URL` in both email functions within the generated unlock script.

### Changes Required

#### 1. Update sendUnlockEmail Function
**File**: `cloudflare-worker/src/lib/workflow-generator.ts`
**Location**: Line 137 within `generateUnlockScript()` return string

**Current code**:
```javascript
async function sendUnlockEmail(capsule, pin, gmail) {
  const unlockDate = new Date(capsule.unlockAt * 1000).toLocaleDateString();
  const magicLink = \`https://your-app-domain.com/open?t=\${capsule.magicToken}\`;
```

**Updated code**:
```javascript
async function sendUnlockEmail(capsule, pin, gmail) {
  const unlockDate = new Date(capsule.unlockAt * 1000).toLocaleDateString();
  const magicLink = \`\${process.env.FRONTEND_URL}/open?t=\${capsule.magicToken}\`;
```

#### 2. Update sendSenderNotification Function
**File**: `cloudflare-worker/src/lib/workflow-generator.ts`
**Location**: Line 152 within `generateUnlockScript()` return string

**Current code**:
```javascript
async function sendSenderNotification(capsule, gmail) {
  const magicLink = \`https://your-app-domain.com/open?t=\${capsule.magicToken}\`;
  const whatsappLink = \`https://wa.me/?text=\${encodeURIComponent(
    \`Hi! Your time capsule "\${capsule.title}" is now unlocked! View it here: \${magicLink}\`
  )}\`;
```

**Updated code**:
```javascript
async function sendSenderNotification(capsule, gmail) {
  const magicLink = \`\${process.env.FRONTEND_URL}/open?t=\${capsule.magicToken}\`;
  const whatsappLink = \`https://wa.me/?text=\${encodeURIComponent(
    \`Hi! Your time capsule "\${capsule.title}" is now unlocked! View it here: \${magicLink}\`
  )}\`;
```

**Note**: Be careful with template string escaping - the outer template is TypeScript, the inner template is the generated JavaScript.

### Success Criteria

#### Automated Verification:
- [x] TypeScript compilation passes: `npx tsc --noEmit` (in cloudflare-worker/)
- [x] No linting errors: Project has no lint script, TypeScript passes
- [x] Code contains no references to `your-app-domain.com`: `grep -r "your-app-domain.com" src/lib/workflow-generator.ts` returns no results

#### Manual Verification:
- [x] Inspect generated unlock script contains `process.env.FRONTEND_URL` in both locations
- [x] Verify template string escaping is correct (backslashes preserved)
- [x] Check both `sendUnlockEmail` and `sendSenderNotification` functions

**Implementation Note**: After automated verification passes, manually review the generated JavaScript string to ensure proper escaping and syntax before proceeding to Phase 3.

---

## Phase 3: Add FRONTEND_URL to GitHub Secrets Creation

### Overview
Update the Gmail OAuth callback to store `FRONTEND_URL` as a GitHub Repository Secret, following the same pattern as Gmail credentials.

### Changes Required

#### 1. Add FRONTEND_URL Secret Creation
**File**: `cloudflare-worker/src/routes/auth.ts`
**Location**: Lines 289-293 (Gmail secrets creation section)

**Current code**:
```typescript
await Promise.all([
  createRepositorySecret(octokit, owner, repo, 'GMAIL_REFRESH_TOKEN', tokens.refresh_token),
  createRepositorySecret(octokit, owner, repo, 'GMAIL_CLIENT_ID', c.env.GMAIL_CLIENT_ID),
  createRepositorySecret(octokit, owner, repo, 'GMAIL_CLIENT_SECRET', c.env.GMAIL_CLIENT_SECRET),
]);
```

**Updated code**:
```typescript
await Promise.all([
  createRepositorySecret(octokit, owner, repo, 'GMAIL_REFRESH_TOKEN', tokens.refresh_token),
  createRepositorySecret(octokit, owner, repo, 'GMAIL_CLIENT_ID', c.env.GMAIL_CLIENT_ID),
  createRepositorySecret(octokit, owner, repo, 'GMAIL_CLIENT_SECRET', c.env.GMAIL_CLIENT_SECRET),
  createRepositorySecret(octokit, owner, repo, 'FRONTEND_URL', c.env.FRONTEND_URL),
]);
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript compilation passes: `npx tsc --noEmit` (in cloudflare-worker/)
- [x] Type checking passes: `npx tsc --noEmit` (in cloudflare-worker/)
- [x] No linting errors: Project has no lint script, TypeScript passes

#### Manual Verification:
- [x] Code review confirms `FRONTEND_URL` added to Promise.all array
- [x] Verify `c.env.FRONTEND_URL` is accessible in this context (it should be based on Env interface)
- [x] Check error handling remains consistent (try-catch at lines 294-297)

**Implementation Note**: After automated verification passes, proceed to Phase 4 for integration testing.

---

## Phase 4: Integration Testing & Verification

### Overview
Test the complete OAuth flow to verify FRONTEND_URL is correctly stored and used in the workflow.

### Testing Steps

#### 1. Local Development Testing
**Environment Setup**:
```bash
# Ensure FRONTEND_URL is set in local environment
cd cloudflare-worker
wrangler secret put FRONTEND_URL
# Enter: http://localhost:5173 (or your local frontend URL)
```

#### 2. Deploy to Development Environment
```bash
cd cloudflare-worker
npm run deploy
```

#### 3. Test OAuth Flow (New User)
1. Create a new test user account
2. Complete GitHub OAuth authorization
   - Verify repository is created with workflow files
3. Complete Gmail OAuth authorization
   - Verify secrets are created in GitHub repository
4. Inspect GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Verify `FRONTEND_URL` appears alongside `GMAIL_*` secrets

#### 4. Verify Generated Files
1. Clone the generated test repository
2. Check `.github/workflows/unlock-cron.yml`:
   ```bash
   grep "FRONTEND_URL" .github/workflows/unlock-cron.yml
   # Should output: FRONTEND_URL: ${{ secrets.FRONTEND_URL }}
   ```
3. Check `unlock-script.js`:
   ```bash
   grep "process.env.FRONTEND_URL" unlock-script.js
   # Should find 2 occurrences (sendUnlockEmail and sendSenderNotification)
   ```
4. Verify no placeholders remain:
   ```bash
   grep "your-app-domain.com" unlock-script.js
   # Should return no results
   ```

#### 5. Test Unlock Email Sending
**Setup**:
1. Create a test capsule with unlock time set to current time + 5 minutes
2. Wait for the hourly cron OR manually trigger workflow:
   - Go to Actions tab in test repository
   - Select "Unlock Time Capsules" workflow
   - Click "Run workflow" button
3. Monitor workflow execution logs

**Verification**:
1. Check workflow logs for successful execution
2. Verify email was sent (check recipient inbox)
3. Inspect email content:
   - Magic link should contain actual domain (e.g., `http://localhost:5173/open?t=...`)
   - WhatsApp link should contain actual domain in message
   - No `your-app-domain.com` placeholders

#### 6. Test WhatsApp Reminder Button
1. Find sender notification email
2. Click "Send WhatsApp Reminder" button
3. Verify WhatsApp opens with pre-filled message
4. Check message contains actual domain URL

### Success Criteria

#### Automated Verification:
- [x] Deployment succeeds: `npm run deploy` exits with code 0
- [ ] GitHub Actions workflow runs without errors (requires manual OAuth flow first)
- [ ] Workflow logs show successful email sending (requires manual OAuth flow first)
- [ ] No environment variable undefined errors in logs (requires manual OAuth flow first)

#### Manual Verification:
- [ ] GitHub repository has `FRONTEND_URL` secret visible in Settings
- [ ] Workflow YAML file contains correct environment variable reference
- [ ] Unlock script JavaScript contains `process.env.FRONTEND_URL` (not placeholder)
- [ ] Recipient unlock email has functional magic link with actual domain
- [ ] Sender notification email has functional WhatsApp link with actual domain
- [ ] WhatsApp reminder message contains actual domain in pre-filled text
- [ ] No `your-app-domain.com` appears in any generated files or emails

**Implementation Note**: Complete all manual verification steps before marking the plan as done. Take screenshots of emails and GitHub secrets for documentation.

---

## Testing Strategy

### Unit Tests
**Not applicable**: The workflow generator returns template strings, and testing string output is better done through integration testing.

### Integration Tests
Follow Phase 4 testing steps above for complete end-to-end verification.

### Manual Testing Steps (Detailed)

1. **Pre-deployment Checks**:
   - [ ] Review all code changes for typos
   - [ ] Verify template string escaping (backslashes)
   - [ ] Confirm `c.env.FRONTEND_URL` exists in Env interface

2. **Post-deployment OAuth Flow**:
   - [ ] Create new test user account
   - [ ] Complete GitHub OAuth (verify repo creation)
   - [ ] Complete Gmail OAuth (verify secrets creation)
   - [ ] Inspect GitHub repository secrets list

3. **Workflow File Verification**:
   - [ ] Clone generated repository locally
   - [ ] Open `.github/workflows/unlock-cron.yml`
   - [ ] Verify `FRONTEND_URL` in env section
   - [ ] Open `unlock-script.js`
   - [ ] Search for `process.env.FRONTEND_URL` (should find 2)
   - [ ] Search for `your-app-domain.com` (should find 0)

4. **Email Content Testing**:
   - [ ] Create test capsule unlocking in 5 minutes
   - [ ] Trigger workflow manually or wait for cron
   - [ ] Check recipient email inbox
   - [ ] Click magic link - verify it goes to correct domain
   - [ ] Check sender notification email
   - [ ] Click "Send WhatsApp Reminder" button
   - [ ] Verify WhatsApp message contains correct URL

5. **Edge Case Testing**:
   - [ ] Test with production FRONTEND_URL (https://...)
   - [ ] Test with localhost FRONTEND_URL (http://...)
   - [ ] Test with trailing slash in URL (should work either way)
   - [ ] Test workflow failure scenario (intentionally break Gmail auth)

## Performance Considerations

### Impact
- **Minimal**: Adding one additional secret has negligible performance impact
- **Secret encryption**: GitHub handles encryption automatically (libsodium)
- **Workflow execution**: No additional overhead (env variable already loaded)

### Optimization
- Secrets stored in parallel using `Promise.all()` (no sequential delay)
- No additional API calls required

## Migration Notes

### Existing Users
Users who completed OAuth **before** this fix will have workflows with placeholder URLs. They need to either:

**Option A - Reconnect Gmail** (Recommended):
1. Disconnect and reconnect Gmail OAuth
2. This will trigger secret creation with updated code
3. `FRONTEND_URL` secret will be added automatically

**Option B - Manual Secret Addition** (Advanced):
1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `FRONTEND_URL`
4. Value: `https://your-actual-domain.com`
5. Click "Add secret"

**Option C - Do Nothing**:
- Unlock emails will continue to have placeholder URLs
- Users can still access capsules via email magic links (if those use correct domain)

### New Users
All users completing OAuth **after** this fix will automatically:
- Have `FRONTEND_URL` stored as a secret
- Receive workflows with correct environment variable
- Get functional URLs in all emails

### Deployment Strategy
1. Deploy to development environment first
2. Test with new user creation
3. Deploy to production
4. No existing user impact (their workflows unchanged)
5. Optionally notify existing users about reconnection option

## References

- Original research: `thoughts/shared/research/2025-11-14-whatsapp-url-placeholder-issue.md`
- Workflow generator: `cloudflare-worker/src/lib/workflow-generator.ts`
- Gmail OAuth callback: `cloudflare-worker/src/routes/auth.ts:239-327`
- GitHub secrets API: `cloudflare-worker/src/lib/github.ts:200-224`
- Correct URL pattern: `cloudflare-worker/src/routes/capsule.ts:202-212`

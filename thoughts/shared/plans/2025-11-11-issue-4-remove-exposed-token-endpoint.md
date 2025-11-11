# Remove Exposed GitHub Token Endpoint - Security Fix

## Overview

Fix critical security vulnerability where `/api/auth/github/token/:userId` endpoint exposes GitHub access tokens without authentication. Research confirms endpoint is unused - removing entirely per Option A (preferred solution from issue #4).

## Current State Analysis

**Vulnerability**: `cloudflare-worker/src/routes/auth.ts:163-177`
- Endpoint accepts any userId parameter without verification
- Returns decrypted GitHub OAuth token to any caller
- Comment acknowledges "should be protected in production" but not implemented
- Allows unauthorized access to user GitHub accounts

**Risk**: CRITICAL
- Attacker with guessed/known userId can retrieve GitHub access token
- Token grants full `repo` and `workflow` scope (lines `auth.ts:57`)
- Enables unauthorized repository access, code theft, malicious commits
- Enables GitHub Actions manipulation

**Current Usage Analysis**:
- Endpoint NOT called by frontend (grep confirmed no matches)
- Endpoint NOT called by any backend routes
- All legitimate GitHub token access uses direct KV retrieval via `getEncryptedToken()`
- Examples of proper internal usage:
  - `capsule.ts:83-91` - Create capsule operation
  - `capsule.ts:249-253` - View capsule operation
  - `capsule.ts:423-427` - Content proxy
  - `capsule.ts:508-516` - Dashboard

### Key Discoveries:
- Endpoint serves no functional purpose - `auth.ts:163-177`
- All routes that need GitHub tokens already retrieve them securely from KV
- Frontend never requires direct token access
- Removing endpoint eliminates attack surface with zero impact

## Desired End State

Exposed token endpoint completely removed from codebase. All GitHub token access occurs exclusively through internal KV retrieval within protected backend routes.

**Verification**:
- `/api/auth/github/token/:userId` returns 404
- No references to endpoint in codebase
- All existing capsule operations continue working
- GitHub integration unaffected

## What We're NOT Doing

- NOT implementing authentication/authorization for endpoint (Option B)
- NOT implementing session-based protection (Option C)
- NOT creating middleware infrastructure
- NOT modifying frontend code (no usage exists)
- NOT changing token storage or encryption
- NOT altering other auth endpoints

## Implementation Approach

Single-phase removal: delete vulnerable endpoint code. This is safest approach since endpoint is completely unused. No migration, no backwards compatibility concerns, no deployment coordination required.

## Phase 1: Remove Exposed Token Endpoint

### Overview
Delete `/api/auth/github/token/:userId` endpoint from `auth.ts`. Verify removal through testing and code search.

### Changes Required:

#### 1. Auth Routes
**File**: `cloudflare-worker/src/routes/auth.ts`
**Changes**: Remove lines 158-177 (entire endpoint definition)

```typescript
// DELETE THESE LINES:
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
```

**Result**: Endpoint no longer exists, returns 404 for any requests

### Success Criteria:

#### Automated Verification:
- [ ] Build succeeds: `cd cloudflare-worker && npm run build`
- [ ] Type checking passes: `cd cloudflare-worker && npx tsc --noEmit`
- [ ] No references to endpoint in codebase: `grep -r "/api/auth/github/token" cloudflare-worker frontend`
- [ ] Worker starts successfully: `cd cloudflare-worker && timeout 5 npm run dev || exit 0`

#### Manual Verification:
- [ ] Deploy to development/staging environment
- [ ] Verify endpoint returns 404: `curl https://[worker-url]/api/auth/github/token/12345 -w "\n%{http_code}\n"`
- [ ] Test GitHub OAuth flow still works (authorize + callback)
- [ ] Test capsule creation with file upload (uses GitHub token internally)
- [ ] Test capsule viewing (uses GitHub token for content proxy)
- [ ] Test dashboard loads correctly (uses GitHub token for storage calculation)
- [ ] Verify no errors in Worker logs related to missing endpoint

---

## Testing Strategy

### Unit Tests:
No unit tests exist in current codebase. If adding tests:
- Verify endpoint returns 404
- Verify other auth endpoints still respond correctly
- Verify capsule operations still retrieve tokens from KV

### Integration Tests:
- Complete OAuth flow (GitHub + Gmail)
- Create capsule with media file upload
- View created capsule content
- Load dashboard with storage metrics

### Manual Testing Steps:
1. **Verify Endpoint Removed**:
   ```bash
   # Should return 404
   curl https://[worker-url]/api/auth/github/token/test-user-id
   ```

2. **Test GitHub OAuth Flow**:
   - Navigate to frontend auth page
   - Click "Connect GitHub"
   - Complete OAuth authorization
   - Verify redirect with userId succeeds
   - Verify session endpoint returns user data

3. **Test Capsule Creation**:
   - Create new capsule with image/video file
   - Verify file uploads to GitHub LFS
   - Verify capsule metadata stored
   - Verify creation email sent
   - Verify magic link generated

4. **Test Capsule Viewing**:
   - Open capsule via magic link
   - Verify metadata displays
   - Verify content proxy serves file (uses GitHub token)
   - Verify no errors in browser console

5. **Test Dashboard**:
   - Load user dashboard
   - Verify capsules list displays
   - Verify storage usage calculates correctly
   - Verify repository link present

## Performance Considerations

- No performance impact - removing unused endpoint
- Slightly reduces Worker code size and route table
- Eliminates potential DDoS vector on endpoint

## Migration Notes

No migration required:
- Endpoint never called by any code
- No stored references to clean up
- No client updates needed
- No database/KV schema changes
- Can deploy immediately without coordination

## Deployment Notes

Safe to deploy immediately:
- Breaking change only affects non-existent callers
- No rollback concerns (endpoint was broken security-wise)
- No feature flags needed
- Monitor Worker logs for 404s to endpoint (indicates attacker probing)

## Security Impact

**Risk Eliminated**: Critical vulnerability completely removed
- Attack surface reduced
- No path to GitHub token exposure
- Token access exclusively internal via KV

**Defense in Depth**: Remaining protections:
- Tokens encrypted at rest (AES-256-GCM)
- KV namespace isolation
- CORS restrictions (will be tightened in production per `index.ts:20`)
- Rate limiting on capsule operations

## References

- Original issue: https://github.com/anjaysahoo/memory-time-capsule/issues/4
- PR that introduced vulnerability: #3 (Complete Memory Time Capsule MVP Implementation)
- Affected file: `cloudflare-worker/src/routes/auth.ts:158-177`
- Security documentation: `README.md` (encryption approach)
- Implementation plan reference: `thoughts/plans/2025-11-05-memory-time-capsule-implementation.md` (original architecture)

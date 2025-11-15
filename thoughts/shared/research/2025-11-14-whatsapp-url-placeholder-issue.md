---
date: 2025-11-14T00:00:00Z
researcher: Claude
git_commit: 2317c93301580fca18d122a6f9f3ae14fde3cafd
branch: bug_wrong-whatsapp-url
repository: anjaysahoo/memory-time-capsule
topic: "WhatsApp Reminder URL Placeholder Issue Investigation"
tags: [research, codebase, whatsapp, email, url-generation, bug]
status: complete
last_updated: 2025-11-14
last_updated_by: Claude
---

# Research: WhatsApp Reminder URL Placeholder Issue Investigation

**Date**: 2025-11-14
**Researcher**: Claude
**Git Commit**: 2317c93301580fca18d122a6f9f3ae14fde3cafd
**Branch**: bug_wrong-whatsapp-url
**Repository**: anjaysahoo/memory-time-capsule

## Research Question

The WhatsApp reminder button in emails contains a wrong URL with placeholder domain `https://your-app-domain.com/open?t=...`. Find where this URL is being generated and identify if there are similar issues elsewhere in the codebase.

## Summary

The issue is located in `cloudflare-worker/src/lib/workflow-generator.ts` at lines 137 and 152, where the placeholder domain `https://your-app-domain.com` is hardcoded instead of using the `FRONTEND_URL` environment variable. This affects two email functions:

1. **`sendUnlockEmail()`** - Sends unlock notification to recipient (line 137)
2. **`sendSenderNotification()`** - Sends notification to sender with "Send WhatsApp Reminder" button (line 152)

The correct implementation pattern exists in `cloudflare-worker/src/routes/capsule.ts` which properly uses `c.env.FRONTEND_URL` for magic link construction.

## Detailed Findings

### Primary Issue: Hardcoded Placeholder in Workflow Generator

**File**: `cloudflare-worker/src/lib/workflow-generator.ts`

**Line 137** - `sendUnlockEmail` function:
```typescript
async function sendUnlockEmail(capsule, pin, gmail) {
  const unlockDate = new Date(capsule.unlockAt * 1000).toLocaleDateString();
  const magicLink = `https://your-app-domain.com/open?t=${capsule.magicToken}`;
  // ... rest of function
}
```

**Line 152** - `sendSenderNotification` function:
```typescript
async function sendSenderNotification(capsule, gmail) {
  const magicLink = `https://your-app-domain.com/open?t=${capsule.magicToken}`;
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
    `Hi! Your time capsule "${capsule.title}" is now unlocked! View it here: ${magicLink}`
  )}`;
  // ... rest of function
}
```

**Impact**:
- Recipients receive emails with non-functional placeholder URLs
- Sender notification emails contain "Send WhatsApp Reminder" button with placeholder URL in the WhatsApp message
- Affects all capsules unlocked via GitHub Actions workflow

### Correct Implementation Reference

**File**: `cloudflare-worker/src/routes/capsule.ts:202-212`

**Lines 202-204** - Correct WhatsApp message generation:
```typescript
const whatsappMessage = encodeURIComponent(
  `Hi! I sent you a time capsule that unlocks on ${new Date(metadata.unlockAt * 1000).toLocaleDateString()}. ` +
  `Check your email or view it here: ${c.env.FRONTEND_URL}/open?t=${magicToken}`
);
const whatsappLink = `https://wa.me/?text=${whatsappMessage}`;
```

**Line 212** - Correct magic link in API response:
```typescript
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
```

**Key Difference**: Uses `c.env.FRONTEND_URL` environment variable instead of hardcoded placeholder.

### Other Placeholder Domain Usage (Non-Issues)

The following files contain similar placeholder patterns but are NOT code issues:

1. **Documentation Files** (Expected):
   - `docs/deployment.md:49,62,100,104,112,115,118` - Uses `your-worker-url.workers.dev`
   - `docs/setup.md:66,69,80,86,92` - Uses `your-worker-url`, `your-subdomain.workers.dev`
   - `frontend/PHASE8_IMPLEMENTATION.md:62` - Uses `your-worker-url.workers.dev`
   - `cloudflare-worker/PHASE6_TESTING.md:51` - Uses `your-frontend-url`

2. **Planning Documents** (Reference Only):
   - `thoughts/plans/2025-11-05-memory-time-capsule-implementation.md:2535,2549` - Contains `your-app-domain.com`

3. **Configuration Templates** (Expected):
   - `.env.example:15-16` - Uses localhost URLs (correct for development)

## Code References

- `cloudflare-worker/src/lib/workflow-generator.ts:137` - sendUnlockEmail with hardcoded placeholder
- `cloudflare-worker/src/lib/workflow-generator.ts:152` - sendSenderNotification with hardcoded placeholder
- `cloudflare-worker/src/routes/capsule.ts:202` - Correct implementation using c.env.FRONTEND_URL
- `cloudflare-worker/src/lib/email-templates.ts:20-87` - Creation email template generator
- `cloudflare-worker/src/lib/email-templates.ts:92-170` - Unlock email template generator

## Architecture Documentation

### Email URL Generation Flow

**Current (Correct) Flow - Capsule Creation**:
1. User creates capsule via POST `/create` endpoint
2. Backend generates magic token (16 bytes, base64url encoded)
3. Magic link constructed: `${c.env.FRONTEND_URL}/open?t=${magicToken}`
4. WhatsApp link constructed: `https://wa.me/?text=${encodedMessage}` with magic link embedded
5. Both links returned to frontend in JSON response
6. Creation email sent to recipient with magic link

**Broken Flow - GitHub Actions Unlock**:
1. GitHub Actions workflow runs hourly to check for capsules to unlock
2. Workflow calls `sendUnlockEmail()` and `sendSenderNotification()`
3. Both functions construct magic link with hardcoded `https://your-app-domain.com`
4. Emails sent with non-functional placeholder URLs
5. Recipients cannot access capsules, senders cannot send WhatsApp reminders

### Environment Variables for URL Construction

The codebase uses two environment variables for URL construction:

- **`FRONTEND_URL`**: The main web application domain (e.g., `https://timecapsule.app`)
  - Used in: Magic links, auth callbacks, WhatsApp messages
  - Default development value: `http://localhost:5173`

- **`WORKER_URL`**: The Cloudflare Worker API domain (e.g., `https://api.timecapsule.app`)
  - Used in: OAuth callbacks, content proxy URLs
  - Default development value: `http://localhost:8787`

These are declared as secrets in `cloudflare-worker/wrangler.toml:14-17` and examples in `.env.example:15-16`.

### WhatsApp Integration Points

The codebase has two WhatsApp integration points:

1. **Creation Flow** (`cloudflare-worker/src/routes/capsule.ts`):
   - Generates WhatsApp share link after capsule creation
   - Message: "Hi! I sent you a time capsule that unlocks on [date]. Check your email or view it here: [magic_link]"
   - Frontend displays "Share via WhatsApp" button (`frontend/src/pages/Create.tsx:199`)

2. **Unlock Notification Flow** (`cloudflare-worker/src/lib/workflow-generator.ts`):
   - Generates "Send WhatsApp Reminder" button in sender notification email
   - Message: "Hi! Your time capsule '[title]' is now unlocked! View it here: [magic_link]"
   - **This is where the bug occurs** - uses placeholder domain

## Related Research

No previous research documents found on this specific issue.

## Open Questions

1. Why does `workflow-generator.ts` not have access to the same environment variables as `capsule.ts`?
   - Possible answer: It generates GitHub Actions workflow YAML that runs in a different context
   - The workflow script needs to be updated to use environment variables from GitHub Actions secrets

2. Are there other hardcoded values in the workflow generator that should use environment variables?
   - Worth checking other configuration values in the workflow generation logic

3. Should the workflow-generator receive environment variables as parameters rather than hardcoding them?
   - This would make the code more flexible and testable

# Issues to Create from PR #21 Review Comments

## Issue 1: [Bug] FRONTEND_URL Undefined Causes Malformed URLs

**Labels:** bug, critical, configuration

**Description:**
Runtime error risk where `process.env.FRONTEND_URL` can be undefined, causing malformed URLs like `"undefined/open?t=TOKEN"` in email and WhatsApp notifications.

**Location:**
- `workflow-generator.ts:138, 153`
- WhatsApp URL encoding at line 154

**Proposed Fix:**
```typescript
const frontendUrl = process.env.FRONTEND_URL || 'https://memory-time-capsule.pages.dev';
if (!frontendUrl) {
  throw new Error('FRONTEND_URL environment variable is required');
}
```

**Related PR:** #21

---

## Issue 2: [Bug] Missing Input Validation for FRONTEND_URL in Secret Creation

**Labels:** bug, critical, error-handling

**Description:**
Missing input validation before creating GitHub secret. `c.env.FRONTEND_URL` could be undefined, causing silent failures during secret creation.

**Location:**
- `auth.ts:293`

**Proposed Fix:**
Add validation before secret creation:
```typescript
if (!c.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL must be configured before creating GitHub secrets');
}
```

**Related PR:** #21

---

## Issue 3: [Bug] Silent Error Handling in GitHub Secret Creation

**Labels:** bug, error-handling, logging

**Description:**
Try-catch block silently ignores errors during secret creation. When multiple secrets fail, impossible to identify which one caused the issue.

**Location:**
- `auth.ts:295-298`

**Proposed Fix:**
Improve error logging to identify specific failures:
```typescript
try {
  await createSecret(secretName, value);
} catch (error) {
  console.error(`Failed to create secret ${secretName}:`, error);
  // Consider partial success notification
}
```

**Related PR:** #21

---

## Issue 4: [Bug] No Migration Path for Existing Users with Broken Email Links

**Labels:** bug, enhancement, migration

**Description:**
FRONTEND_URL fix only applies to new users. Existing users with prior workflows will continue experiencing broken email links until workflows are regenerated.

**Proposed Solutions:**
1. Add migration script to update existing workflow files
2. Detect and warn users with outdated workflows
3. Auto-regenerate workflows on next auth
4. Document manual fix steps

**Related PR:** #21

# Deploy Security Fix to Cloudflare - Local Instructions

Your API token is **VALID** ✅ (verified via Postman)

The container environment has proxy restrictions preventing deployment from here.
**Solution**: Deploy from your local machine using the steps below.

---

## 🚀 Quick Deploy (3 Commands)

```bash
# 1. Navigate to project
cd /path/to/memory-time-capsule/cloudflare-worker

# 2. Set your API token
export CLOUDFLARE_API_TOKEN=YiYyyRZ5W5HT_mF7UOxx_1AIBBM5MmlsCZHhkeDj

# 3. Deploy!
npx wrangler deploy
```

---

## 📋 Complete Step-by-Step

### Step 1: Open Terminal on Your Computer

### Step 2: Navigate to Project
```bash
cd /path/to/memory-time-capsule/cloudflare-worker
```

### Step 3: Pull Latest Changes
```bash
# Make sure you have the security fix branch
git checkout claude/create-plan-issue-4-011CV2E1LPFyrsJ71nwHn7JF
git pull origin claude/create-plan-issue-4-011CV2E1LPFyrsJ71nwHn7JF
```

### Step 4: Set API Token
```bash
export CLOUDFLARE_API_TOKEN=YiYyyRZ5W5HT_mF7UOxx_1AIBBM5MmlsCZHhkeDj
```

### Step 5: Deploy
```bash
npx wrangler deploy
```

### Expected Output:
```
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded memory-time-capsule-worker (X.XX sec)
Published memory-time-capsule-worker (X.XX sec)
  https://memory-time-capsule-worker.[your-subdomain].workers.dev
Current Deployment ID: xxxxxxxxx
```

---

## 🧪 Critical Security Test (REQUIRED)

After deployment succeeds, immediately test:

```bash
# Get your worker URL from deployment output, then:
curl -w "\n%{http_code}\n" https://memory-time-capsule-worker.[your-subdomain].workers.dev/api/auth/github/token/test-user-id
```

### ✅ Expected Response (Security Fix Working):
```json
{"error":"Not Found","path":"/api/auth/github/token/test-user-id"}
404
```

### ❌ If You Get This (Security Fix Failed):
```json
{"token":"some-token-value"}
200
```
**→ DO NOT PROCEED - Contact immediately**

---

## 🔍 Additional Tests

### 1. Health Check
```bash
curl https://[worker-url]/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### 2. Session Endpoint (Should Still Work)
```bash
curl https://[worker-url]/api/auth/session/test-user-id
```
Expected: `{"error":"Session not found"}` (404 is correct)

---

## 🎯 What Got Deployed

### Files Changed:
1. **cloudflare-worker/src/routes/auth.ts**
   - Removed lines 158-177 (vulnerable endpoint)
   - ✅ No breaking changes to other endpoints

2. **CHANGELOG.md** (new file)
   - Documents security fix
   - References issue #4

### Commits Deployed:
- `773dd52` - Implementation plan
- `4e47818` - Security fix + CHANGELOG

---

## 🐛 Troubleshooting

### Error: "npm command not found"
```bash
# Install Node.js first
# Mac: brew install node
# Ubuntu: sudo apt install nodejs npm
# Windows: Download from nodejs.org
```

### Error: "wrangler not found"
```bash
# It should auto-install via npx, but if not:
npm install -g wrangler
```

### Error: "API token invalid"
```bash
# Verify token works:
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer YiYyyRZ5W5HT_mF7UOxx_1AIBBM5MmlsCZHhkeDj"

# Should return: {"success":true,...}
```

### Error: "Account access denied"
```bash
# Check token permissions:
# - Must have "Workers Scripts: Edit" permission
# - Must be for account: d510b8ee95a2f7c8c12835dcb25bc4fd
```

---

## 📊 After Successful Deployment

### 1. Update Status
Let me know deployment succeeded with:
- ✅ Worker URL
- ✅ Security test result (404 confirmed)
- ✅ Any errors in logs

### 2. Create Pull Request
I'll help create PR with:
- Security fix summary
- Test results
- Deployment verification

### 3. Monitor Logs
```bash
npx wrangler tail
```
Watch for:
- ✅ No errors on requests
- ⚠️  Any 404s to `/api/auth/github/token/*` (attacker probing)

---

## 🔒 Security Notes

- ✅ Token valid until you revoke it
- ✅ Can revoke at: https://dash.cloudflare.com/profile/api-tokens
- ✅ Recommend revoking after deployment if not using again
- ✅ This token grants Workers edit access only

---

## 💡 Quick Summary

**What**: Deploy security fix that removes exposed GitHub token endpoint
**Why**: Critical vulnerability - anyone with userId could get GitHub tokens
**Impact**: Zero breaking changes - endpoint was never used
**Test**: Must return 404 for `/api/auth/github/token/test-user-id`

---

**Ready to deploy?** Run the 3 commands at the top! 🚀

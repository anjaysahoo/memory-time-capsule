# Quick Start: Phase 6 Testing

## ✅ What I've Already Tested

1. **API Endpoint** - Working ✅
2. **Input Validation** - Working ✅  
3. **Email Templates** - Verified ✅
4. **Code Quality** - TypeScript compiles, deployed successfully ✅

## 🔴 What Needs Your Input

To complete testing, you need to **authenticate with GitHub and Gmail**.

### Step 1: Start OAuth Flows

Open these URLs in your browser:

#### GitHub OAuth:
```
https://memory-time-capsule-worker.anjaysahoo3.workers.dev/api/auth/github/authorize
```

This will return a JSON response with an `authUrl` - you need to open that URL in your browser.

#### Gmail OAuth:
```
https://memory-time-capsule-worker.anjaysahoo3.workers.dev/api/auth/gmail/authorize?userId=YOUR_USER_ID
```

Note: Gmail requires your userId from GitHub OAuth first!

### Step 2: Get Your User ID

After completing OAuth, you'll get a response with a `userId`. Save this value - you'll need it for all API calls.

Example response:
```json
{
  "success": true,
  "userId": "abc123xyz",
  "githubConnected": true,
  "gmailConnected": true,
  "repoFullName": "username/timecapsule-storage-xxxxx"
}
```

### Step 3: Test Capsule Creation

#### Test 1: Create a Text Capsule

Replace `YOUR_USER_ID` below with your actual userId:

```bash
curl -X POST https://memory-time-capsule-worker.anjaysahoo3.workers.dev/api/capsule/create \
  -F "userId=YOUR_USER_ID" \
  -F 'metadata={"title":"My First Time Capsule","unlockAt":1735689600,"recipientEmail":"YOUR_EMAIL@example.com","recipientName":"Your Name","contentType":"text","textContent":"Hello from the past! This is my first time capsule."}'
```

**What to check**:
- ✅ Response shows `"success": true`
- ✅ You receive an email at the recipient address
- ✅ Email contains a magic link
- ✅ Check your GitHub repo for updated `capsules.json`

#### Test 2: Create a Photo Capsule

First, get a small test image (< 50MB):

```bash
# Download a test image or use your own
curl -o test-photo.jpg https://via.placeholder.com/800x600.jpg

# Upload to create capsule
curl -X POST https://memory-time-capsule-worker.anjaysahoo3.workers.dev/api/capsule/create \
  -F "userId=YOUR_USER_ID" \
  -F 'metadata={"title":"Photo Memory","unlockAt":1735689600,"recipientEmail":"YOUR_EMAIL@example.com","contentType":"photo"}' \
  -F "file=@test-photo.jpg"
```

**What to check**:
- ✅ Response shows `"success": true`  
- ✅ File uploaded to GitHub repo under `capsules/` folder
- ✅ `capsules.json` updated with new entry

### Step 4: Verify Everything Works

After running the tests:

1. **Check GitHub Repository**:
   - Visit `https://github.com/YOUR_USERNAME/timecapsule-storage-XXXXX`
   - Verify `capsules.json` has your capsule entries
   - Verify `capsules/` folder has uploaded files

2. **Check Email**:
   - Open recipient inbox
   - Verify email received with proper formatting
   - Click magic link (should show countdown or locked status)

3. **Check Cloudflare KV** (optional):
   - Go to Cloudflare Dashboard → KV
   - Look for keys starting with `token:`
   - Verify token mappings exist

### Step 5: Report Results

Let me know:
- ✅ Which tests passed
- ❌ Any errors or unexpected behavior
- 📋 Any questions or issues

---

## Troubleshooting

### "User session not found"
- You haven't completed OAuth flows yet
- Run the GitHub and Gmail login URLs first

### "GitHub and Gmail must be connected"
- Complete both OAuth flows (GitHub AND Gmail)
- You need both to create capsules

### "GitHub token not found"
- OAuth flow might have failed
- Try re-authenticating with GitHub

### Email not received
- Check spam folder
- Verify Gmail OAuth was successful
- Check the sender email has Gmail API enabled

---

## Full Testing Checklist

Once you complete OAuth, mark these off:

- [ ] Text capsule created successfully
- [ ] Photo capsule created successfully  
- [ ] Video capsule created (optional, requires video file)
- [ ] Audio capsule created (optional, requires audio file)
- [ ] Email received with magic link
- [ ] Email has proper HTML formatting
- [ ] GitHub repo updated with capsule file
- [ ] `capsules.json` updated correctly
- [ ] Magic token is HASHED in capsules.json (not plaintext)
- [ ] WhatsApp link generated correctly
- [ ] File type validation works (test with .exe file)
- [ ] File size validation works (test with >100MB file)

---

**Ready?** Start with Step 1 and let me know how it goes! 🚀


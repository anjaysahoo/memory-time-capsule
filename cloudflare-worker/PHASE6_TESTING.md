# Phase 6: Capsule Creation - Testing Guide

## ✅ Automated Tests Completed

### 1. API Endpoint Accessibility
- **Status**: PASSED ✅
- **Test**: `curl https://memory-time-capsule-worker.anjaysahoo3.workers.dev/api`
- **Result**: API responds with correct endpoint list including `/api/capsule/*`

### 2. Input Validation
- **Status**: PASSED ✅
- **Tests**:
  - Missing userId: Returns `{"error":"Missing userId"}` ✅
  - Non-existent user session: Returns `{"error":"User session not found"}` ✅

### 3. Email Templates
- **Status**: VERIFIED ✅
- **Result**: `generateCreationEmail()` function exists with proper HTML and text formatting

## 🔴 Tests Requiring User Setup

The following tests **require you to complete OAuth flows** first:

### Prerequisites
You need to:
1. **Connect GitHub account** via `/api/auth/github/callback`
2. **Connect Gmail account** via `/api/auth/gmail/callback`
3. **Complete repository initialization**

Once you have a valid `userId` (you'll get this from the OAuth callback), you can run these tests:

---

### Test 1: Create Text-Only Capsule

```bash
# Replace YOUR_USER_ID with your actual userId from OAuth
curl -X POST https://memory-time-capsule-worker.anjaysahoo3.workers.dev/api/capsule/create \
  -F "userId=YOUR_USER_ID" \
  -F 'metadata={"title":"My First Text Capsule","unlockAt":1735689600,"recipientEmail":"recipient@example.com","recipientName":"Test Recipient","contentType":"text","textContent":"Hello from the past! This is a test message."}'
```

**Expected Result**:
```json
{
  "success": true,
  "capsule": {
    "id": "uuid-here",
    "title": "My First Text Capsule",
    "unlockAt": 1735689600,
    "magicLink": "https://your-frontend-url/open?t=TOKEN",
    "whatsappLink": "https://wa.me/?text=..."
  }
}
```

**Verification Checklist**:
- [ ] Response has `success: true`
- [ ] Response includes `capsule` object with `id`, `title`, `unlockAt`
- [ ] `magicLink` is in format: `https://FRONTEND_URL/open?t=MAGIC_TOKEN`
- [ ] `whatsappLink` is in format: `https://wa.me/?text=...`
- [ ] Email sent to recipient (check inbox)
- [ ] Email contains magic link and unlock date
- [ ] Email has both HTML and plain text versions

---

### Test 2: Create Video Capsule

First, create a small test video file (under 100MB):

```bash
# Create a small test video (or use an existing one)
# Example with ffmpeg to create a 5-second test video:
ffmpeg -f lavfi -i testsrc=duration=5:size=640x480:rate=1 -pix_fmt yuv420p test-video.mp4
```

Then upload:

```bash
curl -X POST https://memory-time-capsule-worker.anjaysahoo3.workers.dev/api/capsule/create \
  -F "userId=YOUR_USER_ID" \
  -F 'metadata={"title":"Video Time Capsule","unlockAt":1735689600,"recipientEmail":"recipient@example.com","contentType":"video"}' \
  -F "file=@test-video.mp4"
```

**Verification Checklist**:
- [ ] Response has `success: true`
- [ ] GitHub repository has new file in `capsules/` directory
- [ ] File path is `capsules/{CAPSULE_ID}.mp4`
- [ ] Check GitHub repo commits - should see "Add capsule file: capsules/..."

---

### Test 3: Verify capsules.json Updated

Visit your GitHub repository: `https://github.com/YOUR_USERNAME/timecapsule-storage-XXXXX`

**Verification Checklist**:
- [ ] `capsules.json` file exists
- [ ] New capsule entry is present in the JSON array
- [ ] Capsule has all required fields:
  - `id`, `title`, `unlockAt`, `recipientEmail`, `senderName`, `senderEmail`
  - `contentType`, `magicTokenHash` (NOT `magicToken` - should be hashed)
  - `createdAt`, `creationEmailSent`, `unlockEmailSent`
- [ ] `magicToken` field contains the HASH, not plaintext token
- [ ] For video/audio/photo capsules: `filePath` and `fileSize` are set
- [ ] For text capsules: `textContent` is set

---

### Test 4: Verify Token Mapping in KV

Go to Cloudflare Dashboard → Workers & Pages → KV → Your KV Namespace

**Verification Checklist**:
- [ ] Key exists with pattern: `token:{SHA256_HASH}`
- [ ] Value contains JSON with: `userId`, `repoFullName`, `capsuleId`

---

### Test 5: Test File Type Validation

```bash
# Create a fake .exe file
echo "fake executable" > test.exe

# Try to upload as photo (should fail)
curl -X POST https://memory-time-capsule-worker.anjaysahoo3.workers.dev/api/capsule/create \
  -F "userId=YOUR_USER_ID" \
  -F 'metadata={"title":"Invalid File Test","unlockAt":1735689600,"recipientEmail":"test@example.com","contentType":"photo"}' \
  -F "file=@test.exe"
```

**Expected Result**:
```json
{
  "error": "Invalid file type: application/x-msdownload"
}
```

**Verification Checklist**:
- [ ] Returns error for wrong file type
- [ ] Does not create capsule
- [ ] Does not modify capsules.json

---

### Test 6: Test File Size Limit

```bash
# Create a file larger than 100MB (for video)
dd if=/dev/zero of=large-video.mp4 bs=1M count=101

curl -X POST https://memory-time-capsule-worker.anjaysahoo3.workers.dev/api/capsule/create \
  -F "userId=YOUR_USER_ID" \
  -F 'metadata={"title":"Large File Test","unlockAt":1735689600,"recipientEmail":"test@example.com","contentType":"video"}' \
  -F "file=@large-video.mp4"
```

**Expected Result**:
```json
{
  "error": "File size exceeds 100MB limit"
}
```

**Verification Checklist**:
- [ ] Returns file size error
- [ ] Does not create capsule

---

### Test 7: Test Storage Limit (1GB Total)

This test requires creating multiple capsules until total storage approaches 1GB.

**Note**: This is difficult to test without significant setup. You can verify the code logic by checking:
- `getStorageUsage()` function in `github-lfs.ts`
- Storage check in `capsule.ts` route before upload

---

### Test 8: Test WhatsApp Link Generation

After creating a capsule, copy the `whatsappLink` from the response and:

**Verification Checklist**:
- [ ] Link format: `https://wa.me/?text=...`
- [ ] Opening link on mobile/desktop opens WhatsApp
- [ ] Pre-filled message contains:
  - Unlock date
  - Magic link to view capsule

---

## Summary

**Completed without user input**: ✅
- API accessibility
- Input validation
- Email template verification

**Requires OAuth setup**: 🔴
- Text capsule creation
- File upload (video/audio/photo)
- GitHub file verification
- capsules.json updates
- KV token mapping
- Email sending
- File type validation
- File size validation
- WhatsApp link

## Next Steps

1. **Start the OAuth flows**:
   - GitHub OAuth: First visit `https://memory-time-capsule-worker.anjaysahoo3.workers.dev/api/auth/github/authorize` - this returns a JSON with `authUrl` - open THAT url in your browser
   - Gmail OAuth: After GitHub, visit `https://memory-time-capsule-worker.anjaysahoo3.workers.dev/api/auth/gmail/authorize?userId=YOUR_USER_ID`

2. **Get your userId** from the OAuth callback response

3. **Run the tests above** using your userId

4. **Report any failures** for debugging

Let me know when you're ready to proceed or if you encounter any issues!


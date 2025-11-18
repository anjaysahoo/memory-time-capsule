# Optional Message and Photo Preview Implementation Plan

## Overview

Add optional preview message and photo fields to the capsule creation form that display on both the countdown (locked) and unlocked screens, providing recipients with a teaser or note from the sender before and after the main content is revealed.

## Current State Analysis

Based on research document `thoughts/shared/research/2025-11-18-capsule-creation-display-flow.md`:

**Current Form Fields**:
- Title (required, max 100 chars)
- Unlock date/time (required)
- Recipient email (required) and name (optional)
- Content type (required: text/video/audio/photo)
- Content (required: text input or file upload based on type)

**Current Display - Countdown View** (`frontend/src/pages/Open.tsx:157-194`):
```
🎁 icon
Title
From {senderName}
Countdown Component
Unlock date text
PIN instruction text
```

**Current Display - Unlocked View** (`frontend/src/pages/Open.tsx:242-288`):
```
🎉 icon
Title
From {senderName}
ContentViewer (main content)
Creation date
Unlock date
```

**Current Data Model** (`cloudflare-worker/src/types/capsule.ts:5-27`):
- Capsule interface has 27 fields
- No preview message or photo fields exist

### Key Discoveries:
- Form uses React useState for single FormData object (`frontend/src/pages/Create.tsx:18-25`)
- File uploads handled via FileUpload component with drag-and-drop (`frontend/src/components/FileUpload.tsx`)
- Backend stores files at `capsules/{id}.{ext}` via GitHub blob API (`cloudflare-worker/src/lib/github-lfs.ts:42-109`)
- Content limits: 30MB for files, 10,000 chars for text (`cloudflare-worker/src/types/capsule.ts:38-43`)
- Frontend and backend have separate Capsule type definitions

## Desired End State

**New Form Fields** (separate card at end of form):
- Optional preview message (textarea, max 500 characters, italic styling)
- Optional preview photo (file upload, max 30MB, JPEG/PNG/GIF)
- Both fields clearly labeled as optional with helpful context

**New Display - Countdown View**:
```
🎁 icon
Title
From {senderName}
[Preview Photo if exists - responsive sizing]
[Preview Message if exists - italic styling]
Countdown Component
Unlock date text
PIN instruction text
```

**New Display - Unlocked View**:
```
🎉 icon
Title
From {senderName}
[Preview Photo if exists - responsive sizing]
[Preview Message if exists - italic styling]
ContentViewer (main content)
Creation date
Unlock date
```

**Updated Data Model**:
- `previewMessage?: string` (max 500 chars)
- `previewPhotoPath?: string` (GitHub path like `capsules/{id}-preview.{ext}`)
- `previewPhotoSize?: number` (bytes)

### Verification Criteria:
- User can create capsule with neither optional field
- User can create capsule with only message
- User can create capsule with only photo
- User can create capsule with both
- Main content is still required (validation enforced)
- Preview content displays correctly in both countdown and unlocked views
- Preview photo has recommended resolution guidance (e.g., "Recommended: 1200x800px or smaller")

## What We're NOT Doing

- NOT making preview message/photo required
- NOT allowing preview photo to replace main content type photo
- NOT storing preview photo in email (emails remain unchanged)
- NOT adding preview content to WhatsApp share message
- NOT adding preview fields to CapsuleCard dashboard view
- NOT displaying preview in dashboard
- NOT allowing multiple preview photos
- NOT adding rich text editing to preview message (plain text only)

## Implementation Approach

The implementation will proceed in 3 phases:

1. **Backend Foundation** - Update data models, API endpoints, and storage handling
2. **Frontend Form** - Add optional fields to creation form with validation
3. **Frontend Display** - Update countdown and unlocked views to show preview content

Each phase is independently testable and can be verified before proceeding.

---

## Phase 1: Backend Data Model and API Updates

### Overview
Update backend data structures and API endpoints to support optional preview message and photo fields. This includes type definitions, validation, storage, and retrieval.

### Changes Required:

#### 1. Update Capsule Type Definition
**File**: `cloudflare-worker/src/types/capsule.ts`

**Changes**: Add three new optional fields to the Capsule interface (after line 16, before magicToken):

```typescript
export interface Capsule {
  id: string;
  title: string;
  unlockAt: number;
  recipientEmail: string;
  recipientName?: string;
  senderName: string;
  senderEmail: string;
  contentType: 'video' | 'audio' | 'photo' | 'text';
  filePath?: string;
  fileSize?: number;
  textContent?: string;
  previewMessage?: string;           // NEW: Optional preview message (max 500 chars)
  previewPhotoPath?: string;         // NEW: Optional preview photo path in repo
  previewPhotoSize?: number;         // NEW: Preview photo file size in bytes
  magicToken: string;
  magicTokenHash: string;
  // ... rest of fields
}
```

**Changes**: Update CapsuleMetadata interface (after line 35, before textContent):

```typescript
export interface CapsuleMetadata {
  title: string;
  unlockAt: number;
  recipientEmail: string;
  recipientName?: string;
  contentType: 'video' | 'audio' | 'photo' | 'text';
  textContent?: string;
  previewMessage?: string;           // NEW: Optional preview message
}
```

**Changes**: Add preview content limits constant (after line 42):

```typescript
export const CONTENT_LIMITS = {
  video: 30 * 1024 * 1024,  // 30MB
  audio: 30 * 1024 * 1024,  // 30MB
  photo: 30 * 1024 * 1024,  // 30MB
  text: 10000, // 10k characters
  previewMessage: 500,      // NEW: 500 characters for preview message
  previewPhoto: 30 * 1024 * 1024,  // NEW: 30MB for preview photo
};
```

**Changes**: Add allowed preview photo types (after line 48):

```typescript
export const ALLOWED_MIME_TYPES = {
  video: ['video/mp4', 'video/webm'],
  audio: ['audio/mpeg', 'audio/mp4'],
  photo: ['image/jpeg', 'image/png', 'image/gif'],
  previewPhoto: ['image/jpeg', 'image/png', 'image/gif'], // NEW: Same as photo
};
```

#### 2. Update Capsule Creation Endpoint
**File**: `cloudflare-worker/src/routes/capsule.ts`

**Changes**: Update form parsing (around line 28-29) to accept preview photo file:

```typescript
// Parse form data
const formData = await c.req.formData();
const userId = formData.get('userId') as string;
const metadata = JSON.parse(formData.get('metadata') as string) as CapsuleMetadata;
const file = formData.get('file') as File | null;
const previewPhotoFile = formData.get('previewPhoto') as File | null;  // NEW
```

**Changes**: Add preview message validation (after line 63, in validation section):

```typescript
// Validate preview message if provided
if (metadata.previewMessage && metadata.previewMessage.length > CONTENT_LIMITS.previewMessage) {
  return c.json({ 
    error: `Preview message exceeds ${CONTENT_LIMITS.previewMessage} characters` 
  }, 400);
}
```

**Changes**: Add preview photo validation (after preview message validation):

```typescript
// Validate preview photo if provided
if (previewPhotoFile) {
  // Validate file size
  if (previewPhotoFile.size > CONTENT_LIMITS.previewPhoto) {
    return c.json({ 
      error: `Preview photo size exceeds ${Math.floor(CONTENT_LIMITS.previewPhoto / 1024 / 1024)}MB limit` 
    }, 400);
  }

  // Validate MIME type
  const allowedTypes = ALLOWED_MIME_TYPES.previewPhoto;
  if (!allowedTypes.includes(previewPhotoFile.type)) {
    return c.json({ 
      error: `Invalid preview photo type: ${previewPhotoFile.type}` 
    }, 400);
  }
}
```

**Changes**: Update storage check (around line 99) to include preview photo:

```typescript
// Check storage usage
const octokit = createGitHubClient(githubToken);
const [owner, repo] = session.repository.full_name.split('/');
const storageUsed = await getStorageUsage(octokit, owner, repo);
const storageLimit = 1024 * 1024 * 1024; // 1GB

// Calculate total size to upload
const totalUploadSize = (file ? file.size : 0) + (previewPhotoFile ? previewPhotoFile.size : 0);

if (storageUsed + totalUploadSize > storageLimit) {
  return c.json({ 
    error: 'Storage limit exceeded',
    storageUsed,
    storageLimit,
  }, 400);
}
```

**Changes**: Upload preview photo after main content upload (after line 124):

```typescript
// Upload main content file if present
if (file) {
  const extension = file.name.split('.').pop();
  filePath = `capsules/${capsuleId}.${extension}`;
  fileSize = file.size;

  const fileContent = await file.arrayBuffer();
  await uploadToGitHubLFS(octokit, owner, repo, filePath, fileContent);
}

// Upload preview photo if present
let previewPhotoPath: string | undefined;
let previewPhotoSize: number | undefined;

if (previewPhotoFile) {
  const extension = previewPhotoFile.name.split('.').pop();
  previewPhotoPath = `capsules/${capsuleId}-preview.${extension}`;
  previewPhotoSize = previewPhotoFile.size;

  const photoContent = await previewPhotoFile.arrayBuffer();
  await uploadToGitHubLFS(octokit, owner, repo, previewPhotoPath, photoContent);
}
```

**Changes**: Add preview fields to capsule object (around line 127-145):

```typescript
// Create capsule object
const newCapsule: Capsule = {
  id: capsuleId,
  title: metadata.title,
  unlockAt: metadata.unlockAt,
  recipientEmail: metadata.recipientEmail,
  recipientName: metadata.recipientName,
  senderName: session.githubUser.name || session.githubUser.login,
  senderEmail: session.gmailEmail || session.githubUser.email || 'noreply@timecapsule.app',
  contentType: metadata.contentType,
  filePath,
  fileSize,
  textContent: metadata.textContent,
  previewMessage: metadata.previewMessage,      // NEW
  previewPhotoPath,                             // NEW
  previewPhotoSize,                             // NEW
  magicToken,
  magicTokenHash,
  createdAt: Math.floor(Date.now() / 1000),
  creationEmailSent: false,
  unlockEmailSent: false,
  whatsappSharedAtCreation: false,
};
```

#### 3. Update Capsule View Endpoint to Return Preview Data
**File**: `cloudflare-worker/src/lib/capsule-retrieval.ts`

**Changes**: Update `sanitizeCapsule` function to include preview fields in the returned data:

```typescript
export function sanitizeCapsule(capsule: Capsule, includeSecureData = false): any {
  const base = {
    id: capsule.id,
    title: capsule.title,
    unlockAt: capsule.unlockAt,
    recipientEmail: capsule.recipientEmail,
    recipientName: capsule.recipientName,
    senderName: capsule.senderName,
    contentType: capsule.contentType,
    fileSize: capsule.fileSize,
    createdAt: capsule.createdAt,
    unlockEmailSent: capsule.unlockEmailSent,
    unlockedAt: capsule.unlockedAt,
    viewedAt: capsule.viewedAt,
    previewMessage: capsule.previewMessage,       // NEW: Always include preview data
    previewPhotoSize: capsule.previewPhotoSize,   // NEW: Include size for display prep
  };

  // Add secure data if requested (after PIN verification)
  if (includeSecureData) {
    return {
      ...base,
      textContent: capsule.textContent,
    };
  }

  return base;
}
```

**Changes**: Add helper function to generate preview photo URL (add after `getContentUrl` function):

```typescript
/**
 * Generate preview photo URL using token hash
 */
export function getPreviewPhotoUrl(workerUrl: string, tokenHash: string): string {
  return `${workerUrl}/capsule/preview/${tokenHash}`;
}
```

#### 4. Add Preview Photo Proxy Endpoint
**File**: `cloudflare-worker/src/routes/capsule.ts`

**Changes**: Add new endpoint after content proxy endpoint (after line 492):

```typescript
/**
 * Proxy endpoint to fetch preview photo from GitHub
 * Available before unlock (unlike main content)
 */
capsule.get('/preview/:tokenHash', async (c) => {
  try {
    const tokenHash = c.req.param('tokenHash');

    // Get token mapping from KV
    const mapping = await getJson<any>(c.env.KV, KV_KEYS.tokenToRepo(tokenHash));
    
    if (!mapping) {
      return c.json({ error: 'Preview not found' }, 404);
    }

    // Get GitHub token
    const githubToken = await getEncryptedToken(
      c.env.KV,
      KV_KEYS.githubToken(mapping.userId),
      c.env.ENCRYPTION_KEY
    );

    if (!githubToken) {
      return c.json({ error: 'Access token not found' }, 500);
    }

    // Fetch capsule from repository
    const octokit = createGitHubClient(githubToken);
    const [owner, repo] = mapping.repoFullName.split('/');
    const capsule = await findCapsuleByTokenHash(octokit, owner, repo, tokenHash);

    if (!capsule || !capsule.previewPhotoPath) {
      return c.json({ error: 'Preview photo not found' }, 404);
    }

    // NOTE: Unlike main content, preview photo is accessible before unlock
    // This allows countdown view to show preview

    // Fetch preview photo from GitHub with proper authentication
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${capsule.previewPhotoPath}`;
    const response = await fetch(rawUrl, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3.raw',
      },
    });

    if (!response.ok) {
      console.error('GitHub preview photo fetch failed:', response.status, response.statusText);
      return c.json({ error: 'Failed to fetch preview photo from repository' }, 500);
    }

    // Determine content type from file extension
    const extension = capsule.previewPhotoPath.split('.').pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
    };
    const contentType = contentTypeMap[extension || ''] || 'image/jpeg';

    // Stream the content back to client
    return new Response(response.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${capsule.id}-preview.${extension}"`,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours (preview doesn't change)
      },
    });

  } catch (error: any) {
    console.error('Preview photo proxy error:', error);
    return c.json({
      error: 'Failed to fetch preview photo',
      message: error.message,
    }, 500);
  }
});
```

#### 5. Update Frontend Type Definitions
**File**: `frontend/src/api/types.ts`

**Changes**: Update Capsule interface (after line 65, before fileSize):

```typescript
export interface Capsule {
  id: string;
  title: string;
  unlockAt: number;
  recipientEmail: string;
  recipientName?: string;
  senderName: string;
  contentType: 'video' | 'audio' | 'photo' | 'text';
  previewMessage?: string;           // NEW: Optional preview message
  previewPhotoSize?: number;         // NEW: Preview photo size (to know if photo exists)
  fileSize?: number;
  createdAt: number;
  unlockEmailSent: boolean;
  unlockedAt?: number;
  viewedAt?: number;
}
```

**Changes**: Update CapsuleViewResponse to include preview photo URL (after line 82):

```typescript
export interface CapsuleViewResponse {
  capsule: Capsule;
  status: {
    unlocked: boolean;
    pending: boolean;
    requiresPin: boolean;
  };
  rateLimit?: {
    remaining: number;
    exceeded: boolean;
  };
  previewPhotoUrl?: string;  // NEW: URL to preview photo if it exists
}
```

#### 6. Update Capsule View Service to Return Preview URL
**File**: `cloudflare-worker/src/routes/capsule.ts`

**Changes**: Update `/view/:token` endpoint response (around line 283-291):

```typescript
// Generate preview photo URL if preview exists
let previewPhotoUrl = null;
if (capsule.previewPhotoPath) {
  previewPhotoUrl = `${c.env.WORKER_URL}/capsule/preview/${tokenHash}`;
}

return c.json({
  capsule: sanitizeCapsule(capsule),
  status: {
    unlocked: isUnlocked,
    pending: isPending,
    requiresPin: isUnlocked && !!capsule.pin,
  },
  rateLimit: rateLimitInfo,
  previewPhotoUrl,  // NEW: Include preview photo URL
});
```

### Success Criteria:

#### Automated Verification:
- [x] Type checking passes: `cd cloudflare-worker && npx tsc --noEmit` (passed)
- [x] Backend builds successfully: N/A (no build script, type checking passed)
- [x] Frontend type checking passes: `cd frontend && npm run build` (passed)
- [x] No linting errors in modified files: `npx eslint src/api/types.ts` (passed)

#### Manual Verification:
- [ ] Backend accepts `previewPhoto` file in FormData during capsule creation
- [ ] Backend validates preview message length (501 chars should fail)
- [ ] Backend validates preview photo size (31MB should fail)
- [ ] Backend validates preview photo MIME type (PDF should fail)
- [ ] Preview photo uploads to GitHub at correct path `capsules/{id}-preview.{ext}`
- [ ] `/capsule/preview/:tokenHash` endpoint returns preview photo with correct content-type
- [ ] Preview photo accessible before unlock (unlike main content)
- [ ] Storage usage calculation includes both main file and preview photo

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the backend changes work correctly before proceeding to the next phase.

---

## Phase 2: Frontend Form Implementation

### Overview
Add optional preview message and photo fields to the capsule creation form. This includes a new card section with clear labeling, validation, and user guidance.

### Changes Required:

#### 1. Update Form Data Interface
**File**: `frontend/src/pages/Create.tsx`

**Changes**: Add preview fields to FormData interface (after line 24):

```typescript
interface FormData {
  title: string;
  unlockDate: Date | null;
  recipientEmail: string;
  recipientName: string;
  contentType: ContentType;
  textContent: string;
  previewMessage: string;        // NEW: Optional preview message
}
```

**Changes**: Add preview photo state (after line 38):

```typescript
const [formData, setFormData] = useState<FormData>({
  title: "",
  unlockDate: null,
  recipientEmail: "",
  recipientName: "",
  contentType: "text",
  textContent: "",
  previewMessage: "",             // NEW: Initialize empty
});
const [file, setFile] = useState<File | null>(null);
const [previewPhoto, setPreviewPhoto] = useState<File | null>(null);  // NEW
```

#### 2. Create Reusable Preview Photo Upload Component
**File**: `frontend/src/components/PreviewPhotoUpload.tsx` (NEW FILE)

**Changes**: Create new component similar to FileUpload but specifically for preview photos:

```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PreviewPhotoUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

const PREVIEW_PHOTO_LIMIT = 30 * 1024 * 1024; // 30MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];
const RECOMMENDED_RESOLUTION = "1200x800px";

export default function PreviewPhotoUpload({
  file,
  onFileSelect,
  onFileRemove,
}: PreviewPhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > PREVIEW_PHOTO_LIMIT) {
      return `File size exceeds ${Math.floor(PREVIEW_PHOTO_LIMIT / 1024 / 1024)}MB limit`;
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Allowed: JPEG, PNG, GIF`;
    }

    return null;
  };

  const handleFile = (file: File) => {
    setError(null);
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (file) {
    return (
      <div className="border-2 border-border rounded-lg p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-3xl">📷</div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onFileRemove}
            className="text-destructive hover:text-destructive/80"
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/10"
            : "border-border hover:border-muted-foreground"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-4xl mb-3">📷</div>
        <p className="text-sm font-medium mb-1">
          Drop preview photo here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          Max size: {Math.floor(PREVIEW_PHOTO_LIMIT / 1024 / 1024)}MB • Recommended: {RECOMMENDED_RESOLUTION}
        </p>
        <input
          type="file"
          id="preview-photo-upload"
          className="hidden"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleChange}
        />
        <Button size="sm" variant="outline" asChild>
          <label htmlFor="preview-photo-upload" className="cursor-pointer">
            Choose Photo
          </label>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

#### 3. Add Preview Section to Form
**File**: `frontend/src/pages/Create.tsx`

**Changes**: Import new component (after line 13):

```typescript
import FileUpload from "@/components/FileUpload";
import PreviewPhotoUpload from "@/components/PreviewPhotoUpload";  // NEW
import DateTimePicker from "@/components/DateTimePicker";
```

**Changes**: Add optional preview section card (after line 362, before error message):

```typescript
          {/* Content Input */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Your Content *</h3>
              {/* ... existing content input ... */}
            </CardContent>
          </Card>

          {/* Preview Section (Optional) */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">
                Optional Preview
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Add a message or photo that will be visible on the countdown screen before unlock
              </p>

              <div className="space-y-6">
                {/* Preview Message */}
                <div>
                  <Label htmlFor="previewMessage">
                    Preview Message (optional)
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">
                    A short teaser or note (max 500 characters)
                  </p>
                  <Textarea
                    id="previewMessage"
                    value={formData.previewMessage}
                    onChange={(e) =>
                      setFormData({ ...formData, previewMessage: e.target.value })
                    }
                    placeholder="e.g., 'A special memory from our trip to Paris...'"
                    rows={3}
                    maxLength={500}
                    className="italic text-muted-foreground"
                  />
                  <div className="text-xs text-muted-foreground text-right mt-1">
                    {formData.previewMessage.length}/500
                  </div>
                </div>

                {/* Preview Photo */}
                <div>
                  <Label htmlFor="previewPhoto">
                    Preview Photo (optional)
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">
                    An image to show on the countdown screen
                  </p>
                  <PreviewPhotoUpload
                    file={previewPhoto}
                    onFileSelect={setPreviewPhoto}
                    onFileRemove={() => setPreviewPhoto(null)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
```

#### 4. Update Form Submission Logic
**File**: `frontend/src/pages/Create.tsx`

**Changes**: Update API call to include preview fields (around line 96-114):

```typescript
// Prepare form data for API
const apiFormData = new FormData();
apiFormData.append("userId", userId!);
apiFormData.append(
  "metadata",
  JSON.stringify({
    title: formData.title,
    unlockAt: Math.floor(formData.unlockDate.getTime() / 1000),
    recipientEmail: formData.recipientEmail,
    recipientName: formData.recipientName || undefined,
    contentType: formData.contentType,
    textContent:
      formData.contentType === "text" ? formData.textContent : undefined,
    previewMessage: formData.previewMessage || undefined,  // NEW: Include if not empty
  })
);

if (file) {
  apiFormData.append("file", file);
}

if (previewPhoto) {                                        // NEW: Append preview photo
  apiFormData.append("previewPhoto", previewPhoto);
}
```

#### 5. Add Visual Feedback for Preview Section
**File**: `frontend/src/pages/Create.tsx`

**Changes**: Add info alert at top of preview section to guide users (inside the Card, after the description paragraph):

```typescript
<p className="text-sm text-muted-foreground mb-6">
  Add a message or photo that will be visible on the countdown screen before unlock
</p>

<Alert className="mb-6 border-blue-200 bg-blue-50">
  <AlertDescription className="text-sm text-blue-900">
    💡 <strong>Tip:</strong> The preview message and photo will be shown to the recipient 
    before and after the capsule unlocks, giving them a sneak peek of what's inside.
  </AlertDescription>
</Alert>
```

### Success Criteria:

#### Automated Verification:
- [x] Frontend type checking passes: `cd frontend && npm run typecheck` (passed)
- [x] Frontend builds successfully: `cd frontend && npm run build` (passed)
- [x] No linting errors: `cd frontend && npm run lint` (no errors in new/modified files)

#### Manual Verification:
- [ ] Preview section card appears at the end of the form with clear "Optional Preview" heading
- [ ] Preview message textarea shows italic placeholder text
- [ ] Character counter updates as user types in preview message (e.g., "245/500")
- [ ] Preview message is limited to 500 characters (cannot type more)
- [ ] Preview photo upload component shows drag-and-drop area with "📷" icon
- [ ] Preview photo upload shows recommended resolution guidance
- [ ] Preview photo validates file size (31MB upload should show error)
- [ ] Preview photo validates file type (PDF upload should show error)
- [ ] Can remove selected preview photo by clicking "Remove" button
- [ ] Form submits successfully with no preview fields (both empty)
- [ ] Form submits successfully with only preview message
- [ ] Form submits successfully with only preview photo
- [ ] Form submits successfully with both preview fields filled
- [ ] FormData includes `previewMessage` in metadata JSON when submitted
- [ ] FormData includes `previewPhoto` file when submitted
- [ ] Main content validation still works (main content is required)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the form works correctly before proceeding to the next phase.

---

## Phase 3: Frontend Display Implementation

### Overview
Update the countdown (locked) and unlocked views to display preview message and photo in the correct order. Add styling for italic preview message and responsive photo display.

### Changes Required:

#### 1. Create Preview Content Display Component
**File**: `frontend/src/components/PreviewContent.tsx` (NEW FILE)

**Changes**: Create reusable component for displaying preview content:

```typescript
interface PreviewContentProps {
  previewMessage?: string;
  previewPhotoUrl?: string;
  className?: string;
}

export default function PreviewContent({
  previewMessage,
  previewPhotoUrl,
  className = "",
}: PreviewContentProps) {
  // Return null if no preview content
  if (!previewMessage && !previewPhotoUrl) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview Photo */}
      {previewPhotoUrl && (
        <div className="rounded-lg overflow-hidden border border-border">
          <img
            src={previewPhotoUrl}
            alt="Preview"
            className="w-full h-auto max-h-96 object-contain bg-gray-50"
          />
        </div>
      )}

      {/* Preview Message */}
      {previewMessage && (
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <p className="text-muted-foreground italic text-sm leading-relaxed">
            {previewMessage}
          </p>
        </div>
      )}
    </div>
  );
}
```

#### 2. Update Countdown View (Locked State)
**File**: `frontend/src/pages/Open.tsx`

**Changes**: Import PreviewContent component (after line 10):

```typescript
import ContentViewer from "@/components/ContentViewer";
import PreviewContent from "@/components/PreviewContent";  // NEW
```

**Changes**: Update countdown view to show preview content (replace lines 162-189):

```typescript
// Countdown state (not yet unlocked)
if (state === "countdown") {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-6">🎁</div>
            <h1 className="text-3xl font-bold mb-4">{capsule.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              From <strong>{capsule.senderName}</strong>
            </p>

            {/* NEW: Preview Content (Photo + Message) */}
            <PreviewContent
              previewMessage={capsule.previewMessage}
              previewPhotoUrl={capsuleData?.previewPhotoUrl}
              className="mb-8"
            />

            <Countdown
              targetDate={new Date(capsule.unlockAt * 1000)}
              onComplete={loadCapsule}
            />

            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                This time capsule will unlock on{" "}
                <strong>
                  {new Date(capsule.unlockAt * 1000).toLocaleString("en-US", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </strong>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You'll receive an email with a PIN to open it when the time
                comes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

#### 3. Update Unlocked View (Content Display State)
**File**: `frontend/src/pages/Open.tsx`

**Changes**: Update unlocked view to show preview content before main content (replace lines 242-287):

```typescript
// Unlocked state (content display)
if (state === "unlocked" && unlockedData) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold mb-2">{capsule.title}</h1>
              <p className="text-muted-foreground">
                From <strong>{capsule.senderName}</strong>
              </p>
            </div>

            {/* NEW: Preview Content (Photo + Message) */}
            <PreviewContent
              previewMessage={capsule.previewMessage}
              previewPhotoUrl={capsuleData?.previewPhotoUrl}
              className="mb-8"
            />

            {/* Main Content */}
            <div className="mb-8">
              <ContentViewer
                contentType={capsule.contentType}
                contentUrl={unlockedData.contentUrl}
                textContent={unlockedData.capsule.textContent}
              />
            </div>

            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              <p>
                Created on{" "}
                {new Date(capsule.createdAt * 1000).toLocaleDateString(
                  "en-US",
                  {
                    dateStyle: "long",
                  }
                )}
              </p>
              <p className="mt-1">
                Unlocked on{" "}
                {new Date(capsule.unlockAt * 1000).toLocaleString(
                  "en-US",
                  {
                    dateStyle: "long",
                    timeStyle: "short",
                  }
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

#### 4. Add Responsive Styling for Preview Content
**File**: `frontend/src/components/PreviewContent.tsx`

**Changes**: Update image styling for better responsiveness (already included in component above, but emphasizing):

```typescript
<img
  src={previewPhotoUrl}
  alt="Preview"
  className="w-full h-auto max-h-96 object-contain bg-gray-50"
  loading="lazy"
/>
```

**Styling considerations**:
- `w-full`: Takes full width of container
- `h-auto`: Maintains aspect ratio
- `max-h-96`: Limits max height to 24rem (384px) to prevent oversized images
- `object-contain`: Ensures entire image is visible without cropping
- `bg-gray-50`: Background color visible during loading
- `loading="lazy"`: Lazy load for performance

#### 5. Update PIN Entry View (Show Preview While Waiting)
**File**: `frontend/src/pages/Open.tsx`

**Changes**: Add preview content to PIN entry screen (around line 197-238):

```typescript
// PIN entry state
if (state === "pin-entry") {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-6">🔓</div>
            <h1 className="text-2xl font-bold mb-4">
              Time Capsule Unlocked!
            </h1>
            <p className="text-muted-foreground mb-8">
              From <strong>{capsule.senderName}</strong>
            </p>

            {/* NEW: Preview Content (visible during PIN entry too) */}
            <PreviewContent
              previewMessage={capsule.previewMessage}
              previewPhotoUrl={capsuleData?.previewPhotoUrl}
              className="mb-8"
            />

            <p className="text-lg font-medium mb-6">
              Enter your 4-digit PIN to view
            </p>

            <PinInput onSubmit={handlePinSubmit} />

            {pinError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{pinError}</AlertDescription>
              </Alert>
            )}

            <p className="text-sm text-muted-foreground mt-4">
              {remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""}{" "}
              remaining
            </p>

            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                Check your email for the PIN. The PIN was sent when this
                capsule unlocked.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### Success Criteria:

#### Automated Verification:
- [ ] Frontend type checking passes: `cd frontend && npm run typecheck`
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] No linting errors: `cd frontend && npm run lint`

#### Manual Verification:
- [ ] Countdown view shows preview photo (if exists) between sender name and countdown timer
- [ ] Countdown view shows preview message (if exists) below preview photo, above countdown timer
- [ ] Preview message displays with italic styling and light gray background
- [ ] Preview photo displays with responsive sizing (max height 384px, maintains aspect ratio)
- [ ] Preview photo has rounded corners and border
- [ ] Preview content displays correctly when only message exists (no photo)
- [ ] Preview content displays correctly when only photo exists (no message)
- [ ] Preview content displays correctly when both exist (photo above message)
- [ ] Preview content does not display when neither exists (no extra spacing)
- [ ] PIN entry view shows preview content above PIN input
- [ ] Unlocked view shows preview content between sender name and main content
- [ ] Unlocked view maintains proper spacing: Title → Sender → Preview → Main Content → Dates
- [ ] Preview photo loads without breaking layout if image fails to load
- [ ] Preview content is properly centered on all screen sizes
- [ ] On mobile devices (<640px), preview content still displays well

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the display works correctly across all views.

---

## Testing Strategy

### Unit Tests (Optional - Can be added later)

**Frontend Component Tests**:
- `PreviewContent.tsx` - Test rendering with various prop combinations
- `PreviewPhotoUpload.tsx` - Test file validation and user interactions

**Backend Validation Tests**:
- Preview message length validation
- Preview photo size validation
- Preview photo MIME type validation

### Integration Tests

**End-to-End Capsule Creation Flow**:
1. Create capsule with preview message only
2. Create capsule with preview photo only
3. Create capsule with both preview message and photo
4. Create capsule with neither (verify backward compatibility)

**End-to-End Viewing Flow**:
1. View countdown screen with preview content
2. Enter PIN and view unlocked screen with preview content
3. Verify preview photo loads correctly
4. Verify preview message displays with correct styling

### Manual Testing Steps

#### Creation Flow:
1. Open creation form at `/create`
2. Fill in all required fields (title, unlock date, recipient, content)
3. Scroll to "Optional Preview" section
4. Enter a 250-character preview message
5. Upload a 5MB JPEG preview photo (1920x1080)
6. Submit form
7. Verify success message appears
8. Check dashboard to confirm capsule was created

#### Countdown View:
1. Open magic link in browser
2. Verify page shows: 🎁 icon → Title → "From {sender}" → Preview Photo → Preview Message → Countdown
3. Verify preview photo displays at reasonable size
4. Verify preview message has italic styling
5. Verify countdown timer shows correct time remaining

#### Unlocked View:
1. Wait for capsule to unlock (or manually update unlock time in database)
2. Trigger unlock email via cron job
3. Open magic link and enter PIN
4. Verify unlocked page shows: 🎉 icon → Title → "From {sender}" → Preview Photo → Preview Message → Main Content → Dates
5. Verify all content displays correctly

#### Edge Cases:
1. Create capsule with 500-character preview message (max length)
2. Create capsule with 30MB preview photo (max size)
3. Create capsule with very long preview message and large photo
4. Test with different image formats (JPEG, PNG, GIF)
5. Test with various screen sizes (mobile, tablet, desktop)

## Performance Considerations

**Storage Impact**:
- Each preview photo adds up to 30MB to storage
- Preview message adds negligible storage (500 chars max = ~500 bytes)
- Storage check includes both main content and preview photo before upload

**Loading Performance**:
- Preview photos load lazily (`loading="lazy"` attribute)
- Preview photos cached for 24 hours (don't change after creation)
- Max height constraint (384px) limits rendering cost
- Consider adding image optimization in future (not in scope)

**API Performance**:
- Preview photo endpoint separate from main content endpoint
- Preview endpoint allows longer caching (24 hours vs 1 hour)
- No additional database queries (preview data in same Capsule object)

## Migration Notes

**Backward Compatibility**:
- Existing capsules without preview fields will continue to work
- Preview fields are optional in all interfaces
- PreviewContent component returns null when no preview data exists
- No database migration needed (Git-based storage automatically handles new fields)

**Data Model Changes**:
- Three new optional fields in Capsule interface
- Frontend and backend types stay in sync
- No breaking changes to existing API endpoints

## References

- Research document: `thoughts/shared/research/2025-11-18-capsule-creation-display-flow.md`
- Current implementation branch: `optional-message-photo`
- Related components:
  - Form: `frontend/src/pages/Create.tsx:18-435`
  - Display: `frontend/src/pages/Open.tsx:1-291`
  - File upload: `frontend/src/components/FileUpload.tsx:1-171`
  - Content viewer: `frontend/src/components/ContentViewer.tsx:1-67`
- Backend types: `cloudflare-worker/src/types/capsule.ts:5-49`
- Backend routes: `cloudflare-worker/src/routes/capsule.ts:23-570`
- GitHub storage: `cloudflare-worker/src/lib/github-lfs.ts:42-150`


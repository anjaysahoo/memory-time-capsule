---
date: 2025-11-18T00:00:00-08:00
researcher: Anjay Sahoo
git_commit: 8d5bbb861ec9d7bf919f689f8359b679d2e0bc77
branch: optional-message-photo
repository: memory-time-capsule
topic: "Capsule Creation and Display Flow - Current Implementation"
tags: [research, codebase, capsule, forms, display, file-upload]
status: complete
last_updated: 2025-11-18
last_updated_by: Anjay Sahoo
---

# Research: Capsule Creation and Display Flow - Current Implementation

**Date**: 2025-11-18T00:00:00-08:00  
**Researcher**: Anjay Sahoo  
**Git Commit**: 8d5bbb861ec9d7bf919f689f8359b679d2e0bc77  
**Branch**: optional-message-photo  
**Repository**: memory-time-capsule

## Research Question

How does the current capsule creation form work, what fields are captured, how is the data model structured, and how are capsules displayed before and after unlock?

## Summary

The memory time capsule application has a comprehensive capsule creation and display system. The creation form currently captures: title, unlock date/time, recipient email/name, content type (text/video/audio/photo), and the content itself. The backend stores this in a `Capsule` interface with 27 fields. Locked capsules display a countdown with title and sender name. Unlocked capsules require PIN verification and then show the title, sender name, and content (via ContentViewer). The system uses GitHub LFS for file storage and Cloudflare Workers for the backend API.

## Detailed Findings

### Capsule Creation Form (Frontend)

**File**: `frontend/src/pages/Create.tsx`

The creation form is implemented as a multi-card form with the following structure:

**FormData Interface** (lines 18-25):
```typescript
interface FormData {
  title: string;
  unlockDate: Date | null;
  recipientEmail: string;
  recipientName: string;
  contentType: ContentType;
  textContent: string;
}
```

**Form Fields Captured**:
1. **Title** - Required, max 100 characters, single line input
2. **Unlock Date & Time** - Required, uses DateTimePicker component, must be in future
3. **Recipient Email** - Required email field
4. **Recipient Name** - Optional text field
5. **Content Type** - Required, radio button selection (text/video/audio/photo)
6. **Content** - Either:
   - Text content (Textarea, max 10,000 characters) for "text" type
   - File upload (via FileUpload component) for video/audio/photo types

**Form Submission Flow** (lines 54-150):
1. Client-side validation of all required fields
2. Creates a FormData object with:
   - `userId` 
   - `metadata` (JSON stringified object containing title, unlockAt, recipientEmail, recipientName, contentType, textContent)
   - `file` (if content type is not "text")
3. Calls `capsuleService.create()` with progress tracking callback
4. On success, shows success screen with magic link and WhatsApp sharing option
5. Error handling includes specific messages for timeouts, file size issues, and Cloudflare Worker limits

**Upload Progress Tracking**: For files larger than 10MB, displays a progress bar with percentage, file size, and estimated time remaining (lines 372-403).

### File Upload Component

**File**: `frontend/src/components/FileUpload.tsx`

The FileUpload component handles all file selection and validation:

**Features**:
- Drag-and-drop support with visual feedback
- Click-to-browse functionality
- File validation (size and MIME type)
- Preview of selected file with remove option

**Limits** (lines 12-16):
```typescript
const CONTENT_LIMITS = {
  video: 30 * 1024 * 1024, // 30MB
  audio: 30 * 1024 * 1024, // 30MB
  photo: 30 * 1024 * 1024, // 30MB
};
```

**Allowed Types** (lines 18-22):
```typescript
const ALLOWED_TYPES = {
  video: ["video/mp4", "video/webm"],
  audio: ["audio/mpeg", "audio/mp4", "audio/m4a"],
  photo: ["image/jpeg", "image/png", "image/gif"],
};
```

### Capsule Data Model (Backend)

**File**: `cloudflare-worker/src/types/capsule.ts`

**Full Capsule Interface** (lines 5-27):
```typescript
export interface Capsule {
  id: string;                      // UUID
  title: string;                   // Capsule title
  unlockAt: number;                // Unix timestamp
  recipientEmail: string;          // Recipient's email
  recipientName?: string;          // Optional recipient name
  senderName: string;              // From GitHub profile
  senderEmail: string;             // From Gmail or GitHub
  contentType: 'video' | 'audio' | 'photo' | 'text';
  filePath?: string;               // GitHub repo path (capsules/{id}.ext)
  fileSize?: number;               // In bytes
  textContent?: string;            // For text capsules
  magicToken: string;              // 128-bit random token
  magicTokenHash: string;          // SHA-256 hash
  pin?: string;                    // 4-digit PIN
  pinHash?: string;                // SHA-256 hash
  createdAt: number;               // Unix timestamp
  creationEmailSent: boolean;      // Email sent flag
  unlockEmailSent: boolean;        // Unlock email sent flag
  unlockedAt?: number;             // When unlocked
  viewedAt?: number;               // When viewed
  whatsappSharedAtCreation: boolean; // WhatsApp share tracking
}
```

**CapsuleMetadata Interface** (lines 29-36):
This is what the frontend sends during creation:
```typescript
export interface CapsuleMetadata {
  title: string;
  unlockAt: number;
  recipientEmail: string;
  recipientName?: string;
  contentType: 'video' | 'audio' | 'photo' | 'text';
  textContent?: string;
}
```

### Backend Capsule Creation Endpoint

**File**: `cloudflare-worker/src/routes/capsule.ts`

**POST /create** (lines 23-224):

**Process Flow**:
1. Parses FormData (userId, metadata JSON, file)
2. Validates user session and GitHub/Gmail connections
3. Validates metadata fields (title, unlockAt, recipientEmail)
4. Validates content (text length or file size/MIME type)
5. Checks storage usage against 1GB limit
6. Generates capsule ID (UUID) and magic token (128-bit)
7. Uploads file to GitHub LFS if present (as `capsules/{id}.{ext}`)
8. Creates Capsule object with all fields
9. Updates capsules.json in GitHub repo
10. Stores token mapping in Cloudflare KV
11. Sends creation email to recipient
12. Returns success with magic link and WhatsApp link

**Storage Location**: Files stored in private GitHub repository using GitHub's blob API (not true LFS but similar approach).

### Locked Capsule Display (Countdown View)

**File**: `frontend/src/pages/Open.tsx`

**Countdown State** (lines 157-194):

When a capsule is not yet unlocked, the display shows:

```
┌─────────────────────────────┐
│          🎁                 │
│                             │
│    {capsule.title}          │  <- Title (h1, 3xl font, bold)
│                             │
│  From {capsule.senderName}  │  <- Sender info
│                             │
│  [Countdown Component]      │  <- Days/Hours/Minutes/Seconds
│                             │
│  ─────────────────────      │
│                             │
│  This time capsule will     │
│  unlock on {date}          │
│                             │
│  You'll receive an email    │
│  with a PIN to open it      │
└─────────────────────────────┘
```

**Elements Displayed**:
- 🎁 emoji icon
- Capsule title (line 164)
- "From {senderName}" (line 166)
- Countdown timer component (line 169-172)
- Formatted unlock date and time (line 178-181)
- Message about PIN email (line 184-187)

**Note**: Currently does NOT display any preview message or photo before unlock.

### Unlocked Capsule Display (After PIN Verification)

**File**: `frontend/src/pages/Open.tsx`

**Unlocked State** (lines 242-288):

After successful PIN entry, the display shows:

```
┌─────────────────────────────┐
│          🎉                 │
│                             │
│    {capsule.title}          │  <- Title (h1, 3xl font, bold)
│  From {capsule.senderName}  │  <- Sender info
│                             │
│  ┌─────────────────────┐   │
│  │                     │   │
│  │  [ContentViewer]    │   │  <- Video/Audio/Photo/Text
│  │                     │   │
│  └─────────────────────┘   │
│                             │
│  ─────────────────────      │
│                             │
│  Created on {date}          │
│  Unlocked on {date}         │
└─────────────────────────────┘
```

**Elements Displayed**:
- 🎉 emoji icon (success/celebration)
- Capsule title (line 250)
- "From {senderName}" (line 252)
- ContentViewer component showing the actual content (line 256-260)
- Creation date (line 265-269)
- Unlock date (line 273-279)

### Content Viewer Component

**File**: `frontend/src/components/ContentViewer.tsx`

This component handles display of all content types (lines 7-67):

**Content Type Rendering**:
1. **Text** (lines 12-19): Displays in a gray box with prose styling
2. **Video** (lines 22-31): `<video>` element with controls, black background
3. **Audio** (lines 34-47): 🎵 icon + "Audio Message" text + `<audio>` element with controls
4. **Photo** (lines 50-59): `<img>` element with responsive sizing

### Capsule Card (Dashboard View)

**File**: `frontend/src/components/CapsuleCard.tsx`

Shows capsule summary on dashboard with:
- Content type icon (🎥/🎵/📷/📝)
- Title
- Recipient (name or email)
- Status badge (Unlocked/Failed/Pending)
- Unlock date/time
- Content type label
- File size (if applicable)
- Viewed timestamp (if viewed)

**Note**: This is a summary card, not the full capsule view.

### Frontend Data Types

**File**: `frontend/src/api/types.ts`

**Frontend Capsule Interface** (lines 58-71):
```typescript
export interface Capsule {
  id: string;
  title: string;
  unlockAt: number;
  recipientEmail: string;
  recipientName?: string;
  senderName: string;
  contentType: 'video' | 'audio' | 'photo' | 'text';
  fileSize?: number;
  createdAt: number;
  unlockEmailSent: boolean;
  unlockedAt?: number;
  viewedAt?: number;
}
```

**Note**: Frontend Capsule type is a subset of backend Capsule (excludes sensitive fields like tokens, hashes, file paths).

## Code References

### Key Files and Locations

**Frontend**:
- `frontend/src/pages/Create.tsx` - Main creation form (435 lines)
- `frontend/src/pages/Open.tsx` - Capsule viewing/countdown/unlock (291 lines)
- `frontend/src/components/FileUpload.tsx` - File upload with validation (171 lines)
- `frontend/src/components/ContentViewer.tsx` - Content display (67 lines)
- `frontend/src/components/CapsuleCard.tsx` - Dashboard card (80 lines)
- `frontend/src/components/Countdown.tsx` - Countdown timer component
- `frontend/src/components/DateTimePicker.tsx` - Date/time selection
- `frontend/src/api/types.ts:58-71` - Frontend Capsule interface
- `frontend/src/api/services.ts` - API service layer

**Backend**:
- `cloudflare-worker/src/routes/capsule.ts` - All capsule endpoints (570 lines)
  - `POST /create` (lines 23-224) - Create new capsule
  - `GET /view/:token` (lines 230-300) - Get capsule metadata
  - `POST /view/:token/verify-pin` (lines 305-405) - Verify PIN and unlock
  - `GET /content/:tokenHash` (lines 411-492) - Proxy capsule content from GitHub
  - `GET /dashboard/:userId` (lines 497-567) - Get all capsules for user
- `cloudflare-worker/src/types/capsule.ts` - Data structures
  - `Capsule` interface (lines 5-27) - Complete capsule data
  - `CapsuleMetadata` interface (lines 29-36) - Creation metadata
  - `CONTENT_LIMITS` (lines 38-43) - File size limits
  - `ALLOWED_MIME_TYPES` (lines 45-49) - Allowed file types
- `cloudflare-worker/src/lib/github-lfs.ts` - GitHub file operations
- `cloudflare-worker/src/lib/email-templates.ts` - Email generation

## Architecture Documentation

### Data Flow

**Capsule Creation**:
```
Frontend Form → FormData → API POST /create → Validation → 
GitHub LFS Upload → Update capsules.json → Store KV mapping → 
Send Email → Return Success
```

**Capsule Viewing (Locked)**:
```
Magic Link → API GET /view/:token → Hash Token → KV Lookup → 
GitHub Fetch → Check Unlock Status → Return Metadata → 
Display Countdown
```

**Capsule Unlocking**:
```
PIN Entry → API POST /view/:token/verify-pin → Rate Limit Check → 
Hash Token & PIN → KV Lookup → GitHub Fetch → Verify PIN → 
Generate Content URL → Return Content Access → 
Display Unlocked View
```

**Content Retrieval**:
```
Content URL → API GET /content/:tokenHash → KV Lookup → 
GitHub Token → Fetch from GitHub Raw → Proxy to Client
```

### Storage Architecture

**Cloudflare KV** (Key-Value Store):
- `user:{userId}` - User session data
- `github_token:{userId}` - Encrypted GitHub access token
- `gmail_token:{userId}` - Encrypted Gmail tokens
- `token:{tokenHash}` - Magic token to repo/capsule mapping
- `pin_attempts:{tokenHash}` - Rate limiting data

**GitHub Repository** (Private per user):
- `capsules.json` - Array of all Capsule objects
- `capsules/{id}.{ext}` - Content files (via blob API)
- `.github/workflows/unlock-cron.yml` - Automated unlock workflow

### Security Model

**Authentication**:
- GitHub OAuth for repository access
- Gmail OAuth for email sending
- Session stored in Cloudflare KV

**Authorization**:
- Magic tokens (128-bit, base64url)
- Only SHA-256 hashes stored
- 4-digit PIN (also hashed)
- Rate limiting: max 5 PIN attempts per hour

**Content Access**:
- Content URLs only valid after PIN verification
- Files proxied through worker (not direct GitHub access)
- Private repository ensures content privacy

## Current Implementation Limitations

### What Currently Exists
1. Title field (required, max 100 chars)
2. Content upload (video/audio/photo/text with size limits)
3. Recipient info (email required, name optional)
4. Unlock date/time selection
5. Countdown display before unlock
6. PIN-protected content access after unlock

### What Does NOT Currently Exist
1. **Optional message field** separate from main content
2. **Optional photo upload** separate from main content type
3. **Preview message/photo** displayed during countdown (locked state)
4. **Message/photo persistence** shown after unlock alongside content

### Current Display Order

**Locked (Countdown View)**:
1. 🎁 icon
2. Title
3. Sender name
4. Countdown timer
5. Unlock date text
6. PIN instruction text

**Unlocked (Content View)**:
1. 🎉 icon
2. Title
3. Sender name
4. ContentViewer (main content)
5. Creation date
6. Unlock date

## Related Research

- `thoughts/research/architecture.md` - Overall system architecture
- `thoughts/plans/2025-11-05-memory-time-capsule-implementation.md` - Original implementation plan
- `thoughts/shared/prs/3_description.md` - Previous capsule-related PR

## Technical Notes

### Content Type System
The application has a strict content type system where each capsule has ONE primary content type. The contentType field determines:
1. What kind of file upload is allowed (or if text input is shown)
2. How the content is validated
3. How the content is displayed via ContentViewer
4. What icon is shown on cards and forms

Currently, there is no concept of "additional" or "supplementary" content alongside the main content.

### File Upload Implementation
The FileUpload component is designed for the primary content type and is conditionally rendered based on contentType selection. It handles:
- Single file selection
- Drag-and-drop
- Type and size validation
- File preview with remove option

It is NOT designed for multiple files or optional additional uploads.

### Form State Management
The Create page uses React useState for form management with a single FormData object. File state is separate (useState<File | null>). The form does not currently have fields for optional message or optional photo.

## Open Questions

N/A - This is a documentation-only research document describing the current state.


/**
 * Capsule data structures
 */

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
  previewMessage?: string;           // Optional preview message (max 500 chars)
  previewPhotoPath?: string;         // Optional preview photo path in repo
  previewPhotoSize?: number;         // Preview photo file size in bytes
  magicToken: string;
  magicTokenHash: string;
  pin?: string;
  pinHash?: string;
  createdAt: number;
  creationEmailSent: boolean;
  unlockEmailSent: boolean;
  unlockedAt?: number;
  viewedAt?: number;
  whatsappSharedAtCreation: boolean;
}

export interface CapsuleMetadata {
  title: string;
  unlockAt: number;
  recipientEmail: string;
  recipientName?: string;
  contentType: 'video' | 'audio' | 'photo' | 'text';
  textContent?: string;
  previewMessage?: string;           // Optional preview message
}

export const CONTENT_LIMITS = {
  video: 30 * 1024 * 1024,  // 30MB (Cloudflare Workers free tier CPU limit)
  audio: 30 * 1024 * 1024,  // 30MB
  photo: 30 * 1024 * 1024,  // 30MB
  text: 10000, // 10k characters
  previewMessage: 500,      // 500 characters for preview message
  previewPhoto: 30 * 1024 * 1024,  // 30MB for preview photo
};

export const ALLOWED_MIME_TYPES = {
  video: ['video/mp4', 'video/webm'],
  audio: ['audio/mpeg', 'audio/mp4'],
  photo: ['image/jpeg', 'image/png', 'image/gif'],
  previewPhoto: ['image/jpeg', 'image/png', 'image/gif'], // Same as photo
};


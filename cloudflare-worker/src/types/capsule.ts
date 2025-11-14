/**
 * Capsule data structures
 */

export interface PhotoAttachment {
  id: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}

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
  previewMessage?: string; // Optional message shown before unlock (max 500 chars)
  additionalMessage?: string; // Additional message for media types (max 1000 chars)
  photos?: PhotoAttachment[]; // Multiple photos (max 5)
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
  previewMessage?: string;
  additionalMessage?: string;
}

export const CONTENT_LIMITS = {
  video: 30 * 1024 * 1024,  // 30MB (Cloudflare Workers free tier CPU limit)
  audio: 30 * 1024 * 1024,  // 30MB
  photo: 30 * 1024 * 1024,  // 30MB
  text: 10000, // 10k characters
  previewMessage: 500, // 500 characters
  additionalMessage: 1000, // 1000 characters
};

export const MAX_PHOTOS = 5; // Maximum number of photos per capsule

export const ALLOWED_MIME_TYPES = {
  video: ['video/mp4', 'video/webm'],
  audio: ['audio/mpeg', 'audio/mp4'],
  photo: ['image/jpeg', 'image/png', 'image/gif'],
};


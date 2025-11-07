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
}

export const CONTENT_LIMITS = {
  video: 100 * 1024 * 1024, // 100MB
  audio: 50 * 1024 * 1024,  // 50MB
  photo: 50 * 1024 * 1024,  // 50MB combined (up to 5 images)
  text: 10000, // 10k characters
};

export const ALLOWED_MIME_TYPES = {
  video: ['video/mp4', 'video/webm'],
  audio: ['audio/mpeg', 'audio/mp4'],
  photo: ['image/jpeg', 'image/png', 'image/gif'],
};


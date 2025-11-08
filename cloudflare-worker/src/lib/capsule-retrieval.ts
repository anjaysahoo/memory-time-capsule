import { Octokit } from '@octokit/rest';
import { createGitHubClient, getFileContent } from './github.js';
import { Capsule } from '../types/capsule.js';

/**
 * Get all capsules from repository
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Array of capsules
 */
export async function getAllCapsules(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<Capsule[]> {
  const fileData = await getFileContent(octokit, owner, repo, 'capsules.json');
  
  if (!fileData) {
    return [];
  }

  try {
    return JSON.parse(fileData.content);
  } catch (error) {
    console.error('Failed to parse capsules.json:', error);
    return [];
  }
}

/**
 * Find capsule by magic token hash
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param tokenHash - SHA-256 hash of magic token
 * @returns Capsule or null if not found
 */
export async function findCapsuleByTokenHash(
  octokit: Octokit,
  owner: string,
  repo: string,
  tokenHash: string
): Promise<Capsule | null> {
  const capsules = await getAllCapsules(octokit, owner, repo);
  return capsules.find(c => c.magicTokenHash === tokenHash) || null;
}

/**
 * Get content proxy URL for capsule content
 * Returns a worker endpoint that will proxy the GitHub content with proper auth
 * 
 * @param workerUrl - Worker base URL
 * @param tokenHash - Hash of the magic token (for secure access)
 * @returns Worker proxy URL for content
 */
export function getContentUrl(
  workerUrl: string,
  tokenHash: string
): string {
  // Return worker proxy URL that will handle GitHub authentication
  return `${workerUrl}/api/capsule/content/${tokenHash}`;
}

/**
 * Sanitize capsule data for public API response
 * Removes sensitive fields before sending to client
 * 
 * @param capsule - Full capsule object
 * @param includePin - Whether to include PIN/hash (only after verification)
 * @returns Sanitized capsule object
 */
export function sanitizeCapsule(
  capsule: Capsule,
  includePin: boolean = false
): Partial<Capsule> {
  const sanitized: Partial<Capsule> = {
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
  };

  // Never include magic token or sender email in API response
  // PIN/pinHash only included after successful verification
  if (includePin && capsule.pin) {
    sanitized.pin = capsule.pin;
  }

  return sanitized;
}


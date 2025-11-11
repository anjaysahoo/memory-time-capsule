import { Octokit } from '@octokit/rest';
import { createGitHubClient, getFileContent } from './github.js';
import { Capsule } from '../types/capsule.js';

/**
 * Convert UTF-8 string to base64 (handles all Unicode characters)
 */
function utf8ToBase64(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  // Convert Uint8Array to regular array then to binary string
  const binary = String.fromCharCode(...bytes);
  return btoa(binary);
}

/**
 * Convert ArrayBuffer to base64 (handles large files)
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192; // Process in chunks to avoid stack overflow
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  
  return btoa(binary);
}

/**
 * Upload file to GitHub LFS (via blob API for files <100MB)
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param filePath - Path in repository
 * @param fileContent - File content as ArrayBuffer
 * @returns File SHA
 */
export async function uploadToGitHubLFS(
  octokit: Octokit,
  owner: string,
  repo: string,
  filePath: string,
  fileContent: ArrayBuffer
): Promise<string> {
  // Convert ArrayBuffer to base64
  const base64Content = arrayBufferToBase64(fileContent);

  // Create blob
  const { data: blob } = await octokit.git.createBlob({
    owner,
    repo,
    content: base64Content,
    encoding: 'base64',
  });

  // Get current commit SHA
  const { data: ref } = await octokit.git.getRef({
    owner,
    repo,
    ref: 'heads/main',
  });

  const commitSha = ref.object.sha;

  // Get current tree
  const { data: commit } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: commitSha,
  });

  // Create new tree with the file
  const { data: newTree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: commit.tree.sha,
    tree: [
      {
        path: filePath,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      },
    ],
  });

  // Create new commit
  const { data: newCommit } = await octokit.git.createCommit({
    owner,
    repo,
    message: `Add capsule file: ${filePath}`,
    tree: newTree.sha,
    parents: [commitSha],
  });

  // Update reference
  await octokit.git.updateRef({
    owner,
    repo,
    ref: 'heads/main',
    sha: newCommit.sha,
  });

  return blob.sha;
}

/**
 * Update capsules.json in repository
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param capsule - New capsule to add
 */
export async function updateCapsulesJson(
  octokit: Octokit,
  owner: string,
  repo: string,
  capsule: Capsule
): Promise<void> {
  // Get current capsules.json
  const fileData = await getFileContent(octokit, owner, repo, 'capsules.json');
  
  if (!fileData) {
    throw new Error('capsules.json not found in repository');
  }

  // Parse current capsules
  const capsules: Capsule[] = JSON.parse(fileData.content);

  // Add new capsule
  capsules.push(capsule);

  // Update file
  const newContent = JSON.stringify(capsules, null, 2);
  const contentBase64 = utf8ToBase64(newContent);

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'capsules.json',
    message: `Add capsule: ${capsule.title}`,
    content: contentBase64,
    sha: fileData.sha,
  });
}

/**
 * Get repository storage usage
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Storage used in bytes
 */
export async function getStorageUsage(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<number> {
  const { data } = await octokit.repos.get({
    owner,
    repo,
  });

  return data.size * 1024; // Size is in KB, convert to bytes
}


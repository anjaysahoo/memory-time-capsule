import { Octokit } from '@octokit/rest';

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  clone_url: string;
}

/**
 * Create authenticated Octokit client
 */
export function createGitHubClient(accessToken: string): Octokit {
  return new Octokit({ auth: accessToken });
}

/**
 * Exchange OAuth code for access token
 * 
 * @param code - OAuth authorization code
 * @param clientId - GitHub OAuth app client ID
 * @param clientSecret - GitHub OAuth app client secret
 * @returns Access token
 */
export async function exchangeCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub OAuth failed: ${response.statusText}`);
  }

  const data = await response.json() as any;

  if (data.error) {
    throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
  }

  return data.access_token;
}

/**
 * Get authenticated user info
 * 
 * @param octokit - Authenticated Octokit client
 * @returns GitHub user info
 */
export async function getAuthenticatedUser(octokit: Octokit): Promise<GitHubUser> {
  const { data } = await octokit.users.getAuthenticated();
  
  return {
    id: data.id,
    login: data.login,
    name: data.name,
    email: data.email,
    avatar_url: data.avatar_url,
  };
}

/**
 * Create private repository with initial files
 * 
 * @param octokit - Authenticated Octokit client
 * @param repoName - Repository name
 * @returns Created repository info
 */
export async function createRepository(
  octokit: Octokit,
  repoName: string
): Promise<GitHubRepo> {
  const { data } = await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    private: true,
    description: 'Memory Time Capsule storage repository',
    auto_init: false,
  });

  return {
    name: data.name,
    full_name: data.full_name,
    private: data.private,
    html_url: data.html_url,
    clone_url: data.clone_url,
  };
}

/**
 * Create or update file in repository
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param path - File path
 * @param content - File content (will be base64 encoded)
 * @param message - Commit message
 * @param sha - File SHA (required for updates)
 */
export async function createOrUpdateFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  const contentBase64 = btoa(content);

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: contentBase64,
    sha,
  });
}

/**
 * Get file content from repository
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param path - File path
 * @returns File content and SHA
 */
export async function getFileContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string
): Promise<{ content: string; sha: string } | null> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if ('content' in data && typeof data.content === 'string') {
      return {
        content: atob(data.content.replace(/\n/g, '')),
        sha: data.sha,
      };
    }

    return null;
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Create repository secret (encrypted environment variable)
 * 
 * @param octokit - Authenticated Octokit client
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param secretName - Secret name
 * @param secretValue - Secret value (will be encrypted)
 */
export async function createRepositorySecret(
  octokit: Octokit,
  owner: string,
  repo: string,
  secretName: string,
  secretValue: string
): Promise<void> {
  // Get public key for encrypting secrets
  const { data: publicKey } = await octokit.actions.getRepoPublicKey({
    owner,
    repo,
  });

  // Encrypt secret using libsodium (via Web Crypto API workaround)
  const encryptedValue = await encryptSecretForGitHub(secretValue, publicKey.key);

  // Create or update secret
  await octokit.actions.createOrUpdateRepoSecret({
    owner,
    repo,
    secret_name: secretName,
    encrypted_value: encryptedValue,
    key_id: publicKey.key_id,
  });
}

/**
 * Encrypt secret value for GitHub Actions
 * Uses sodium's sealed box (requires sodium library or Web Crypto workaround)
 * 
 * For MVP, we'll store a placeholder and add proper encryption later
 */
async function encryptSecretForGitHub(
  secretValue: string,
  publicKey: string
): Promise<string> {
  // TODO: Implement proper libsodium sealed_box encryption
  // For now, return base64 encoded value (will be replaced with proper encryption)
  console.warn('GitHub secret encryption not implemented - using placeholder');
  return btoa(secretValue);
}

/**
 * Generate unique repository name
 * 
 * @param userId - User ID or login
 * @returns Repository name (e.g., "timecapsule-storage-a1b2c3d4")
 */
export function generateRepoName(userId: string): string {
  const randomSuffix = crypto.getRandomValues(new Uint8Array(4))
    .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
  
  return `timecapsule-storage-${randomSuffix}`;
}



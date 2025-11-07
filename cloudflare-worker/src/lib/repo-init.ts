import { Octokit } from '@octokit/rest';
import {
  createGitHubClient,
  createRepository,
  createOrUpdateFile,
  generateRepoName,
  GitHubUser,
  GitHubRepo,
} from './github.js';
import { generateUnlockWorkflow, generateUnlockScript } from './workflow-generator.js';

/**
 * Initial .gitattributes content for LFS
 */
const GITATTRIBUTES_CONTENT = `# Git LFS configuration for time capsule files
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.webm filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.m4a filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
`;

/**
 * Initial capsules.json content
 */
const CAPSULES_JSON_CONTENT = JSON.stringify([], null, 2);

/**
 * Initial README.md content
 */
const README_CONTENT = `# Time Capsule Storage Repository

This is an automatically generated private repository for storing time capsule content.

**Do not delete or modify files manually** - they are managed by the Time Capsule application.

## Structure

- \`capsules.json\` - Metadata for all time capsules
- \`capsules/\` - Directory containing capsule content files (tracked by Git LFS)
- \`.github/workflows/unlock-cron.yml\` - Automated unlock workflow

## Storage

This repository uses Git LFS (Large File Storage) to store media files efficiently.
The free tier provides 1GB of storage.
`;


/**
 * Initialize repository with all required files and configuration
 * 
 * @param accessToken - GitHub OAuth access token
 * @param user - GitHub user info
 * @param gmailClientId - Gmail OAuth client ID (app-level credential)
 * @param gmailClientSecret - Gmail OAuth client secret (app-level credential)
 * @returns Created repository info
 */
export async function initializeRepository(
  accessToken: string,
  user: GitHubUser,
  gmailClientId: string,
  gmailClientSecret: string
): Promise<GitHubRepo> {
  const octokit = createGitHubClient(accessToken);
  
  // Generate unique repo name
  const repoName = generateRepoName(user.login);
  
  // Create repository
  const repo = await createRepository(octokit, repoName);
  
  // Wait a bit for repo to be fully ready
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate workflow and unlock script with Gmail credentials
  const workflow = generateUnlockWorkflow(gmailClientId, gmailClientSecret);
  const unlockScript = generateUnlockScript();
  
  // Create initial files (in sequence to avoid conflicts)
  await createOrUpdateFile(
    octokit,
    user.login,
    repo.name,
    '.gitattributes',
    GITATTRIBUTES_CONTENT,
    'Initialize Git LFS configuration'
  );
  
  await createOrUpdateFile(
    octokit,
    user.login,
    repo.name,
    'README.md',
    README_CONTENT,
    'Add repository README'
  );
  
  await createOrUpdateFile(
    octokit,
    user.login,
    repo.name,
    'capsules.json',
    CAPSULES_JSON_CONTENT,
    'Initialize capsules metadata'
  );
  
  await createOrUpdateFile(
    octokit,
    user.login,
    repo.name,
    '.github/workflows/unlock-cron.yml',
    workflow,
    'Add unlock cron workflow'
  );
  
  await createOrUpdateFile(
    octokit,
    user.login,
    repo.name,
    'unlock-script.js',
    unlockScript,
    'Add unlock script'
  );
  
  return repo;
}



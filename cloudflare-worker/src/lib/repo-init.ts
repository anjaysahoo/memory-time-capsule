import { Octokit } from '@octokit/rest';
import {
  createGitHubClient,
  createRepository,
  createOrUpdateFile,
  generateRepoName,
  GitHubUser,
  GitHubRepo,
} from './github.js';

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
 * GitHub Actions workflow template (will be enhanced in Phase 5)
 */
const WORKFLOW_TEMPLATE = `name: Unlock Time Capsules

on:
  schedule:
    # Run every hour at minute 0
    - cron: '0 * * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  unlock:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          lfs: true

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Run unlock script
        run: node unlock-script.js
        env:
          GMAIL_CLIENT_ID: \${{ secrets.GMAIL_CLIENT_ID }}
          GMAIL_CLIENT_SECRET: \${{ secrets.GMAIL_CLIENT_SECRET }}
          GMAIL_REFRESH_TOKEN: \${{ secrets.GMAIL_REFRESH_TOKEN }}

      - name: Commit changes
        run: |
          git config user.name "Time Capsule Bot"
          git config user.email "bot@timecapsule.app"
          git add capsules.json
          git diff --quiet && git diff --staged --quiet || git commit -m "Update capsule unlock status"
          git push
`;

/**
 * Placeholder unlock script (will be enhanced in Phase 5)
 */
const UNLOCK_SCRIPT_PLACEHOLDER = `// Placeholder unlock script
// This will be replaced with full unlock logic in Phase 5
console.log('Unlock script placeholder - will be implemented in Phase 5');
`;

/**
 * Initialize repository with all required files and configuration
 * 
 * @param accessToken - GitHub OAuth access token
 * @param user - GitHub user info
 * @returns Created repository info
 */
export async function initializeRepository(
  accessToken: string,
  user: GitHubUser
): Promise<GitHubRepo> {
  const octokit = createGitHubClient(accessToken);
  
  // Generate unique repo name
  const repoName = generateRepoName(user.login);
  
  // Create repository
  const repo = await createRepository(octokit, repoName);
  
  // Wait a bit for repo to be fully ready
  await new Promise(resolve => setTimeout(resolve, 1000));
  
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
    WORKFLOW_TEMPLATE,
    'Add unlock cron workflow'
  );
  
  await createOrUpdateFile(
    octokit,
    user.login,
    repo.name,
    'unlock-script.js',
    UNLOCK_SCRIPT_PLACEHOLDER,
    'Add unlock script placeholder'
  );
  
  return repo;
}



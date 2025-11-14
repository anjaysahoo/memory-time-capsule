// Backend UserSession structure
export interface BackendUserSession {
  userId: string;
  githubUser: {
    id: number;
    login: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
  };
  repository: {
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
    clone_url: string;
  };
  githubConnected: boolean;
  gmailConnected: boolean;
  gmailEmail?: string;
  createdAt: string;
}

// Frontend UserSession structure (flattened for easier use)
export interface UserSession {
  userId: string;
  githubLogin: string;
  githubName: string | null;
  githubEmail: string | null;
  githubAvatar: string;
  repoName: string;
  repoFullName: string;
  repoUrl: string;
  githubConnected: boolean;
  gmailConnected: boolean;
  createdAt: string;
}

// Adapter function to convert backend session to frontend session
export function adaptUserSession(backendSession: BackendUserSession): UserSession {
  return {
    userId: backendSession.userId,
    githubLogin: backendSession.githubUser.login,
    githubName: backendSession.githubUser.name,
    githubEmail: backendSession.githubUser.email,
    githubAvatar: backendSession.githubUser.avatar_url,
    repoName: backendSession.repository.name,
    repoFullName: backendSession.repository.full_name,
    repoUrl: backendSession.repository.html_url,
    githubConnected: backendSession.githubConnected,
    gmailConnected: backendSession.gmailConnected,
    createdAt: backendSession.createdAt,
  };
}

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
  contentType: 'video' | 'audio' | 'photo' | 'text';
  fileSize?: number;
  previewMessage?: string;
  additionalMessage?: string;
  photos?: PhotoAttachment[];
  createdAt: number;
  unlockEmailSent: boolean;
  unlockedAt?: number;
  viewedAt?: number;
}

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
}

export interface PinVerificationResponse {
  success: boolean;
  capsule: Capsule & {
    textContent?: string;
  };
  contentUrl: string | null;
  photoUrls?: string[];
}

export interface DashboardData {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string;
  };
  storage: {
    used: number;
    limit: number;
    percentage: number;
  };
  capsules: {
    total: number;
    pending: number;
    unlocked: number;
    failed: number;
  };
  capsuleList: Capsule[];
  repository: {
    name: string;
    url: string;
  };
}

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


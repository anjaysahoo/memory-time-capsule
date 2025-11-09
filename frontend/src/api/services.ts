import { apiClient } from './client';
import type {
  BackendUserSession,
  UserSession,
  CapsuleViewResponse,
  PinVerificationResponse,
  DashboardData,
  adaptUserSession,
} from './types';
import { adaptUserSession as adapt } from './types';

export const authService = {
  getGitHubAuthUrl: async () => {
    const { data } = await apiClient.get('/api/auth/github/authorize');
    return data.authUrl as string;
  },

  getGmailAuthUrl: async (userId: string) => {
    const { data } = await apiClient.get('/api/auth/gmail/authorize', {
      params: { userId },
    });
    return data.authUrl as string;
  },

  getSession: async (userId: string): Promise<UserSession> => {
    const { data } = await apiClient.get(`/api/auth/session/${userId}`);
    // Adapt backend session structure to frontend structure
    return adapt(data as BackendUserSession);
  },
};

export const capsuleService = {
  create: async (formData: FormData) => {
    const { data } = await apiClient.post('/api/capsule/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  view: async (token: string) => {
    const { data } = await apiClient.get(`/api/capsule/view/${token}`);
    return data as CapsuleViewResponse;
  },

  verifyPin: async (token: string, pin: string) => {
    const { data } = await apiClient.post(`/api/capsule/view/${token}/verify-pin`, {
      pin,
    });
    return data as PinVerificationResponse;
  },

  getDashboard: async (userId: string) => {
    const { data } = await apiClient.get(`/api/capsule/dashboard/${userId}`);
    return data as DashboardData;
  },
};

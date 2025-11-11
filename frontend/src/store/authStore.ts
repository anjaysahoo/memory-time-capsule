import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSession } from '@/api/types';

interface AuthState {
  userId: string | null;
  session: UserSession | null;
  setUserId: (userId: string) => void;
  setSession: (session: UserSession) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: null,
      session: null,

      setUserId: (userId) => set({ userId }),

      setSession: (session) => set({ session, userId: session.userId }),

      clearAuth: () => set({ userId: null, session: null }),

      isAuthenticated: () => {
        const state = get();
        return !!(state.session?.githubConnected && state.session?.gmailConnected);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);


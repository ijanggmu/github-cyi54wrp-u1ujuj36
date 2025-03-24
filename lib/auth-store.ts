import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  email: string;
  name: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'es' | 'fr';
    notifications: boolean;
  };
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Static credentials for demo
const VALID_CREDENTIALS = {
  admin: { username: 'admin', password: 'admin123', role: 'admin' as const },
  manager: { username: 'manager', password: 'manager123', role: 'manager' as const },
  user: { username: 'user', password: 'user123', role: 'user' as const },
};

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const validUser = Object.values(VALID_CREDENTIALS).find(
          (cred) => cred.username === username && cred.password === password
        );

        if (!validUser) {
          throw new Error('Invalid credentials');
        }

        const user: User = {
          id: crypto.randomUUID(),
          username: validUser.username,
          role: validUser.role,
          email: `${validUser.username}@example.com`,
          name: validUser.username.charAt(0).toUpperCase() + validUser.username.slice(1),
          preferences: {
            theme: 'system',
            language: 'en',
            notifications: true,
          },
        };

        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
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
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => boolean;
}

// Mock API response type
interface MockApiResponse {
  success: boolean;
  data?: User;
  error?: string;
}

// Mock API function
const mockApi = {
  login: async (username: string, password: string): Promise<MockApiResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (username === 'admin' && password === 'admin123') {
      return {
        success: true,
        data: {
          id: '1',
          username: 'admin',
          role: 'admin',
          email: 'admin@example.com',
          name: 'Admin User',
          preferences: {
            theme: 'system',
            language: 'en',
            notifications: true,
          },
        },
      };
    }

    if (username === 'manager' && password === 'manager123') {
      return {
        success: true,
        data: {
          id: '2',
          username: 'manager',
          role: 'manager',
          email: 'manager@example.com',
          name: 'Manager User',
          preferences: {
            theme: 'system',
            language: 'en',
            notifications: true,
          },
        },
      };
    }

    if (username === 'user' && password === 'user123') {
      return {
        success: true,
        data: {
          id: '3',
          username: 'user',
          role: 'user',
          email: 'user@example.com',
          name: 'Regular User',
          preferences: {
            theme: 'system',
            language: 'en',
            notifications: true,
          },
        },
      };
    }

    return {
      success: false,
      error: 'Invalid credentials',
    };
  },
};

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        try {
          const response = await mockApi.login(username, password);
          
          if (response.success && response.data) {
            set({ user: response.data, isAuthenticated: true });
            return true;
          } else {
            throw new Error(response.error || 'Login failed');
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          throw error;
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
      checkAuth: () => {
        return get().isAuthenticated;
      },
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
);
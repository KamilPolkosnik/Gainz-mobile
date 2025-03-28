import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({
      isAuthenticated: true,
      user: {
        id: '1',
        name: 'John Doe',
        email,
      },
    });
  },
  register: async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({
      isAuthenticated: true,
      user: {
        id: '1',
        name,
        email,
      },
    });
  },
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
    });
  },
}));
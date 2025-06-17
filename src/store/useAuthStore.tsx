// Global state management
import { create } from 'zustand';

// Controllers
import { login, logout, getUser } from '@/services/auth/auth.service';

interface AuthState {
    // deno-lint-ignore no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
    user: null,
    isAuthenticated: false,

    login: async (email, password) => {
        const user = await login(email, password);
        set({ user, isAuthenticated: !!user });
    },

    logout: async () => {
        await logout();
        set({ user: null, isAuthenticated: false });
    },

    fetchUser: async () => {
        const user = await getUser();
        set({ user, isAuthenticated: !!user });
    },
}));

import { create } from 'zustand';
import api from '../api/axios';

interface AuthState {
    token: string | null;
    user: any | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, password: string) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('token'),
    user: null,
    isAuthenticated: !!localStorage.getItem('token'),

    login: async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/token/', { username: email, password });
            const { access, refresh } = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('user', JSON.stringify({ access, refresh }));
            set({ token: access, user: null, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null, isAuthenticated: false });
    },

    register: async (username: string, email: string, password: string) => {
        try {
            const response = await api.post('/auth/register/', {
                username,
                email,
                password,
            });

            // The register endpoint returns tokens in a nested structure
            if (response.data.tokens && response.data.tokens.access) {
                const { access, refresh } = response.data.tokens;
                localStorage.setItem('token', access);
                localStorage.setItem('user', JSON.stringify({ access, refresh }));
                set({ token: access, user: response.data.user, isAuthenticated: true });
            }
        } catch (error) {
            throw error;
        }
    },
}));

export default useAuthStore;

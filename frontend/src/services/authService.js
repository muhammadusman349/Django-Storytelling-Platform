import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

class AuthService {
    async login(username, password) {
        try {
            // If an object is passed instead of separate parameters
            if (typeof username === 'object') {
                const formData = username;
                username = formData.username;
                password = formData.password;
            }

            const response = await axios.post(`${API_URL}/auth/token/`, {
                username,
                password
            });

            if (response.data.access) {
                const userData = {
                    access: response.data.access,
                    refresh: response.data.refresh
                };
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', response.data.access); // For compatibility with other components
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Login failed' };
        }
    }

    async register(formData) {
        try {
            const response = await axios.post(`${API_URL}/auth/register/`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            if (response.data.tokens.access) {
                localStorage.setItem('user', JSON.stringify({
                    user: response.data.user,
                    access: response.data.tokens.access,
                    refresh: response.data.tokens.refresh
                }));
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.tokens.access}`;
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Registration failed' };
        }
    }

    async refreshToken() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.refresh) {
                const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                    refresh: user.refresh
                });
                if (response.data.access) {
                    localStorage.setItem('user', JSON.stringify({
                        ...user,
                        access: response.data.access
                    }));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                }
                return response.data;
            }
            return null;
        } catch (error) {
            this.logout();
            throw error.response?.data || { detail: 'Token refresh failed' };
        }
    }

    logout() {
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    }

    isAuthenticated() {
        const user = localStorage.getItem('user');
        return !!user;
    }

    async getCurrentUser() {
        try {
            const response = await axios.get(`${API_URL}/auth/user/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to fetch user data' };
        }
    }

    async getUserByUsername(username) {
        try {
            const response = await axios.get(`${API_URL}/profile/${username}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to fetch user data' };
        }
    }

    getStoredUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    async followUser(username) {
        try {
            const response = await axios.post(`${API_URL}/follow/${username}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to follow user' };
        }
    }

    async unfollowUser(username) {
        try {
            const response = await axios.post(`${API_URL}/unfollow/${username}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Failed to unfollow user' };
        }
    }

    setupAxiosInterceptors() {
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        await this.refreshToken();
                        return axios(originalRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    }
}

const authService = new AuthService();
authService.setupAxiosInterceptors();

export { authService };

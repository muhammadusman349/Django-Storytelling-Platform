import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    // Try to get token from user object first (preferred method)
    let token = null;
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const userData = JSON.parse(userStr);
            token = userData.access;
        } catch (e) {
            console.error('Error parsing user data from localStorage', e);
        }
    }

    // Fallback to token if user object doesn't exist
    if (!token) {
        token = localStorage.getItem('token');
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

import axios from 'axios';

// Create axios instance with base URL
const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    // Dynamic fallback: use current hostname (localhost or network IP) with port 3000
    return `http://${window.location.hostname}:3000/api`;
};

const instance = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true
});

// Add a request interceptor to add the auth token to every request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized (expired or invalid token)
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized! Redirecting to login...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;

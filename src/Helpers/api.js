// src/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY, // Set your base URL here
    timeout: 10000, // Optional: Set a timeout for requests
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response.data; // Return only the data part of the response
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Handle unauthorized access
                console.log('Unauthorized, redirecting to login...');
                window.sessionStorage.removeItem("user");
                window.location.href = '/';
            }
            console.error('API Error:', error.response.data);
            return error.response.data;
        }
        return Promise.reject(error);
    }
);

export default api;

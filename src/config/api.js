const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://server.nybff.us/api';

export const API_ENDPOINTS = {
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
        logout: `${API_BASE_URL}/auth/logout`,
        forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
        resetPassword: `${API_BASE_URL}/auth/reset-password`,
    }
};
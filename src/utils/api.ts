import axios from 'axios';
import { getToken } from './storage.js';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const requestOTP = async (email: string) => {
    return api.post('/auth/request-otp', { email });
};

export const verifyOTP = async (email: string, otp: string) => {
    return api.post('/auth/verify-otp', { email, otp });
};

export const fetchInternships = async () => {
    return api.get('/internship/my-internships');
};

export const fetchPrograms = async () => {
    return api.get('/programs/my-programs');
};

export const fetchEvents = async () => {
    return api.get('/events/my-events');
};

export const fetchProfile = async () => {
    return api.get('/profile/me');
};

export const fetchRoles = async () => {
    return api.get('/profile/roles');
};

export const fetchSupervisedStudents = async () => {
    return api.get('/profile/supervised-students');
};

export const logout = async () => {
    return api.post('/auth/logout');
};

export default api;

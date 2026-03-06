import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🌐 Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    // Detailed error logging
    console.group('❌ API Error Details');
    console.log('Message:', error.message);
    console.log('Code:', error.code);
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Data:', error.response?.data);
    console.log('Headers:', error.response?.headers);
    console.log('Config:', {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      timeout: error.config?.timeout
    });
    console.groupEnd();

    // Network error - backend not reachable
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout - server is taking too long to respond');
      } else if (error.message.includes('Network Error')) {
        toast.error('Cannot connect to server. Is the backend running?');
      } else {
        toast.error(`Network error: ${error.message}`);
      }
      return Promise.reject(error);
    }

    // Handle specific HTTP errors
    const status = error.response.status;
    const errorData = error.response.data;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (status === 404) {
      toast.error('Resource not found');
    } else if (status === 422) {
      toast.error('Validation error: ' + (errorData.error || 'Invalid data'));
    } else if (status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (errorData && errorData.error) {
      toast.error(errorData.error);
    } else {
      toast.error(`Error ${status}: ${errorData.message || 'An error occurred'}`);
    }

    return Promise.reject(error);
  }
);

export default api;
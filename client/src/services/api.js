import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({ baseURL: API_BASE });

// Attach auth token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses — clear stale token
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Products
export const getProducts = (params) => api.get('/products', { params }).then(r => r.data);
export const getProduct = (id) => api.get(`/products/${id}`).then(r => r.data);
export const getCategories = () => api.get('/categories').then(r => r.data);

// Auth
export const register = (data) => api.post('/auth/register', data).then(r => r.data);
export const login = (data) => api.post('/auth/login', data).then(r => r.data);

// Site
export const getPricing = () => api.get('/pricing').then(r => r.data);
export const getDesigners = () => api.get('/designers').then(r => r.data);
export const getTestimonials = () => api.get('/testimonials').then(r => r.data);
export const getStats = () => api.get('/stats').then(r => r.data);

// Orders
export const createOrder = (data) => api.post('/orders', data).then(r => r.data);

// Auth helpers
export const saveAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export const isLoggedIn = () => !!localStorage.getItem('token');

export default api;

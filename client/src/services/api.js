import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({ baseURL: API_BASE });

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

export default api;

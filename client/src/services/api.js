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

// Profile
export const getProfile = () => api.get('/profile').then(r => r.data);
export const updateProfile = (data) => api.put('/profile', data).then(r => r.data);

// Site
export const getPricing = () => api.get('/pricing').then(r => r.data);
export const getDesigners = () => api.get('/designers').then(r => r.data);
export const getTestimonials = () => api.get('/testimonials').then(r => r.data);
export const getStats = () => api.get('/stats').then(r => r.data);

// Orders
export const createOrder = (data) => api.post('/orders', data).then(r => r.data);
export const getOrders = (params) => api.get('/orders', { params }).then(r => r.data);
export const getOrderById = (id) => api.get(`/orders/${id}`).then(r => r.data);

// Reviews
export const getReviews = (productId) => api.get('/reviews', { params: { productId } }).then(r => r.data);
export const createReview = (data) => api.post('/reviews', data).then(r => r.data);

// Wishlist
export const getWishlist = () => api.get('/wishlist').then(r => r.data);
export const addToWishlist = (productId) => api.post('/wishlist', { productId }).then(r => r.data);
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`).then(r => r.data);

// Designer Applications
export const createDesignerApplication = (data) => api.post('/designer-applications', data).then(r => r.data);

// Admin
export const adminGetStats = () => api.get('/admin/stats').then(r => r.data);
export const adminGetOrders = (params) => api.get('/admin/orders', { params }).then(r => r.data);
export const adminUpdateOrder = (id, data) => api.put(`/admin/orders/${id}`, data).then(r => r.data);
export const adminGetApplications = (params) => api.get('/admin/designer-applications', { params }).then(r => r.data);
export const adminUpdateApplication = (id, data) => api.put(`/admin/designer-applications/${id}`, data).then(r => r.data);
export const adminGetProducts = (params) => api.get('/admin/products', { params }).then(r => r.data);
export const adminCreateProduct = (data) => api.post('/admin/products', data).then(r => r.data);
export const adminUpdateProduct = (id, data) => api.put(`/admin/products/${id}`, data).then(r => r.data);
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`).then(r => r.data);

// Designer
export const designerGetProducts = () => api.get('/designer/products').then(r => r.data);
export const designerGetStats = () => api.get('/designer/stats').then(r => r.data);
export const designerCreateProduct = (data) => api.post('/designer/products', data).then(r => r.data);
export const designerUpdateProduct = (id, data) => api.put(`/designer/products/${id}`, data).then(r => r.data);
export const designerDeleteProduct = (id) => api.delete(`/designer/products/${id}`).then(r => r.data);
export const designerGetOrders = (params) => api.get('/designer/orders', { params }).then(r => r.data);
export const designerGetAnalytics = () => api.get('/designer/analytics').then(r => r.data);
export const designerUpdateProfile = (data) => api.put('/designer/profile', data).then(r => r.data);

// Public designer profile
export const getDesignerProfile = (id) => api.get(`/designers/${id}`).then(r => r.data);

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

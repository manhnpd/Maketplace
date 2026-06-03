import api from './api';

export const getProducts = (params) => api.get('/products', { params }).then(r => r.data);
export const getProduct = (id) => api.get(`/products/${id}`).then(r => r.data);
export const getCategories = () => api.get('/categories').then(r => r.data);

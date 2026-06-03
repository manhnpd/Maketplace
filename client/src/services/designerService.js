import api from './api';

export const designerGetProducts = () => api.get('/designer/products').then(r => r.data);
export const designerGetStats = () => api.get('/designer/stats').then(r => r.data);
export const designerCreateProduct = (data) => api.post('/designer/products', data).then(r => r.data);
export const designerUpdateProduct = (id, data) => api.put(`/designer/products/${id}`, data).then(r => r.data);
export const designerDeleteProduct = (id) => api.delete(`/designer/products/${id}`).then(r => r.data);
export const designerGetOrders = (params) => api.get('/designer/orders', { params }).then(r => r.data);
export const designerGetAnalytics = () => api.get('/designer/analytics').then(r => r.data);
export const designerUpdateProfile = (data) => api.put('/designer/profile', data).then(r => r.data);

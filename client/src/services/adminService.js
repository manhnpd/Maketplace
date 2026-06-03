import api from './api';

export const adminGetStats = () => api.get('/admin/stats').then(r => r.data);
export const adminGetOrders = (params) => api.get('/admin/orders', { params }).then(r => r.data);
export const adminUpdateOrder = (id, data) => api.put(`/admin/orders/${id}`, data).then(r => r.data);
export const adminGetApplications = (params) => api.get('/admin/designer-applications', { params }).then(r => r.data);
export const adminUpdateApplication = (id, data) => api.put(`/admin/designer-applications/${id}`, data).then(r => r.data);
export const adminGetProducts = (params) => api.get('/admin/products', { params }).then(r => r.data);
export const adminCreateProduct = (data) => api.post('/admin/products', data).then(r => r.data);
export const adminUpdateProduct = (id, data) => api.put(`/admin/products/${id}`, data).then(r => r.data);
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`).then(r => r.data);

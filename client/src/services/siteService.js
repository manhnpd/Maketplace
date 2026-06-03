import api from './api';

export const getPricing = () => api.get('/pricing').then(r => r.data);
export const getDesigners = () => api.get('/designers').then(r => r.data);
export const getTestimonials = () => api.get('/testimonials').then(r => r.data);
export const getStats = () => api.get('/stats').then(r => r.data);
export const getDesignerProfile = (id) => api.get(`/designers/${id}`).then(r => r.data);

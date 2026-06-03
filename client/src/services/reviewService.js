import api from './api';

export const getReviews = (productId) => api.get('/reviews', { params: { productId } }).then(r => r.data);
export const createReview = (data) => api.post('/reviews', data).then(r => r.data);

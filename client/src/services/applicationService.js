import api from './api';

export const createDesignerApplication = (data) => api.post('/designer-applications', data).then(r => r.data);

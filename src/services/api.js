import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api', headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('aibos_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) { localStorage.removeItem('aibos_token'); localStorage.removeItem('aibos_user'); window.location.href = '/login'; }
  return Promise.reject(err);
});

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const signup = (email, password, name) => api.post('/auth/signup', { email, password, name });
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);

// Dashboard
export const getDashboard = () => api.get('/dashboard/summary');

// Chat
export const sendChat = (message, history, mode) => api.post('/chat', { message, history, mode });

// Generator
export const getCategories = () => api.get('/generator/categories');
export const generateBusiness = (idea, category) => api.post('/generator/generate', { idea, category });

// Market Research
export const getTrending = () => api.get('/market/trending');
export const doResearch = (niche) => api.post('/market/research', { niche });

// Marketing
export const generateMarketing = (business, platform) => api.post('/marketing/generate', { business, platform });

// Store
export const getStoreTemplates = () => api.get('/store/templates');

// Vault
export const getVault = (type, page) => api.get('/vault', { params: { type, page } });
export const deleteVaultItem = (id) => api.delete(`/vault/${id}`);

// Tools
export const getTools = () => api.get('/tools/list');
export const runTool = (toolId, input) => api.post('/tools/run', { toolId, input });

// Billing
export const getPlans = () => api.get('/billing/plans');
export const upgradePlan = (plan) => api.post('/billing/upgrade', { plan });

// Admin
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = () => api.get('/admin/users');
export const adjustCredits = (userId, amount) => api.post(`/admin/credits/${userId}`, { amount });

export default api;

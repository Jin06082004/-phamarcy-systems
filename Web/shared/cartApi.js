import { apiCall } from './api.js';

export const cartAPI = {
  add: (payload) => apiCall('/carts/add', 'POST', payload),
  get: (key) => apiCall(`/carts/${key}`, 'GET'),
  updateItem: (id, payload) => apiCall(`/carts/${id}/item`, 'PUT', payload),
  removeItem: (id, payload) => apiCall(`/carts/${id}/item`, 'DELETE', payload),
  clear: (id) => apiCall(`/carts/clear/${id}`, 'DELETE'),
  merge: (payload) => apiCall(`/carts/merge`, 'POST', payload),
};

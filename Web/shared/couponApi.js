import { apiCall } from './api.js';

export const couponAPI = {
  redeem: (payload) => apiCall('/coupons/redeem', 'POST', payload),
};

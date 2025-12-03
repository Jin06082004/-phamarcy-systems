import { apiCall } from './api.js';

export const couponAPI = {
  getActivePromotions: () => apiCall('/coupons/active-promotions', 'GET'),
  redeem: (payload) => apiCall('/coupons/redeem', 'POST', payload),
};

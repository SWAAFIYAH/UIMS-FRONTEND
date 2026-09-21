import { apiClient } from '../api/client';

export const authRepository = {
  async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post('/api/auth/login/', credentials);
    return response.data; // Expected to return user data and token
  },

  async logout() {
    const response = await apiClient.post('api/auth/logout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('api/auth/me');
    return response.data;
  },
};
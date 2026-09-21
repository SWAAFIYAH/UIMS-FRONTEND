import AsyncStorage from '@react-native-async-storage/async-storage';
import { authRepository } from '../repositories/authRepository';

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const data = await authRepository.login(credentials);
    if (data.token) {
      await AsyncStorage.setItem('user_token', data.token);
    }
    return data;
  },

  async logout() {
    try {
      await authRepository.logout();
    } finally {
      await AsyncStorage.removeItem('user_token');
    }
  },

  async getToken() {
    return await AsyncStorage.getItem('user_token');
  },
};
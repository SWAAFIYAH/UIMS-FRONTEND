// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token on startup & fetch current user profile
  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          setUserToken(storedToken);
          await fetchUserProfile();
        }
      } catch (e) {
        console.error('Failed to load stored token:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredToken();
  }, []);

  // 1. LOGIN
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login/', { email, password });
      const { access } = response.data;

      await SecureStore.setItemAsync('userToken', access);
      setUserToken(access);
      await fetchUserProfile();
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.' 
      };
    }
  };

  // 2. REGISTER STUDENT
  const registerStudent = async (studentData) => {
    try {
      const response = await api.post('/auth/register/student/', studentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Student registration failed.' 
      };
    }
  };

  // 3. REGISTER ORGANIZATION
  const registerOrg = async (orgData) => {
    try {
      const response = await api.post('/auth/register/org/', orgData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Organization registration failed.' 
      };
    }
  };

  // 4. RESEND VERIFICATION EMAIL
  const resendVerificationEmail = async (email) => {
    try {
      const response = await api.post('/auth/resend-verification/', { email });
      return { success: true, message: response.data?.detail || 'Verification email resent.' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Could not resend verification email.' 
      };
    }
  };

  // 5. GET CURRENT USER PROFILE
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/me/');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  // 6. CHECK INVITE LINK
  const checkInvite = async (token) => {
    try {
      const response = await api.get(`/auth/invite/check/?token=${token}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Invalid or expired invite link.' };
    }
  };

  // 7. ACCEPT INVITE
  const acceptInvite = async (inviteData) => {
    try {
      const response = await api.post('/auth/invite/accept/', inviteData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Failed to accept invitation.' };
    }
  };

  // 8. LOGOUT
  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/logout/');
    } catch (e) {
      // Proceed with client-side cleanup regardless
    }
    await SecureStore.deleteItemAsync('userToken');
    setUserToken(null);
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      userToken,
      user,
      isLoading,
      login,
      registerStudent,
      registerOrg,
      resendVerificationEmail,
      checkInvite,
      acceptInvite,
      logout,
      fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
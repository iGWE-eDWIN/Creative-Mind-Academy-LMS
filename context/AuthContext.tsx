import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  userToken: string | null;
  userRole: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        setUserToken(token);
        setUser(JSON.parse(userData));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      await SecureStore.setItemAsync('accessToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      setUserToken(token);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signUp = async (userData: SignUpData) => {
    try {
      await api.post('/auth/register', userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await AsyncStorage.removeItem('userData');
      setUserToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await api.put('/users/profile', data);
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      await api.post('/auth/verify-email', { token });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Email verification failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        userRole: user?.role || null,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        resetPassword,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
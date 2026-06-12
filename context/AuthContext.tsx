// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as SecureStore from 'expo-secure-store';
// import React, { createContext, ReactNode, useEffect, useState } from 'react';
// import api from '../services/api';

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: 'student' | 'instructor' | 'admin';
//   profilePicture?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   userToken: string | null;
//   userRole: string | null;
//   isLoading: boolean;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (userData: SignUpData) => Promise<void>;
//   signOut: () => Promise<void>;
//   updateProfile: (data: Partial<User>) => Promise<void>;
//   resetPassword: (email: string) => Promise<void>;
//   verifyEmail: (token: string) => Promise<void>;
// }

// interface SignUpData {
//   name: string;
//   email: string;
//   password: string;
//   role: 'student' | 'instructor';
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userToken, setUserToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadStoredData();
//   }, []);

//   const loadStoredData = async () => {
//     try {
//       const token = await SecureStore.getItemAsync('accessToken');
//       const userData = await AsyncStorage.getItem('userData');
      
//       if (token && userData) {
//         setUserToken(token);
//         setUser(JSON.parse(userData));
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       }
//     } catch (error) {
//       console.error('Error loading auth data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signIn = async (email: string, password: string) => {
//     try {
//       const response = await api.post('/login', { email, password });
      
//       // Debug log to see what's coming from backend
//       console.log('Login response:', response.data);
      
//       // ✅ FIXED: Use accessToken instead of token
//       const { accessToken, refreshToken, user: userData } = response.data;
      
//       // Store both tokens
//       await SecureStore.setItemAsync('accessToken', accessToken);
//       await SecureStore.setItemAsync('refreshToken', refreshToken);
//       await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
//       setUserToken(accessToken);
//       setUser(userData);
//       api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//     } catch (error: any) {
//       console.error('Login error:', error.response?.data || error.message);
//       throw new Error(error.response?.data?.message || 'Login failed');
//     }
//   };

//   const signUp = async (userData: SignUpData) => {
//     try {
//       const response = await api.post('/register', userData);
//       console.log('Registration response:', response.data);
//     } catch (error: any) {
//       console.error('Registration error:', error.response?.data || error.message);
//       throw new Error(error.response?.data?.message || 'Registration failed');
//     }
//   };

//   const signOut = async () => {
//     try {
//       // Clear both tokens
//       await SecureStore.deleteItemAsync('accessToken');
//       await SecureStore.deleteItemAsync('refreshToken');
//       await AsyncStorage.removeItem('userData');
//       setUserToken(null);
//       setUser(null);
//       delete api.defaults.headers.common['Authorization'];
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const updateProfile = async (data: Partial<User>) => {
//     try {
//       const response = await api.put('/users/profile', data);
//       const updatedUser = { ...user, ...response.data };
//       setUser(updatedUser);
//       await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
//     } catch (error: any) {
//       throw new Error(error.response?.data?.message || 'Profile update failed');
//     }
//   };

//   const resetPassword = async (email: string) => {
//     try {
//       await api.post('/forgot-password', { email });
//     } catch (error: any) {
//       throw new Error(error.response?.data?.message || 'Password reset failed');
//     }
//   };

//   const verifyEmail = async (token: string) => {
//     try {
//       await api.post('/verify-email', { token });
//     } catch (error: any) {
//       throw new Error(error.response?.data?.message || 'Email verification failed');
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         userToken,
//         userRole: user?.role || null,
//         isLoading,
//         signIn,
//         signUp,
//         signOut,
//         updateProfile,
//         resetPassword,
//         verifyEmail,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;



import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useEffect, useState } from 'react';
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
  signIn: (email: string, password: string, onSuccess?: () => void) => Promise<void>;
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
      
      console.log('Loading stored data:', { hasToken: !!token, hasUserData: !!userData });
      
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

  const signIn = async (email: string, password: string, onSuccess?: () => void) => {
    try {
      const response = await api.post('/login', { email, password });
      
      console.log('Login response:', response.data);
      
      const { accessToken, refreshToken, user: userData } = response.data;
      
      // Store both tokens
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      // Update state
      setUserToken(accessToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      console.log('Login successful, user role:', userData.role);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signUp = async (userData: SignUpData) => {
    try {
      const response = await api.post('/register', userData);
      console.log('Registration response:', response.data);
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const signOut = async () => {
    try {
      // Clear both tokens
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await AsyncStorage.removeItem('userData');
      setUserToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      
      console.log('Sign out successful');
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
      await api.post('/forgot-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      await api.post('/verify-email', { token });
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
// import axios from 'axios';
// import Constants from 'expo-constants';
// import * as SecureStore from 'expo-secure-store';

// const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://192.168.18.12:5000/api';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000, // 10 second timeout
// });

// // Request interceptor to add token
// api.interceptors.request.use(
//   async (config: any) => {
//     const token = await SecureStore.getItemAsync('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     // Debug log
//     console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    
//     return config;
//   },
//   (error) => {
//     console.error('Request interceptor error:', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for token refresh
// api.interceptors.response.use(
//   (response) => {
//     // Debug log for successful responses
//     console.log(`Response from ${response.config.url}:`, response.status);
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
    
//     // Debug log for errors
//     console.error(`Error response from ${originalRequest?.url}:`, error.response?.status, error.response?.data);
    
//     // Check if it's a 401 error and we haven't retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         // Get the refresh token from secure storage
//         const refreshToken = await SecureStore.getItemAsync('refreshToken');
        
//         if (!refreshToken) {
//           throw new Error('No refresh token available');
//         }
        
//         console.log('Attempting to refresh token...');
        
//         // Call refresh endpoint - backend expects { token: refreshToken }
//         const response = await axios.post(`${API_URL}/refresh`, {
//           token: refreshToken,
//         });
        
//         // Backend returns { accessToken, refreshToken }
//         const { accessToken, refreshToken: newRefreshToken } = response.data;
        
//         if (!accessToken) {
//           throw new Error('No access token in refresh response');
//         }
        
//         // Store the new tokens
//         await SecureStore.setItemAsync('accessToken', accessToken);
        
//         if (newRefreshToken) {
//           await SecureStore.setItemAsync('refreshToken', newRefreshToken);
//         }
        
//         // Update the authorization header
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
//         console.log('Token refresh successful');
        
//         // Retry the original request
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error('Token refresh failed:', refreshError);
        
//         // Clear all tokens on refresh failure
//         await SecureStore.deleteItemAsync('accessToken');
//         await SecureStore.deleteItemAsync('refreshToken');
        
//         // Redirect to login or emit logout event
//         // You might want to dispatch a global event here
        
//         return Promise.reject(refreshError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://192.168.1.152:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const response = await axios.post(`${API_URL}/refresh`, { token: refreshToken });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        await SecureStore.setItemAsync('accessToken', accessToken);
        if (newRefreshToken) {
          await SecureStore.setItemAsync('refreshToken', newRefreshToken);
        }
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        return Promise.reject(refreshError);
      }
    }
    
    // Handle blocked/deleted user
    if (error.response?.status === 403) {
      const message = error.response?.data?.error;
      if (message?.includes('blocked')) {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
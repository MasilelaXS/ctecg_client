import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types/api';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (invoicingId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const clearStoredAuth = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {}), // Ignore errors if keys don't exist
        AsyncStorage.removeItem(USER_KEY).catch(() => {}),
      ]);
      apiService.setAuthToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error clearing stored auth:', error);
    }
  };

  const logout = async () => {
    try {
      console.log('🔴 Logging out - clearing all cached data');
      
      // Clear stored authentication data
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {}),
        AsyncStorage.removeItem(USER_KEY).catch(() => {}),
        // Clear any potential cached user-specific data
        AsyncStorage.removeItem('dashboard_data').catch(() => {}),
        AsyncStorage.removeItem('billing_data').catch(() => {}),
        AsyncStorage.removeItem('usage_data').catch(() => {}),
        AsyncStorage.removeItem('cached_customer_data').catch(() => {})
      ]);
      
      // Reset state
      setUser(null);
      setIsLoading(false);
      
      // Clear API service token
      apiService.setAuthToken(null);
      
      console.log('✅ Logout complete - all data cleared');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, reset the state
      setUser(null);
      setIsLoading(false);
      apiService.setAuthToken(null);
    }
  };

  // Load stored authentication data on app start
  useEffect(() => {
    loadStoredAuth();
    
    // Set up auth failure callback for automatic logout on token expiration
    apiService.setAuthFailureCallback(() => {
      console.log('🔴 Auth failure detected, logging out automatically');
      logout();
    });

    // Cleanup callback on unmount
    return () => {
      apiService.setAuthFailureCallback(null);
    };
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [token, userData] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY)
      ]);

      console.log('Loading stored auth:', {
        hasToken: !!token,
        tokenLength: token?.length,
        hasUserData: !!userData
      });

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        
        // Set the token first so we can make the validation request
        apiService.setAuthToken(token);
        
        // Validate the token by trying to get current user
        try {
          const response = await apiService.getCurrentUser();
          
          if (response.success && response.data) {
            // Token is valid, set user state
            setUser(response.data);
            // Update stored user data with fresh data
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data));
            console.log('Auth validated successfully for user:', response.data.invoicingid);
          } else {
            // Token is invalid, clear stored auth
            console.log('Stored token is invalid, clearing auth');
            await clearStoredAuth();
          }
        } catch (validationError) {
          console.log('Token validation failed, clearing auth:', validationError);
          await clearStoredAuth();
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      await clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (invoicingid: string, password: string) => {
    try {
      const response = await apiService.login(invoicingid, password);
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        
        console.log('Login successful:', {
          hasToken: !!token,
          tokenLength: token?.length,
          user: userData.invoicingid
        });
        
        // Store token securely and user data
        await Promise.all([
          SecureStore.setItemAsync(TOKEN_KEY, token),
          AsyncStorage.setItem(USER_KEY, JSON.stringify(userData))
        ]);
        
        setUser(userData);
        apiService.setAuthToken(token);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      
      if (response.success && response.data) {
        setUser(response.data);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      // If refresh fails, logout user
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../services/api';

interface User {
  id: string;
  email: string;
  name?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Mock auth check for now since backend might not be fully ready
      // const response = await apiClient.getCurrentUser();
      // setUser(response.user);
      setUser(null); // Default to not logged in
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      // Mock login for now
      // const response = await apiClient.login({ email, password });
      // setUser(response.user);
      setUser({ id: '1', email, name: 'Demo User' });
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (userData: any) => {
    try {
      setError(null);
      // Mock register
      // const response = await apiClient.register(userData);
      // setUser(response.user);
      setUser({ id: '1', email: userData.email, name: userData.name || 'New User' });
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      // await apiClient.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      // const response = await apiClient.updateProfile(profileData);
      // setUser(response.user);
      setUser(prev => ({ ...prev!, ...profileData }));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

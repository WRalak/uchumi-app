import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      toast.success('Login successful!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      toast.success('Registration successful!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    try {
      const data = await authService.updateProfile(userData);
      setUser(data.user);
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: () => !!user,
    isAdmin: () => user?.is_admin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
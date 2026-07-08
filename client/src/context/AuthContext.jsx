import React, { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const storedUser = window.sessionStorage.getItem('hospital-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(window.sessionStorage.getItem('hospital-token'));
  });

  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data?.data?.token;
      const nextUser = response.data?.data?.user;
      setUser(nextUser || null);
      setIsAuthenticated(Boolean(token));
      if (token) {
        window.sessionStorage.setItem('hospital-token', token);
      }
      if (nextUser) {
        window.sessionStorage.setItem('hospital-user', JSON.stringify(nextUser));
      }
      return { success: true, user: nextUser };
    } finally {
      setLoading(false);
    }
  };

  const register = async (form) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', form);
      const token = response.data?.data?.token;
      const nextUser = response.data?.data?.user;
      setUser(nextUser || null);
      setIsAuthenticated(Boolean(token));
      if (token) {
        window.sessionStorage.setItem('hospital-token', token);
      }
      if (nextUser) {
        window.sessionStorage.setItem('hospital-user', JSON.stringify(nextUser));
      }
      return { success: true, user: nextUser };
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/profile');
      const nextUser = response.data?.data?.user;
      setUser(nextUser || null);
      if (nextUser) {
        window.sessionStorage.setItem('hospital-user', JSON.stringify(nextUser));
      }
      return nextUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.get('/auth/profile').catch(() => undefined);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      window.sessionStorage.removeItem('hospital-token');
      window.sessionStorage.removeItem('hospital-user');
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ user, isAuthenticated, loading, login, register, fetchProfile, logout }),
    [user, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

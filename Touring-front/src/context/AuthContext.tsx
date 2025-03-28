import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User } from '../api/authApi';
import adminApi from '../api/adminApi';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  fetchAdminProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  }, []);

  const fetchAdminProfile = useCallback(async () => {
    try {
      const { profile } = await adminApi.getAdminProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to fetch admin profile', error);
      logout();
    }
  }, [logout]); // `logout` is stable due to useCallback

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchAdminProfile();
    }
  }, [fetchAdminProfile]); // No ESLint warning now

  return (
    <AuthContext.Provider value={{ user, setUser, logout, fetchAdminProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

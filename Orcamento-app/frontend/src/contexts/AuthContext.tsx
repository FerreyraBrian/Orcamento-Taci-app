import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, LoginRequest } from '../types';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));

  useEffect(() => {
    const validateStoredToken = async () => {
      if (token) {
        const isValid = await authApi.validateToken();
        if (!isValid) {
          setToken(null);
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      }
    };

    validateStoredToken();
  }, [token]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const loginRequest: LoginRequest = { username, password };
      const response = await authApi.login(loginRequest);
      
      if (response.success && response.token) {
        setToken(response.token);
        localStorage.setItem('adminToken', response.token);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error(response.message || 'Login failed');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    if (token) {
      authApi.logout().catch(console.error);
    }
    setToken(null);
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    isAuthenticated,
    token,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
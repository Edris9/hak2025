'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User } from '@/domain/models';
import { setAccessToken } from '@/infrastructure/api';
import { authRepository } from '@/infrastructure/repositories';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true to check auth on mount

  // Initialize auth state on mount by trying to refresh the token
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to refresh the token using the httpOnly cookie
        const refreshResponse = await authRepository.refresh();
        setToken(refreshResponse.accessToken);
        setAccessToken(refreshResponse.accessToken);

        // Fetch the current user
        const currentUser = await authRepository.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch {
        // No valid refresh token, user is not authenticated
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const setAuth = useCallback((newUser: User, token: string) => {
    setUser(newUser);
    setToken(token);
    setAccessToken(token);
  }, []);

  const updateUser = useCallback((newUser: User) => {
    setUser(newUser);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    setAccessToken(null);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!user,
    isLoading,
    setAuth,
    updateUser,
    clearAuth,
    setLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import { getAccessToken, clearTokens } from '../lib/cookie-utils';
import type { User } from '../types/user';
import type { Token } from '../types/token';

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessToken();
      setAccessToken(token);

      if (token) {
        try {
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('ユーザー情報の取得に失敗しました:', error);
          // トークンが無効な場合はクリア
          clearTokens();
          setAccessToken(null);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const token: Token = await apiClient.login(username, password);
      setAccessToken(token.access);

      // ログイン後にユーザー情報を取得
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('ログインに失敗しました:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    setAccessToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

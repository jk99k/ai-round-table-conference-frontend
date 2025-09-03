'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
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
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);
    setIsLoading(false);
    // ユーザー情報取得（必要ならAPIで取得）
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    const token: Token = await apiClient.login(username, password);
    setAccessToken(token.access);
    setIsLoading(false);
    // 必要ならユーザー情報取得
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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

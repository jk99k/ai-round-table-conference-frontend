import type { User } from '../types/user';
import type { Token } from '../types/token';
import type { AgentCreate, AgentRead } from '../types/agent';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function setTokens(token: Token) {
  localStorage.setItem('accessToken', token.access);
  localStorage.setItem('refreshToken', token.refresh);
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {},
  retry = true
): Promise<Response> {
  const accessToken = getAccessToken();
  const headers = new Headers(init.headers || {});
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  const res = await fetch(input, { ...init, headers });
  if (res.status === 401 && retry) {
    // トークンリフレッシュ
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('認証情報がありません');
    const refreshRes = await fetch(`${API_BASE_URL}/api/users/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (refreshRes.ok) {
      const token: Token = await refreshRes.json();
      setTokens(token);
      // 再試行
      return fetchWithAuth(input, init, false);
    } else {
      clearTokens();
      window.location.href = '/login';
      throw new Error('認証が必要です');
    }
  }
  return res;
}

export const apiClient = {
  async register(username: string, email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) throw new Error('登録に失敗しました');
    return res.json();
  },

  async login(username: string, password: string): Promise<Token> {
    const res = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('ログインに失敗しました');
    const token: Token = await res.json();
    setTokens(token);
    return token;
  },
};

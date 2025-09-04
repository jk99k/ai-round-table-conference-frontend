export async function deleteAgents(ids: number[]): Promise<number> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/agents`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error('エージェント削除に失敗しました');
  const result = await res.json();
  return result.deleted;
}
import type { AgentCreate, AgentRead } from '../types/agent';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function setTokens(token: { access: string; refresh: string }) {
  localStorage.setItem('accessToken', token.access);
  localStorage.setItem('refreshToken', token.refresh);
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

async function fetchWithAuth(
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
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('認証情報がありません');
    const refreshRes = await fetch(`${API_BASE_URL}/api/users/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (refreshRes.ok) {
      const token = await refreshRes.json();
      setTokens(token);
      return fetchWithAuth(input, init, false);
    } else {
      clearTokens();
      window.location.href = '/login';
      throw new Error('認証が必要です');
    }
  }
  return res;
}

export async function getAgents(): Promise<AgentRead[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/agents`, { method: 'GET' });
  if (!res.ok) throw new Error('エージェント取得に失敗しました');
  return res.json();
}

export async function createAgent(agent: AgentCreate): Promise<AgentRead> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/agents`, {
    method: 'POST',
    body: JSON.stringify(agent),
  });
  if (!res.ok) throw new Error('エージェント作成に失敗しました');
  return res.json();
}

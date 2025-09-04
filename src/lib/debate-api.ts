import type { DebateCreate, DebateOut } from '../types/debate';
import { fetchWithAuth } from './api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const debateApi = {
  async deleteDebates(ids: number[]): Promise<number> {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/debates`, {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('ディベート削除に失敗しました');
    const result = await res.json();
    return result.deleted;
  },
  async createDebate(data: DebateCreate): Promise<DebateOut> {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/debates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('ディベート作成に失敗しました');
    return res.json();
  },

  async getDebates(): Promise<DebateOut[]> {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/debates`, { method: 'GET' });
    if (!res.ok) throw new Error('ディベート一覧取得に失敗しました');
    return res.json();
  },

  async getDebateById(id: number): Promise<DebateOut> {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/debates/${id}`, { method: 'GET' });
    if (!res.ok) throw new Error('ディベート詳細取得に失敗しました');
    return res.json();
  },

  async endDebate(id: number): Promise<DebateOut> {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/debates/${id}/end`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('ディベート終了に失敗しました');
    return res.json();
  },
};

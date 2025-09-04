'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAgent } from '../../../lib/agent-api';
import type { AgentCreate } from '../../../types/agent';

export default function CreateAgentForm() {
  const [form, setForm] = useState<AgentCreate>({ name: '' });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createAgent(form);
      setForm({ name: '' });
      router.push('/agents');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('エージェント作成に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white shadow">
      <div>
        <label className="block text-sm font-medium">名前</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '作成中...' : 'エージェント作成'}
      </button>
    </form>
  );
}

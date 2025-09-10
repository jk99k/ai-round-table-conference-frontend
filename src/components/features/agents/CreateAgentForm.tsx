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
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-8"
      style={{
        background: '#f0f4f8',
        borderRadius: '32px',
        boxShadow: '12px 12px 32px #cfd8e3, -12px -12px 32px #ffffff',
      }}
    >
      <h2 className="text-2xl font-bold mb-8 text-center" style={{ letterSpacing: '0.05em' }}>
        エージェント新規作成
      </h2>
      <div className="flex flex-col items-center mb-8">
        {/* アイコンアップロードは今後拡張。現状はダミー画像表示 */}
        <div
          className="flex items-center justify-center mb-4"
          style={{
            background: '#f0f4f8',
            borderRadius: '50%',
            boxShadow: '8px 8px 24px #cfd8e3, -8px -8px 24px #ffffff',
            padding: '12px',
            width: '96px',
            height: '96px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={'/human.png'}
            alt="agent icon"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '2px 2px 8px #cfd8e3, -2px -2px 8px #ffffff',
              background: '#f0f4f8',
            }}
          />
        </div>
        <label className="block mb-2 font-semibold text-gray-700">名前</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-2xl text-lg shadow"
          style={{
            background: '#f5f7fa',
            boxShadow: '4px 4px 16px #cfd8e3, -4px -4px 16px #ffffff',
            border: 'none',
            outline: 'none',
            maxWidth: '320px',
          }}
          placeholder="エージェント名を入力"
        />
      </div>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-2xl font-bold text-lg shadow transition-all duration-150"
        style={{
          background: 'linear-gradient(90deg, #3b82f6 60%, #60a5fa 100%)',
          color: '#fff',
          boxShadow: '4px 4px 16px #cfd8e3, -4px -4px 16px #ffffff',
          border: 'none',
        }}
      >
        {loading ? '作成中...' : 'エージェント作成'}
      </button>
    </form>
  );
}

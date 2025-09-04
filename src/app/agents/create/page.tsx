'use client';
import { useState } from 'react';
import { createAgent } from '../../../lib/agent-api';
import { useRouter } from 'next/navigation';

export default function CreateAgentPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createAgent({ name });
      router.push('/agents');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('エージェント作成に失敗しました');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 space-y-4">
      <h2 className="text-xl font-bold">エージェント作成</h2>
      <input
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="エージェント名"
        required
        className="w-full border rounded px-2 py-1"
      />
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        作成
      </button>
    </form>
  );
}

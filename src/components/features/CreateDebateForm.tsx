'use client';

import { useState, useEffect } from 'react';
import type { DebateCreate } from '../../types/debate';
import type { AgentRead } from '../../types/agent';
import { getAgents } from '../../lib/agent-api';
import { debateApi } from '../../lib/debate-api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreateDebateForm() {
  const [topic, setTopic] = useState('');
  const [agents, setAgents] = useState<AgentRead[]>([]);
  const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // エージェント一覧取得
  useEffect(() => {
    (async () => {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch {
        setAgents([]);
      } finally {
        setLoadingAgents(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data: DebateCreate = { topic: topic, agent_ids: selectedAgentIds };
      const debate = await debateApi.createDebate(data);
      // debate一覧ページに遷移し、selectedIdをdebate.idにセット
      window.localStorage.setItem('selectedDebateId', String(debate.id));
      router.push('/debates');
    } catch {
      setError('ディベート作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-8"
      style={{
        background: '#f0f4f8',
        borderRadius: '32px',
        boxShadow: '12px 12px 32px #cfd8e3, -12px -12px 32px #ffffff',
      }}
    >
      <h2 className="text-2xl font-bold mb-8 text-center" style={{ letterSpacing: '0.05em' }}>
        ディベート作成
      </h2>
      <div className="mb-8">
        <label className="block mb-2 font-semibold text-gray-700">テーマ</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl text-lg shadow"
          style={{
            background: '#f5f7fa',
            boxShadow: '4px 4px 16px #cfd8e3, -4px -4px 16px #ffffff',
            border: 'none',
            outline: 'none',
          }}
          required
          placeholder="ディベートのテーマを入力"
        />
      </div>
      <div className="mb-8">
        <label className="block mb-2 font-semibold text-gray-700">エージェント選択</label>
        {loadingAgents ? (
          <div>読み込み中...</div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center">
            {agents.map((agent) => (
              <button
                type="button"
                key={agent.id}
                className={`flex flex-col items-center px-4 py-3 rounded-2xl font-semibold transition-all duration-150 ${selectedAgentIds.includes(agent.id) ? 'bg-blue-100 shadow-lg scale-105' : ''}`}
                style={{
                  background: '#f5f7fa',
                  boxShadow: selectedAgentIds.includes(agent.id)
                    ? '8px 8px 24px #cfd8e3, -8px -8px 24px #ffffff'
                    : '4px 4px 12px #cfd8e3, -4px -4px 12px #ffffff',
                  border: selectedAgentIds.includes(agent.id) ? '2px solid #3b82f6' : 'none',
                  color: selectedAgentIds.includes(agent.id) ? '#2563eb' : '#333',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setSelectedAgentIds((ids) =>
                    ids.includes(agent.id)
                      ? ids.filter((id) => id !== agent.id)
                      : [...ids, agent.id]
                  );
                }}
              >
                <Image
                  src={
                    agent.avatar_url && agent.avatar_url !== 'undefined'
                      ? agent.avatar_url.startsWith('http')
                        ? agent.avatar_url
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${agent.avatar_url}`
                      : '/human.png'
                  }
                  alt={agent.name}
                  width={48}
                  height={48}
                  style={{
                    borderRadius: '50%',
                    marginBottom: '8px',
                    boxShadow: '8px 8px 8px #cfd8e3, -8px -8px 8px #ffffff',
                    background: '#f0f4f8',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                    overflow: 'hidden',
                  }}
                  sizes="48px"
                  priority
                />
                <span className="truncate" style={{ maxWidth: '80px' }}>
                  {agent.name}
                </span>
              </button>
            ))}
          </div>
        )}
        <div className="mt-4 text-sm text-gray-600 text-center">
          選択済み:{' '}
          {selectedAgentIds.length > 0
            ? selectedAgentIds
                .map((id) => agents.find((a) => a.id === id)?.name)
                .filter(Boolean)
                .join(', ')
            : 'なし'}
        </div>
      </div>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <button
        type="submit"
        className="w-full py-3 rounded-2xl font-bold text-lg shadow transition-all duration-150"
        style={{
          background: 'linear-gradient(90deg, #3b82f6 60%, #60a5fa 100%)',
          color: '#fff',
          boxShadow: '4px 4px 16px #cfd8e3, -4px -4px 16px #ffffff',
          border: 'none',
        }}
        disabled={loading}
      >
        {loading ? '作成中...' : 'ディベート作成'}
      </button>
    </form>
  );
}

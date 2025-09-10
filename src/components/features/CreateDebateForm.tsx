'use client';

import { useState, useEffect } from 'react';
import type { DebateCreate } from '../../types/debate';
import type { AgentRead } from '../../types/agent';
import { getAgents } from '../../lib/agent-api';
import { debateApi } from '../../lib/debate-api';
import { useRouter } from 'next/navigation';

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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">ディベート作成</h2>
      <div className="mb-4">
        <label className="block mb-1">テーマ</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">エージェント選択</label>
        {loadingAgents ? (
          <div>読み込み中...</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {agents.map((agent) => (
              <button
                type="button"
                key={agent.id}
                className={`px-3 py-1 rounded border ${selectedAgentIds.includes(agent.id) ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                onClick={() => {
                  setSelectedAgentIds((ids) =>
                    ids.includes(agent.id)
                      ? ids.filter((id) => id !== agent.id)
                      : [...ids, agent.id]
                  );
                }}
              >
                {agent.name}
              </button>
            ))}
          </div>
        )}
        <div className="mt-2 text-sm text-gray-600">
          選択済み: {selectedAgentIds.length > 0 ? selectedAgentIds.join(', ') : 'なし'}
        </div>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? '作成中...' : '作成'}
      </button>
    </form>
  );
}

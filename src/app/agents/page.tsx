'use client';

import { useEffect, useState } from 'react';
import { getAgents } from '../../lib/agent-api';
import type { AgentRead } from '../../types/agent';
import CreateAgentForm from '../../components/features/agents/CreateAgentForm';
import Image from 'next/image';

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await getAgents();
      setAgents(data);
    } catch {
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      const { deleteAgents } = await import('../../lib/agent-api');
      await deleteAgents(selectedIds);
      await fetchAgents();
      setSelectedIds([]);
      setShowDeleteModal(false);
    } catch {
      // エラー処理は省略
    } finally {
      setDeleting(false);
    }
  };

  const selectedAgent = agents.find((a) => a.id === selectedId) || null;

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl mx-auto py-8">
      {/* 左カラム: エージェントリスト＋複数選択削除＋選択モード */}
      <div className="md:w-1/3 w-full bg-white rounded shadow p-4 relative">
        <h2 className="text-lg font-bold mb-4">エージェント一覧</h2>
        <button
          className={`w-full mb-4 py-2 rounded font-semibold bg-blue-600 text-white`}
          onClick={() => setSelectedId(null)}
        >
          + 新規作成
        </button>
        <div className="flex items-center gap-2 mb-2">
          <button
            className={`px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold shadow hover:bg-gray-200 transition ${selectMode ? 'bg-blue-100 text-blue-700' : ''}`}
            onClick={() => {
              setSelectMode(!selectMode);
              setSelectedIds([]);
            }}
          >
            {selectMode ? '選択モード解除' : '選択モード'}
          </button>
          {selectMode && selectedIds.length > 0 && (
            <>
              <span className="text-sm text-gray-700">{selectedIds.length}件選択中</span>
              <button
                className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold shadow hover:bg-red-600 transition"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
              >
                {deleting ? '削除中...' : '選択削除'}
              </button>
            </>
          )}
        </div>
        {loading ? (
          <div>読み込み中...</div>
        ) : (
          <ul className="space-y-2">
            {agents.map((agent) => (
              <li
                key={agent.id}
                className={`flex items-center px-3 py-2 rounded cursor-pointer hover:bg-blue-50 transition-all duration-150 ${selectedId === agent.id ? 'bg-blue-100 font-bold' : ''}`}
                onMouseEnter={() => setSelectedId(agent.id)}
                onClick={() => !selectMode && setSelectedId(agent.id)}
              >
                {selectMode && (
                  <input
                    type="checkbox"
                    className="mr-2 accent-blue-500 scale-110"
                    checked={selectedIds.includes(agent.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSelectedIds((ids) =>
                        e.target.checked ? [...ids, agent.id] : ids.filter((id) => id !== agent.id)
                      );
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <span className="truncate">{agent.name}</span>
              </li>
            ))}
          </ul>
        )}
        {/* 削除モーダル */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
              <h3 className="text-lg font-bold mb-2 text-red-600">
                選択したエージェントを削除しますか？
              </h3>
              <p className="mb-4 text-sm text-gray-700">この操作は元に戻せません。</p>
              <div className="flex gap-2 justify-center">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  キャンセル
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white font-bold shadow hover:bg-red-600"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? '削除中...' : '削除する'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 右カラム: 詳細 or 新規作成 */}
      <div className="md:w-2/3 w-full bg-white rounded shadow p-6">
        {selectedAgent ? (
          <div>
            <h2 className="text-xl font-bold mb-4">{selectedAgent.name}</h2>
            {selectedAgent.avatar_url && (
              <Image
                src={
                  selectedAgent.avatar_url.startsWith('http')
                    ? selectedAgent.avatar_url
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${selectedAgent.avatar_url}`
                }
                alt={selectedAgent.name}
                className="w-24 h-24 rounded-full mb-4 object-cover border"
                width={96}
                height={96}
              />
            )}
            <div className="mb-4">
              <span className="font-semibold">ペルソナ:</span>
              <div className="mt-2 whitespace-pre-wrap text-gray-700">
                {selectedAgent.persona_prompt || (
                  <span className="text-gray-400">ペルソナ未生成</span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-400">
              作成日: {new Date(selectedAgent.created_at).toLocaleString()}
            </div>
          </div>
        ) : (
          <CreateAgentForm />
        )}
      </div>
    </div>
  );
}

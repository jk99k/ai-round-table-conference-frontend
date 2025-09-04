'use client';
import type { AgentRead } from '../../../types/agent';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Props = {
  agents: AgentRead[];
  loading?: boolean;
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  onDelete: () => void;
  deleting: boolean;
};

export default function AgentList({
  agents,
  loading,
  selectedIds,
  setSelectedIds,
  onDelete,
  deleting,
}: Props) {
  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }
  if (!agents || agents.length === 0) {
    return <div className="p-4">エージェントが存在しません。</div>;
  }
  return (
    <div className="p-4">
      <button
        className="bg-red-600 text-white px-4 py-2 rounded mb-4"
        onClick={onDelete}
        disabled={deleting || selectedIds.length === 0}
      >
        {deleting ? '削除中...' : `選択したエージェントを削除（${selectedIds.length}件）`}
      </button>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div key={agent.id} className="border rounded p-4 bg-white shadow flex flex-col gap-2">
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(agent.id)}
                onChange={() => {
                  if (selectedIds.includes(agent.id)) {
                    setSelectedIds(selectedIds.filter((i) => i !== agent.id));
                  } else {
                    setSelectedIds([...selectedIds, agent.id]);
                  }
                }}
              />
              <span className="font-bold text-lg">{agent.name}</span>
            </label>
            {agent.status === 'COMPLETED' && agent.avatar_url && (
              <Image
                src={`${API_BASE_URL}/${agent.avatar_url}`}
                alt={agent.name}
                width={40}
                height={40}
                className="rounded-full"
                unoptimized
              />
            )}
            <div className="text-sm text-gray-700">
              {agent.status === 'COMPLETED' && agent.persona_prompt}
              {agent.status === 'COMPLETED' && agent.persona_prompt === null && (
                <span className="text-gray-400">ペルソナ未生成</span>
              )}
              {agent.status === 'PENDING' && (
                <span className="flex items-center gap-2 text-blue-500">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  AIがペルソナと画像を生成中です...
                </span>
              )}
              {agent.status === 'GENERATING' && (
                <span className="flex items-center gap-2 text-blue-500">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  AIがペルソナと画像を生成中です...
                </span>
              )}
              {agent.status === 'FAILED' && (
                <span className="text-red-500">生成に失敗しました</span>
              )}
            </div>
            <div className="text-xs text-gray-400">
              作成日: {new Date(agent.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

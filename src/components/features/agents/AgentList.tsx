'use client';
import type { AgentRead } from '../../../types/agent';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  agents: AgentRead[];
  loading?: boolean;
};

export default function AgentList({ agents, loading }: Props) {
  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }
  if (!agents || agents.length === 0) {
    return <div className="p-4">エージェントが存在しません。</div>;
  }
  return (
    <div className="grid gap-4 p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <div key={agent.id} className="border rounded p-4 bg-white shadow flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {agent.status === 'COMPLETED' && agent.avatar_url && (
              <Image
                src={
                  agent.avatar_url.startsWith('/')
                    ? `${API_BASE_URL}${agent.avatar_url}`
                    : agent.avatar_url
                }
                alt={agent.name}
                width={40}
                height={40}
                className="rounded-full"
                unoptimized
              />
            )}
            <span className="font-bold text-lg">{agent.name}</span>
          </div>
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
            {agent.status === 'FAILED' && <span className="text-red-500">生成に失敗しました</span>}
          </div>
          <div className="text-xs text-gray-400">
            作成日: {new Date(agent.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

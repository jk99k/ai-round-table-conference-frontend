import type { DebateOut } from '../../../types/debate';
import Image from 'next/image';
import { useState } from 'react';
import { debateApi } from '../../../lib/debate-api';

export default function DMDetail({ debate }: { debate: DebateOut | null }) {
  const [debateState, setDebateState] = useState<DebateOut | null>(debate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!debateState)
    return <div className="text-gray-400 text-center mt-20">ディベートが見つかりません</div>;

  const handleEndDebate = async () => {
    if (!window.confirm('議論を終了しますか？')) return;
    setLoading(true);
    setError(null);
    try {
      const ended = await debateApi.endDebate(debateState.id);
      setDebateState(ended);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message || '議論終了に失敗しました');
      else setError('議論終了に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg font-bold">{debateState.topic}</span>
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          {debateState.status}
        </span>
        <button
          className="ml-auto px-4 py-1 rounded bg-red-500 text-white text-xs font-bold shadow hover:bg-red-600 transition disabled:opacity-50"
          onClick={handleEndDebate}
          disabled={loading || debateState.status !== 'IN_PROGRESS'}
        >
          {loading ? '終了中...' : '議論終了'}
        </button>
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="flex-1 overflow-y-auto px-2 py-2 bg-gray-50 rounded">
        {/* DM風メッセージ表示 */}
        {debateState.messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-10">メッセージはありません</div>
        ) : (
          <ul className="flex flex-col gap-4">
            {debateState.messages.map((msg) => {
              const agent = debateState.agents.find((p) => p.agent_id === msg.agent_id);
              const isLeft = msg.agent_id === debateState.agents[0]?.agent_id;
              return (
                <li
                  key={msg.id}
                  className={`flex items-end ${isLeft ? 'justify-start' : 'justify-end'}`}
                >
                  {isLeft && agent?.avatar_url && (
                    <div className="flex flex-col items-center mr-2">
                      <Image
                        src={
                          msg.agent.avatar_url?.startsWith('http')
                            ? msg.agent.avatar_url
                            : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${msg.agent.avatar_url}`
                        }
                        alt={agent.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover border shadow"
                        style={{ width: 40, height: 40 }}
                      />
                      <span className="text-xs text-gray-500 mt-1 max-w-[60px] truncate">
                        {msg.agent.name}
                      </span>
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg shadow ${isLeft ? 'bg-white text-gray-800' : 'bg-blue-600 text-white'} whitespace-pre-wrap`}
                  >
                    <div className="text-sm">{msg.content}</div>
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  {!isLeft && agent?.avatar_url && (
                    <div className="flex flex-col items-center ml-2">
                      <Image
                        src={
                          msg.agent.avatar_url?.startsWith('http')
                            ? msg.agent.avatar_url
                            : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${msg.agent.avatar_url}`
                        }
                        alt={agent.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover border shadow"
                        style={{ width: 40, height: 40 }}
                      />
                      <span className="text-xs text-gray-500 mt-1 max-w-[60px] truncate">
                        {agent.name}
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

import type { DebateOut } from '../../../types/debate';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { debateApi } from '../../../lib/debate-api';

export default function DMDetail({ debate }: { debate: DebateOut | null }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [debateState, setDebateState] = useState<DebateOut | null>(debate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [humanMessage, setHumanMessage] = useState('');
  const [sending, setSending] = useState(false);
  // next_agent_name表示時は自動スクロール
  useEffect(() => {
    if (
      debateState?.status === 'IN_PROGRESS' &&
      debateState.next_agent_name &&
      messagesEndRef.current
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [debateState?.next_agent_name, debateState?.status]);
  // 3秒ごとにフェッチ
  useEffect(() => {
    if (!debate) return;
    setDebateState(debate);
    const fetchDetail = async () => {
      try {
        const data = await debateApi.getDebateById(debate.id);
        setDebateState(data);
      } catch {}
    };
    const interval = setInterval(fetchDetail, 3000);
    return () => clearInterval(interval);
  }, [debate]);

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

  const handleSendHumanMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!debateState || !humanMessage.trim()) return;
    setSending(true);
    setError(null);
    try {
      await debateApi.interruptDebate(debateState.id, humanMessage);
      setHumanMessage('');
      // 最新のディベート情報を再取得
      const updated = await debateApi.getDebateById(debateState.id);
      setDebateState(updated);
    } catch {
      setError('メッセージ送信に失敗しました');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg font-bold flex items-center gap-2">
          {debateState.topic}
          {debateState.status === 'IN_PROGRESS' && debateState.next_agent_name && (
            <span className="ml-2 text-xs text-blue-500 animate-pulse">
              {debateState.next_agent_name}が入力中...
            </span>
          )}
        </span>
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
          <>
            <ul className="flex flex-col gap-4">
              {debateState.messages.map((msg) => {
                const isLeft = msg.agent_id === debateState.agents?.[0]?.agent_id;
                // デフォルトアイコンパス
                const defaultAvatar = '/human.png';
                // アイコンURL判定
                const avatarUrl =
                  msg.agent?.avatar_url && msg.agent.avatar_url !== 'undefined'
                    ? msg.agent.avatar_url.startsWith('http')
                      ? msg.agent.avatar_url
                      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${msg.agent.avatar_url}`
                    : defaultAvatar;
                return (
                  <li
                    key={msg.id}
                    className={`flex items-end ${isLeft ? 'justify-start' : 'justify-end'}`}
                  >
                    {isLeft && (
                      <div className="flex flex-col items-center mr-2">
                        <Image
                          quality={100}
                          src={avatarUrl}
                          alt={msg.agent?.name || msg.agent_name || 'Human'}
                          width={40}
                          height={40}
                          className="rounded-full object-cover border shadow"
                          style={{ width: 40, height: 40 }}
                        />
                        <span className="text-xs text-gray-500 mt-1 max-w-[60px] truncate">
                          {msg.agent?.name || msg.agent_name || 'Human'}
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
                    {!isLeft && (
                      <div className="flex flex-col items-center ml-2">
                        <Image
                          quality={100}
                          src={avatarUrl}
                          alt={msg.agent?.name || msg.agent_name || 'Human'}
                          width={40}
                          height={40}
                          className="rounded-full object-cover border shadow"
                          style={{ width: 40, height: 40 }}
                        />
                        <span className="text-xs text-gray-500 mt-1 max-w-[60px] truncate">
                          {msg.agent?.name || msg.agent_name || 'Human'}
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            {debateState.status === 'IN_PROGRESS' && debateState.next_agent_name && (
              <div
                ref={messagesEndRef}
                className="flex items-center justify-start gap-2 mt-2 animate-pulse"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-500 font-bold text-lg">...</span>
                </div>
                <span className="text-xs text-blue-500 font-bold">
                  {debateState.next_agent_name}が入力中...
                </span>
              </div>
            )}
          </>
        )}
      </div>
      {/* 人間のメッセージ入力フォーム */}
      <form onSubmit={handleSendHumanMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          className="border rounded px-3 py-2 flex-1"
          placeholder="人間の指示・メッセージを入力..."
          value={humanMessage}
          onChange={(e) => setHumanMessage(e.target.value)}
          disabled={sending || debateState.status !== 'IN_PROGRESS'}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={sending || !humanMessage.trim() || debateState.status !== 'IN_PROGRESS'}
        >
          {sending ? '送信中...' : '送信'}
        </button>
      </form>
    </div>
  );
}

'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { debateApi } from '../../../lib/debate-api';
import type { DebateOut } from '../../../types/debate';

export default function DebateDetailPage() {
  const { debateId } = useParams<{ debateId: string }>();
  const [debate, setDebate] = useState<DebateOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!debateId) return;
        const data = await debateApi.getDebateById(Number(debateId));
        setDebate(data);
      } catch {
        setError('ディベート詳細の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    })();
  }, [debateId]);

  if (loading) {
    return <div className="max-w-2xl mx-auto py-8">読み込み中...</div>;
  }
  if (error || !debate) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-red-500">
        {error || 'ディベート詳細がありません'}
      </div>
    );
  }
  const handleEndDebate = async () => {
    if (!debateId) return;
    setEnding(true);
    try {
      const ended = await debateApi.endDebate(Number(debateId));
      setDebate(ended);
    } catch {
      setError('ディベート終了に失敗しました');
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ディベート詳細</h1>
      <div className="mb-4">
        <span className="font-semibold">テーマ:</span> {debate.topic}
      </div>
      <div className="mb-4">
        <span className="font-semibold">ステータス:</span> {debate.status}
      </div>
      <div className="mb-4">
        <span className="font-semibold">参加エージェント:</span>{' '}
        {debate.agents?.map((p) => p.name).join(', ')}
      </div>
      {debate.messages?.length > 0 ? (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">メッセージ</h2>
          <ul className="space-y-2 max-h-96 overflow-y-auto border p-2 rounded bg-white">
            {debate.messages.map((msg) => (
              <li key={msg.id} className="p-2 border-b last:border-0">
                <div className="text-sm text-gray-600 mb-1">
                  {msg.agent_id} ({new Date(msg.created_at).toLocaleString()})
                </div>
                <div>{msg.content}</div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mb-4">メッセージはまだありません。</div>
      )}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        className="bg-red-600 text-white px-4 py-2 rounded mb-4"
        onClick={handleEndDebate}
        disabled={ending || debate.status === 'TERMINATED_BY_USER'}
      >
        {ending ? '終了中...' : '会話を終了する'}
      </button>
      <Link href="/debates" className="text-blue-600 underline">
        一覧に戻る
      </Link>
    </div>
  );
}

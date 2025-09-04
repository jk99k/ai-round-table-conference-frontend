'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { debateApi } from '../../lib/debate-api';
import type { DebateOut } from '../../types/debate';

export default function DebateListPage() {
  const [debates, setDebates] = useState<DebateOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await debateApi.getDebates();
        setDebates(data);
      } catch {
        setError('ディベート一覧の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ディベート一覧</h1>
      {loading ? (
        <div>読み込み中...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ul className="space-y-4">
          {debates.map((debate) => (
            <li key={debate.id} className="p-4 bg-white rounded shadow flex flex-col gap-2">
              <div>
                <span className="font-semibold">テーマ:</span> {debate.topic}
              </div>
              <div>
                <span className="font-semibold">ステータス:</span> {debate.status}
              </div>
              <Link href={`/debates/${debate.id}`} className="text-blue-600 underline">
                詳細を見る
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

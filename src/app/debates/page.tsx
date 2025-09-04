'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { debateApi } from '../../lib/debate-api';
import type { DebateOut } from '../../types/debate';

export default function DebateListPage() {
  const [debates, setDebates] = useState<DebateOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);

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

  const handleSelect = (id: number) => {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      await debateApi.deleteDebates(selectedIds);
      // 削除後に再取得
      const data = await debateApi.getDebates();
      setDebates(data);
      setSelectedIds([]);
    } catch {
      setError('削除に失敗しました');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ディベート一覧</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        className="bg-red-600 text-white px-4 py-2 rounded mb-4"
        onClick={handleDelete}
        disabled={deleting || selectedIds.length === 0}
      >
        {deleting ? '削除中...' : `選択したディベートを削除（${selectedIds.length}件）`}
      </button>
      {loading ? (
        <div>読み込み中...</div>
      ) : (
        <ul className="space-y-4">
          {debates.map((debate) => (
            <li key={debate.id} className="p-4 bg-white rounded shadow flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(debate.id)}
                  onChange={() => handleSelect(debate.id)}
                />
                <span className="font-semibold">テーマ:</span> {debate.topic}
              </label>
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

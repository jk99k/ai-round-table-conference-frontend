'use client';

// import Link from 'next/link';
import { useEffect, useState } from 'react';
import { debateApi } from '../../lib/debate-api';
import type { DebateOut } from '../../types/debate';
import DMDetail from '../../components/features/debates/DMDetail';

export default function DebateListPage() {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debates, setDebates] = useState<DebateOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // debate作成直後にselectedIdをセット
  useEffect(() => {
    const storedId = window.localStorage.getItem('selectedDebateId');
    if (storedId) {
      setSelectedId(Number(storedId));
      window.localStorage.removeItem('selectedDebateId');
    }
  }, []);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setSelectedIds([]);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    const fetchDebates = async () => {
      try {
        const data = await debateApi.getDebates();
        setDebates(data);
      } catch {
        setDebates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDebates();
    const interval = setInterval(fetchDebates, 5000);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  // const handleSelect = (id: number) => {
  //   setSelectedIds((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));
  // };

  // const handleDelete = async () => {
  //   if (selectedIds.length === 0) return;
  //   setDeleting(true);
  //   try {
  //     await debateApi.deleteDebates(selectedIds);
  //     // 削除後に再取得
  //     const data = await debateApi.getDebates();
  //     setDebates(data);
  //     setSelectedIds([]);
  //   } catch {
  //     setError('削除に失敗しました');
  //   } finally {
  //     setDeleting(false);
  //   }
  // };

  return (
    // モバイル: 画面遷移風
    isMobile ? (
      <div className="w-full min-h-screen bg-[#f0f4f8]">
        {!selectedId ? (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">ディベート一覧</h2>
            {error && <div className="text-red-500 mb-2">{error}</div>}
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
                    onClick={async () => {
                      if (selectedIds.length === 0) return;
                      if (!window.confirm('選択したディベートを削除しますか？')) return;
                      setDeleting(true);
                      setError(null);
                      try {
                        await debateApi.deleteDebates(selectedIds);
                        const data = await debateApi.getDebates();
                        setDebates(data);
                        setSelectedIds([]);
                      } catch (e: unknown) {
                        if (e instanceof Error) {
                          setError(e.message || '削除に失敗しました');
                        } else {
                          setError('削除に失敗しました');
                        }
                      } finally {
                        setDeleting(false);
                      }
                    }}
                    disabled={deleting || selectedIds.length === 0}
                  >
                    {deleting ? '削除中...' : `選択削除`}
                  </button>
                </>
              )}
            </div>
            <ul className="space-y-2">
              {debates.map((debate) => (
                <li
                  key={debate.id}
                  className="p-3 rounded-xl cursor-pointer flex items-center"
                  style={{
                    background: '#f0f4f8',
                    boxShadow: '4px 4px 12px #cfd8e3, -4px -4px 12px #ffffff',
                  }}
                  onClick={() => {
                    if (selectMode) {
                      setSelectedIds((ids) =>
                        ids.includes(debate.id)
                          ? ids.filter((id) => id !== debate.id)
                          : [...ids, debate.id]
                      );
                    }
                  }}
                >
                  {selectMode && (
                    <input
                      type="checkbox"
                      className="mr-2 accent-blue-500 scale-110"
                      checked={selectedIds.includes(debate.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelectedIds((ids) =>
                          e.target.checked
                            ? [...ids, debate.id]
                            : ids.filter((id) => id !== debate.id)
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{debate.topic}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(debate.created_at).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="w-full h-screen flex flex-col bg-white">
            <button
              className="p-2 text-blue-600 font-bold rounded-xl"
              style={{
                background: '#f0f4f8',
                boxShadow: '4px 4px 12px #cfd8e3, -4px -4px 12px #ffffff',
              }}
              onClick={() => setSelectedId(null)}
            >
              ← 戻る
            </button>
            <DMDetail debate={debates.find((d) => d.id === selectedId) || null} />
          </div>
        )}
      </div>
    ) : (
      // デスクトップ: 2カラム
      <div className="flex flex-col md:flex-row w-full mx-auto md:h-[100vh]">
        {/* 左カラム: ディベート一覧＋複数選択削除 */}
        <div
          className="md:w-1/3 w-full p-4 relative md:h-[100vh] md:overflow-y-auto"
          style={{
            background: '#f0f4f8',
            borderRadius: '24px',
            boxShadow: '12px 0px 24px #cfd8e3',
          }}
        >
          <h2 className="text-lg font-bold mb-4">ディベート一覧</h2>
          {error && <div className="text-red-500 mb-2">{error}</div>}
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
              <button
                className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold shadow hover:bg-red-600 transition"
                onClick={async () => {
                  if (selectedIds.length === 0) return;
                  if (!window.confirm('選択したディベートを削除しますか？')) return;
                  setDeleting(true);
                  setError(null);
                  try {
                    await debateApi.deleteDebates(selectedIds);
                    const data = await debateApi.getDebates();
                    setDebates(data);
                    setSelectedIds([]);
                  } catch (e: unknown) {
                    if (e instanceof Error) {
                      setError(e.message || '削除に失敗しました');
                    } else {
                      setError('削除に失敗しました');
                    }
                  } finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleting || selectedIds.length === 0}
              >
                {deleting ? '削除中...' : `選択削除（${selectedIds.length}件）`}
              </button>
            )}
          </div>
          {loading ? (
            <div>読み込み中...</div>
          ) : (
            <ul className="space-y-2">
              {debates.map((debate) => (
                <li
                  key={debate.id}
                  className={`p-3 rounded-xl cursor-pointer flex items-center ${selectedId === debate.id ? 'bg-blue-100 font-bold' : ''}`}
                  style={{
                    background: '#f0f4f8',
                    boxShadow: '4px 4px 12px #cfd8e3, -4px -4px 12px #ffffff',
                  }}
                  onClick={() => {
                    if (selectMode) {
                      setSelectedIds((ids) =>
                        ids.includes(debate.id)
                          ? ids.filter((id) => id !== debate.id)
                          : [...ids, debate.id]
                      );
                    } else {
                      setSelectedId(debate.id);
                    }
                  }}
                >
                  {selectMode && (
                    <input
                      type="checkbox"
                      className="mr-2 accent-blue-500 scale-110"
                      checked={selectedIds.includes(debate.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelectedIds((ids) =>
                          e.target.checked
                            ? [...ids, debate.id]
                            : ids.filter((id) => id !== debate.id)
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold flex items-center gap-2">
                      {debate.topic}
                      {debate.status === 'IN_PROGRESS' && debate.next_agent_name && (
                        <span className="ml-2 text-xs text-blue-500 animate-pulse">
                          {debate.next_agent_name}が入力中...
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(debate.created_at).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* 右カラム: ディベート詳細（DM風UI） */}
        <div
          className="md:w-2/3 w-full flex flex-col"
          style={{
            background: '#f0f4f8',
            borderRadius: '32px',
            boxShadow: '12px 12px 24px #cfd8e3, -12px -12px 24px #ffffff',
            padding: '2.5rem 1.5rem',
            minHeight: '100vh',
          }}
        >
          {selectedId ? (
            <DMDetail debate={debates.find((d) => d.id === selectedId) || null} />
          ) : (
            <div className="text-gray-400 text-center mt-20">ディベートを選択してください</div>
          )}
        </div>
      </div>
    )
  );
}

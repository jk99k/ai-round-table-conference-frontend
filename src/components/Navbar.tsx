'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { accessToken, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
      <div>
        <Link href="/" className="font-bold text-lg">
          知の坩堝
        </Link>
      </div>
      <div className="flex gap-4">
        {!accessToken ? (
          <>
            <Link href="/login">ログイン</Link>
            <Link href="/register">登録</Link>
          </>
        ) : (
          <>
            <Link href="/agents">エージェント一覧</Link>
            <Link href="/agents/create">エージェント作成</Link>
            <button onClick={logout} className="text-red-500">
              ログアウト
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

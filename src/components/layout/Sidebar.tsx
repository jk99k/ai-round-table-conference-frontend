'use client';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <nav className="w-64 bg-white h-full shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 p-6 mb-8">
          <span className="font-bold text-xl tracking-wide">AI円卓会議</span>
        </div>
        <Link href="/debates/create" className="block px-6 py-2 mb-4">
          <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold">
            + 新規ディベート作成
          </button>
        </Link>
        <nav className="space-y-2 px-6">
          <Link href="/debates" className="block px-3 py-2 rounded hover:bg-blue-50 font-medium">
            ディベート一覧
          </Link>
          <Link href="/agents" className="block px-3 py-2 rounded hover:bg-blue-50 font-medium">
            エージェント管理
          </Link>
        </nav>
      </div>
      <div className="p-6 mt-8 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">
            {user?.username || 'ゲストユーザー'}
          </span>
          <button
            onClick={logout}
            className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </nav>
  );
}

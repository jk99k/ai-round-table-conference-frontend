'use client';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { MdTableBar } from 'react-icons/md';
import { LuBrainCircuit } from 'react-icons/lu';
import { RiLogoutCircleLine } from 'react-icons/ri';

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <nav
      className="w-64 h-full flex flex-col justify-between"
      style={{
        background: '#e6e6e6',
        boxShadow: '8px 0 16px #d1d9e6, -8px 0 16px #ffffff',
      }}
    >
      <div>
        <div className="flex items-center gap-2 p-6 mb-8">
          <span className="font-bold text-xl tracking-wide text-gray-800">AI円卓会議</span>
        </div>
        <Link href="/debates/create" className="block px-6 py-2 mb-6">
          <button
            className="w-full py-3 font-semibold"
            style={{
              background: '#3b82f6',
              color: 'white',
              borderRadius: '12px',
              boxShadow: '4px 4px 8px #3b82f6, -4px -4px 8px #60a5fa',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '6px 6px 12px #3b82f6, -6px -6px 12px #60a5fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '4px 4px 8px #3b82f6, -4px -4px 8px #60a5fa';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.boxShadow =
                'inset 4px 4px 8px #3b82f6, inset -4px -4px 8px #60a5fa';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.boxShadow = '4px 4px 8px #3b82f6, -4px -4px 8px #60a5fa';
            }}
          >
            + 新規ディベート作成
          </button>
        </Link>
        <nav className="space-y-3 px-6">
          <Link href="/debates" className="block">
            <div
              className="px-4 py-3 font-medium text-gray-700"
              style={{
                background: '#e6e6e6',
                borderRadius: '12px',
                boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow =
                  'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow = '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff';
              }}
            >
              <span className="flex items-center gap-2 text-gray-700">
                <MdTableBar
                  size={20}
                  color="#42a5f5"
                  style={{ filter: 'drop-shadow(0 4px 8px #b0b8c9)' }}
                />
                ディベート一覧
              </span>
            </div>
          </Link>
          <Link href="/agents" className="block">
            <div
              className="px-4 py-3 font-medium text-gray-700"
              style={{
                background: '#e6e6e6',
                borderRadius: '12px',
                boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow =
                  'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow = '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff';
              }}
            >
              <span className="flex items-center gap-2 text-gray-700">
                <LuBrainCircuit
                  size={20}
                  color="#66bb6a"
                  style={{ filter: 'drop-shadow(0 4px 8px #b0b8c9)' }}
                />
                エージェント管理
              </span>
            </div>
          </Link>
        </nav>
      </div>
      <div className="p-4 mt-8">
        <div
          className="p-4"
          style={{
            background: '#e6e6e6',
            borderRadius: '16px',
            boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Neumorphic アイコン: username の一文字目 */}
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold text-gray-700"
                style={{
                  background: '#e6e6e6',
                  boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
                  borderRadius: '50%',
                }}
              >
                {user?.username ? user.username[0].toUpperCase() : 'G'}
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {user?.username
                  ? user.username.length > 7
                    ? user.username.slice(0, 7) + '...'
                    : user.username
                  : 'ゲストユーザー'}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex h-8 items-center cursor-pointer gap-2 text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded"
              style={{
                background: '#e6e6e6',
                boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
                borderRadius: '12px',
              }}
            >
              <span className="flex items-center justify-center">
                <RiLogoutCircleLine size={16} />
              </span>
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

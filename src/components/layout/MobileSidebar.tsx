'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  return (
    <>
      {/* ハンバーガーアイコン */}
      <button
        className="md:hidden p-2 focus:outline-none"
        aria-label="メニューを開く"
        onClick={() => setOpen(true)}
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {/* ドロワーメニュー */}
      {(open || closing) && (
        <div
          className={`fixed inset-0 z-40 bg-white/30 backdrop-blur-md flex transition-all duration-300 ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
        >
          <nav
            className={`w-64 bg-white h-full shadow-lg flex flex-col justify-between ${closing ? 'animate-slide-out-nav' : 'animate-slide-in-nav'}`}
          >
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
                <Link
                  href="/debates"
                  className="block px-3 py-2 rounded hover:bg-blue-50 font-medium"
                >
                  ディベート一覧
                </Link>
                <Link
                  href="/agents"
                  className="block px-3 py-2 rounded hover:bg-blue-50 font-medium"
                >
                  エージェント管理
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2 p-6 mt-8">
              <span className="text-sm text-gray-600">ユーザー名</span>
              <button className="text-xs text-gray-500 hover:underline">設定</button>
              <button className="text-xs text-gray-500 hover:underline">ログアウト</button>
            </div>
          </nav>
          {/* 背景クリックで閉じる */}
          <div
            className="flex-1"
            onClick={() => {
              setClosing(true);
              setTimeout(() => {
                setOpen(false);
                setClosing(false);
              }, 300);
            }}
          />
        </div>
      )}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @keyframes slide-in-nav {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slide-out-nav {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fade-out {
          animation: fade-out 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-slide-in-nav {
          animation: slide-in-nav 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-slide-out-nav {
          animation: slide-out-nav 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .backdrop-blur-md {
          transition:
            backdrop-filter 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
}

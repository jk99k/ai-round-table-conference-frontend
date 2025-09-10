'use client';
import Sidebar from './Sidebar';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const pathname = usePathname();

  // ページ遷移時にサイドバーを閉じる
  useEffect(() => {
    if (open) {
      setClosing(true);
      setTimeout(() => {
        setOpen(false);
        setClosing(false);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
          <div
            className={`w-64 h-full ${closing ? 'animate-slide-out-nav' : 'animate-slide-in-nav'}`}
          >
            <Sidebar />
          </div>
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

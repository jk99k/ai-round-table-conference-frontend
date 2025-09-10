'use client';
import { usePathname } from 'next/navigation';
import MobileSidebar from './MobileSidebar';
import Sidebar from './Sidebar';

export default function ConditionalSidebar() {
  const pathname = usePathname();

  // ログイン・登録ページではサイドバーを表示しない
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return null;
  }

  return (
    <>
      {/* デスクトップ用サイドバー */}
      <aside className="hidden md:block fixed inset-y-0 left-0 z-20">
        <Sidebar />
      </aside>
      {/* モバイル用サイドバー（ハンバーガーメニュー＋ドロワー） */}
      <div
        className="md:hidden fixed top-0 left-0 w-full z-30 flex items-center justify-between px-4 py-3"
        style={{
          background: '#f0f4f8',
          boxShadow: '0 4px 8px #d1d9e6, 0 -4px 8px #ffffff',
        }}
      >
        <MobileSidebar />
        <span className="font-bold text-lg text-gray-800">AI円卓会議</span>
      </div>
    </>
  );
}

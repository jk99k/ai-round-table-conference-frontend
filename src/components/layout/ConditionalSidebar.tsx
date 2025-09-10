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
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b shadow z-30 flex items-center justify-between px-4 py-2">
        <MobileSidebar />
        <span className="font-bold text-lg">AI円卓会議</span>
      </div>
    </>
  );
}

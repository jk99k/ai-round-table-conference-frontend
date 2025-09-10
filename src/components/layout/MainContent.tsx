'use client';
import { usePathname } from 'next/navigation';

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // 認証ページではマージンなし、それ以外ではサイドバー分のマージン
  const marginClass = isAuthPage ? 'ml-0' : 'ml-0 md:ml-64';

  return <main className={`flex-1 ${marginClass}`}>{children}</main>;
}

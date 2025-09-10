'use client';
import { usePathname } from 'next/navigation';

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  return (
    <main
      className={`flex-1 w-full h-full${isAuthPage ? '' : ' md:ml-64'}`}
      style={{
        background: '#f0f4f8',
        minHeight: '100vh',
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </main>
  );
}

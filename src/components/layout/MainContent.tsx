'use client';

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  // 画面いっぱい表示（サイドバー除く）
  return (
    <main
      className="flex-1 w-full h-full md:ml-64"
      style={{
        background: '#e6e6e6',
        minHeight: '100vh',
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </main>
  );
}

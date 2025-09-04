import Link from 'next/link';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
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
      <div className="flex items-center gap-2 p-6 mt-8">
        <span className="text-sm text-gray-600">ユーザー名</span>
        <button className="text-xs text-gray-500 hover:underline">設定</button>
        <button className="text-xs text-gray-500 hover:underline">ログアウト</button>
      </div>
      {onClose && (
        <button
          className="absolute top-4 right-4 text-gray-500"
          onClick={onClose}
          aria-label="閉じる"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M6 6l12 12M6 18L18 6"
            />
          </svg>
        </button>
      )}
    </nav>
  );
}

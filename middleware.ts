import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証が必要なパス
const protectedPaths = ['/agents', '/debates'];
// 認証済みユーザーがアクセスできないパス（ログインページなど）
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // デバッグ用ログ
  console.log('Middleware executed for path:', pathname);

  // 認証が必要なパスかチェック
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  // 認証済みユーザーがアクセスできないパスかチェック
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // アクセストークンを取得
  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!accessToken;

  // ルートパス（/）にアクセスした場合は/debatesにリダイレクト
  if (pathname === '/') {
    console.log('Redirecting from / to /debates');
    return NextResponse.redirect(new URL('/debates', request.url));
  }

  // 認証が必要なパスに未認証でアクセスした場合
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 認証済みユーザーが認証ページにアクセスした場合
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/debates', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/',
    '/agents/:path*',
    '/debates/:path*',
    '/login',
    '/register',
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証が必要なパス
const protectedPaths = ['/agents', '/debates'];
// 認証済みユーザーがアクセスできないパス（ログインページなど）
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証が必要なパスかチェック
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  // 認証済みユーザーがアクセスできないパスかチェック
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // アクセストークンを取得
  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!accessToken;

  // 認証が必要なパスに未認証でアクセスした場合
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 認証済みユーザーが認証ページにアクセスした場合
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
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
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

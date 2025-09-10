import Cookies from 'js-cookie';
import type { Token } from '../types/token';

// Cookie設定のオプション
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production', // 本番環境ではHTTPS必須
  sameSite: 'lax' as const,
  path: '/',
};

// アクセストークンの有効期限（デフォルト15分）
const ACCESS_TOKEN_EXPIRES = 15 / (24 * 60); // 15分を日数で表現
// リフレッシュトークンの有効期限（デフォルト7日）
const REFRESH_TOKEN_EXPIRES = 7; // 7日

/**
 * アクセストークンを取得する
 */
export function getAccessToken(): string | null {
  return Cookies.get('accessToken') || null;
}

/**
 * リフレッシュトークンを取得する
 */
export function getRefreshToken(): string | null {
  return Cookies.get('refreshToken') || null;
}

/**
 * トークンを設定する
 */
export function setTokens(token: Token): void {
  Cookies.set('accessToken', token.access, {
    ...COOKIE_OPTIONS,
    expires: ACCESS_TOKEN_EXPIRES,
  });
  Cookies.set('refreshToken', token.refresh, {
    ...COOKIE_OPTIONS,
    expires: REFRESH_TOKEN_EXPIRES,
  });
}

/**
 * トークンをクリアする
 */
export function clearTokens(): void {
  Cookies.remove('accessToken', { path: '/' });
  Cookies.remove('refreshToken', { path: '/' });
}

/**
 * 認証状態をチェックする
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

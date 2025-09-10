'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import NeumorphismCard from '../../components/ui/NeumorphismCard';
import NeumorphismInput from '../../components/ui/NeumorphismInput';
import NeumorphismButton from '../../components/ui/NeumorphismButton';
import NeumorphismLink from '../../components/ui/NeumorphismLink';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(form.username, form.password);
      router.push('/agents');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('ログインに失敗しました');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4">
      <NeumorphismCard className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI円卓会議</h1>
          <h2 className="text-xl font-semibold text-gray-600">ログイン</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <NeumorphismInput
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="ユーザー名"
            required
            error={error && error.includes('ユーザー名') ? error : undefined}
          />

          <NeumorphismInput
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="パスワード"
            required
            error={error && error.includes('パスワード') ? error : undefined}
          />

          {error && !error.includes('ユーザー名') && !error.includes('パスワード') && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>
          )}

          <NeumorphismButton type="submit" variant="primary" size="lg" fullWidth className="mt-8">
            ログイン
          </NeumorphismButton>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-4">アカウントをお持ちでない方は</p>
          <NeumorphismLink href="/register">新規登録はこちら</NeumorphismLink>
        </div>
      </NeumorphismCard>
    </div>
  );
}

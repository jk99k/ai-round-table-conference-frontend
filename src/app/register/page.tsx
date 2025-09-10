'use client';
import { useState } from 'react';
import { apiClient } from '../../lib/api-client';
import { useRouter } from 'next/navigation';
import NeumorphismCard from '../../components/ui/NeumorphismCard';
import NeumorphismInput from '../../components/ui/NeumorphismInput';
import NeumorphismButton from '../../components/ui/NeumorphismButton';
import NeumorphismLink from '../../components/ui/NeumorphismLink';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiClient.register(form.username, form.email, form.password);
      router.push('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('登録に失敗しました');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <NeumorphismCard className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI円卓会議</h1>
          <h2 className="text-xl font-semibold text-gray-600">新規登録</h2>
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
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="メールアドレス"
            required
            error={error && error.includes('メール') ? error : undefined}
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

          {error &&
            !error.includes('ユーザー名') &&
            !error.includes('メール') &&
            !error.includes('パスワード') && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

          <NeumorphismButton type="submit" variant="primary" size="lg" fullWidth className="mt-8">
            登録
          </NeumorphismButton>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-4">既にアカウントをお持ちの方は</p>
          <NeumorphismLink href="/login">ログインはこちら</NeumorphismLink>
        </div>
      </NeumorphismCard>
    </div>
  );
}

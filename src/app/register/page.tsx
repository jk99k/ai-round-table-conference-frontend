'use client';
import { useState } from 'react';
import { apiClient } from '../../lib/api-client';
import { useRouter } from 'next/navigation';

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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 space-y-4">
      <h2 className="text-xl font-bold">新規登録</h2>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="ユーザー名"
        required
        className="w-full border rounded px-2 py-1"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="メールアドレス"
        required
        className="w-full border rounded px-2 py-1"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="パスワード"
        required
        className="w-full border rounded px-2 py-1"
      />
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        登録
      </button>
    </form>
  );
}

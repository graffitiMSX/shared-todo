'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/lib/providers/auth-provider';
import { useLanguage } from '@/lib/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export function LoginForm() {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
    // On success, AuthProvider will handle navigation
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
      >
        <span className="text-lg">←</span> {t.common.backToHome}
      </Link>

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">
          {t.auth.login.title} 👋
        </h1>
        <p className="mt-2 text-base text-gray-600">
          {t.auth.login.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <Input
          label={t.auth.login.email}
          type="email"
          placeholder={t.auth.login.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          label={t.auth.login.password}
          type="password"
          placeholder={t.auth.login.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-gray-700 hover:text-gray-900 font-medium"
          >
            {t.auth.login.forgotPassword}
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          {t.auth.login.signIn}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        {t.auth.login.noAccount}{' '}
        <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
          {t.auth.login.signUp}
        </Link>
      </p>
    </div>
  );
}

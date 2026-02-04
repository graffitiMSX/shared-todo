'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/providers/language-provider';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 flex items-center justify-center px-4 pt-safe-top">
      {/* Language Switcher - with safe area offset */}
      <div className="absolute right-4" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}>
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <span className="text-lg">←</span> {t.auth.forgotPassword.backToSignIn}
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">
            {t.auth.forgotPassword.title} 🔑
          </h1>
          <p className="mt-2 text-base text-gray-600">
            {t.auth.forgotPassword.subtitle}
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm text-gray-700">
            {t.auth.forgotPassword.message}
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="block w-full text-center rounded-xl bg-emerald-600 px-6 py-3 text-white font-bold shadow-lg hover:bg-emerald-700 transition-colors"
          >
            {t.auth.forgotPassword.returnToSignIn}
          </Link>
        </div>
      </div>
    </div>
  );
}

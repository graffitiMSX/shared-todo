'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/providers/language-provider';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 flex items-center justify-center px-4">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-800">404</h1>
          <div className="text-6xl mt-4">🔍</div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t.notFound.title}
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          {t.notFound.message}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-white font-bold shadow-lg hover:bg-emerald-700 transition-colors"
          >
            <span className="text-lg">←</span> {t.notFound.backToHome}
          </Link>

          <Link
            href="/todos"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-emerald-700 font-bold shadow-lg border-2 border-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            {t.notFound.goToTodos}
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { useLanguage } from '@/lib/providers/language-provider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-4 text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 flex flex-col">
      {/* Main Content - with padding for footer */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-around h-16">
            {/* Todos Tab */}
            <Link
              href="/todos"
              className={`flex flex-col items-center justify-center flex-1 h-full px-2 ${
                pathname === '/todos'
                  ? 'text-emerald-600'
                  : 'text-gray-500 hover:text-emerald-600'
              }`}
            >
              <span className="text-2xl">📋</span>
              <span className={`text-xs mt-1 font-medium ${
                pathname === '/todos' ? 'text-emerald-600' : 'text-gray-500'
              }`}>
                {t.todos.title}
              </span>
            </Link>

            {/* Settings Tab */}
            <Link
              href="/settings"
              className={`flex flex-col items-center justify-center flex-1 h-full px-2 ${
                pathname === '/settings'
                  ? 'text-emerald-600'
                  : 'text-gray-500 hover:text-emerald-600'
              }`}
            >
              <span className="text-2xl">⚙️</span>
              <span className={`text-xs mt-1 font-medium ${
                pathname === '/settings' ? 'text-emerald-600' : 'text-gray-500'
              }`}>
                {t.auth.settings.title}
              </span>
            </Link>

            {/* Language */}
            <div className="flex flex-col items-center justify-center flex-1 h-full px-2">
              <LanguageSwitcher />
            </div>

            {/* Sign Out */}
            <button
              onClick={() => signOut()}
              className="flex flex-col items-center justify-center flex-1 h-full px-2 text-gray-500 hover:text-red-500"
            >
              <span className="text-2xl">🚪</span>
              <span className="text-xs mt-1 font-medium">
                {t.auth.settings.signOut}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

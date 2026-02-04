'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { useLanguage } from '@/lib/providers/language-provider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
      {/* Navigation */}
      <nav className="border-b border-green-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <Link href="/todos" className="flex items-center">
                <span className="text-xl font-bold text-emerald-600 drop-shadow-sm">✨ Shared Todo</span>
              </Link>
              <div className="ml-10 flex space-x-8">
                <Link
                  href="/todos"
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-base font-medium ${
                    pathname === '/todos'
                      ? 'border-emerald-500 text-emerald-700'
                      : 'border-transparent text-emerald-600 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {t.todos.title}
                </Link>
                <Link
                  href="/settings"
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-base font-medium ${
                    pathname === '/settings'
                      ? 'border-emerald-500 text-emerald-700'
                      : 'border-transparent text-emerald-600 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {t.auth.settings.title}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {user && (
                <>
                  <span className="text-base font-medium text-gray-700">
                    {user.user_metadata?.display_name || user.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    {t.auth.settings.signOut}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

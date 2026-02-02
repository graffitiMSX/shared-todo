'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
                <span className="text-xl font-bold text-primary-600">✨ Shared Todo</span>
              </Link>
              <div className="ml-10 flex space-x-8">
                <Link
                  href="/todos"
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-base font-medium ${
                    pathname === '/todos'
                      ? 'border-primary-500 text-gray-800'
                      : 'border-transparent text-gray-600 hover:border-primary-300 hover:text-gray-800'
                  }`}
                >
                  Todos
                </Link>
                <Link
                  href="/settings"
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-base font-medium ${
                    pathname === '/settings'
                      ? 'border-primary-500 text-gray-800'
                      : 'border-transparent text-gray-600 hover:border-primary-300 hover:text-gray-800'
                  }`}
                >
                  Settings
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
                    Sign Out
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

'use client';

import { useAuth } from '@/lib/providers/auth-provider';

export default function TodosPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-800">
          My Todos
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Welcome back, <span className="font-semibold text-primary-600">{user?.user_metadata?.display_name || user?.email}</span>! 👋
        </p>
      </div>

      <div className="rounded-2xl bg-white p-12 text-center shadow-lg border-2 border-green-100">
        <div className="mx-auto mb-6 text-6xl">
          📝
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          No todos yet
        </h2>
        <p className="mt-2 text-lg text-gray-600 mb-6">
          Todo management will be implemented in Phase 3
        </p>
        <div className="inline-block rounded-xl bg-green-50 px-6 py-3 border-2 border-green-200">
          <p className="text-base font-semibold text-green-700">
            ✅ Phase 2 (Authentication) is complete!
          </p>
        </div>
      </div>
    </div>
  );
}

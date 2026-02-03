'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { useCapacitor } from '@/lib/providers/capacitor-provider';
import { TodoList } from '@/components/todos/TodoList';

export default function TodosPage() {
  const { user } = useAuth();
  const { isNative } = useCapacitor();

  return (
    <div className={isNative ? 'pt-safe-top pb-safe-bottom' : ''}>
      <div className="mb-6">
        <h1 className={`font-bold tracking-tight text-gray-800 ${
          isNative ? 'text-3xl' : 'text-4xl'
        }`}>
          My Todos
        </h1>
        <p className="mt-2 text-base text-gray-700">
          Welcome back, <span className="font-semibold text-primary-600">{user?.user_metadata?.display_name || user?.email}</span>! 👋
        </p>
      </div>

      <TodoList />
    </div>
  );
}

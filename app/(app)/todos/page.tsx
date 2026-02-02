'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { TodoList } from '@/components/todos/TodoList';

export default function TodosPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-800">
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

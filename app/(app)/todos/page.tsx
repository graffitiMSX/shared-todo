'use client';

import { useAuth } from '@/lib/providers/auth-provider';
import { useCapacitor } from '@/lib/providers/capacitor-provider';
import { useLanguage } from '@/lib/providers/language-provider';
import { TodoList } from '@/components/todos/TodoList';

export default function TodosPage() {
  const { user } = useAuth();
  const { isNative } = useCapacitor();
  const { t } = useLanguage();

  return (
    <div className={isNative ? 'pt-safe-top' : ''}>
      <div className="mb-6">
        <h1 className={`font-bold tracking-tight text-gray-800 ${
          isNative ? 'text-3xl' : 'text-4xl'
        }`}>
          {t.todos.title}
        </h1>
        <p className="mt-2 text-base text-gray-700">
          {t.todos.welcome} <span className="font-semibold text-emerald-600">{user?.user_metadata?.display_name || user?.email}</span>! 👋
        </p>
      </div>

      <TodoList />
    </div>
  );
}

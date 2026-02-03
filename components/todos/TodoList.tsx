'use client';

import { useState, useCallback } from 'react';
import { TodoCard } from './TodoCard';
import { TodoForm } from './TodoForm';
import { Button } from '@/components/ui/button';
import { PullToRefresh } from '@/components/ui/PullToRefresh';
import { useTodos, type Todo } from '@/lib/hooks/useTodos';
import { useAuth } from '@/lib/providers/auth-provider';
import { useCapacitor } from '@/lib/providers/capacitor-provider';
import { useHaptics } from '@/lib/hooks/useHaptics';
import { useQueryClient } from '@tanstack/react-query';

type FilterType = 'all' | 'active' | 'completed' | 'mine';

export function TodoList() {
  const { user } = useAuth();
  const { data: todos, isLoading, error } = useTodos();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isNative } = useCapacitor();
  const haptics = useHaptics();
  const queryClient = useQueryClient();

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['todos'] });
  }, [queryClient]);

  // Filter button click with haptics
  const handleFilterClick = useCallback(async (newFilter: FilterType) => {
    await haptics.selection();
    setFilter(newFilter);
  }, [haptics]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center border-2 border-red-200">
        <p className="text-red-800">Failed to load todos. Please try again.</p>
      </div>
    );
  }

  // Filter todos
  const filteredTodos = todos?.filter((todo) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        todo.title.toLowerCase().includes(query) ||
        todo.description?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    if (filter === 'mine' && todo.created_by !== user?.id) return false;

    return true;
  });

  const stats = {
    total: todos?.length || 0,
    active: todos?.filter((t) => !t.completed).length || 0,
    completed: todos?.filter((t) => t.completed).length || 0,
    mine: todos?.filter((t) => t.created_by === user?.id).length || 0,
  };

  const handleEdit = (todo: Todo) => {
    haptics.light();
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  const handleNewTodo = async () => {
    await haptics.medium();
    setEditingTodo(null);
    setShowForm(true);
  };

  const listContent = (
    <div className="space-y-6">
      {/* Header with Create button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {filter === 'all' && 'All Todos'}
            {filter === 'active' && 'Active Todos'}
            {filter === 'completed' && 'Completed Todos'}
            {filter === 'mine' && 'My Todos'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {stats.active} active • {stats.completed} completed
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleNewTodo}
          className={isNative ? 'min-h-[48px] px-6' : ''}
        >
          + New Todo
        </Button>
      </div>

      {/* Search - larger on mobile */}
      <input
        type="text"
        placeholder="🔍 Search todos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full rounded-lg border border-gray-300 bg-white px-4 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
          isNative ? 'py-4 text-lg' : 'py-3'
        }`}
      />

      {/* Filters - larger touch targets on mobile */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'active', 'completed', 'mine'] as FilterType[]).map((filterType) => {
          const labels = {
            all: `All (${stats.total})`,
            active: `Active (${stats.active})`,
            completed: `Completed (${stats.completed})`,
            mine: `Mine (${stats.mine})`,
          };
          return (
            <button
              key={filterType}
              onClick={() => handleFilterClick(filterType)}
              className={`rounded-lg font-medium transition-all ${
                isNative ? 'px-5 py-3 text-base min-h-[48px]' : 'px-4 py-2'
              } ${
                filter === filterType
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-emerald-700 border border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50 active:bg-emerald-100'
              }`}
            >
              {labels[filterType]}
            </button>
          );
        })}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div
            className={`bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl my-8 ${
              isNative ? 'mt-safe-top mb-safe-bottom' : ''
            }`}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingTodo ? 'Edit Todo' : 'Create New Todo'}
            </h3>
            <TodoForm
              todo={editingTodo || undefined}
              onSuccess={handleCloseForm}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {/* Todo List */}
      {filteredTodos && filteredTodos.length > 0 ? (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-12 text-center shadow-md border-2 border-gray-200">
          <div className="text-6xl mb-4">
            {searchQuery ? '🔍' : filter === 'completed' ? '✅' : '📝'}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {searchQuery
              ? 'No matching todos'
              : filter === 'completed'
              ? 'No completed todos yet'
              : 'No todos yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try a different search term'
              : 'Create your first todo to get started!'}
          </p>
        </div>
      )}

      {/* Mobile hint for swipe gestures */}
      {isNative && filteredTodos && filteredTodos.length > 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          💡 Swipe cards left/right for quick actions
        </p>
      )}
    </div>
  );

  // Wrap with pull-to-refresh on native
  if (isNative) {
    return (
      <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
        {listContent}
      </PullToRefresh>
    );
  }

  return listContent;
}

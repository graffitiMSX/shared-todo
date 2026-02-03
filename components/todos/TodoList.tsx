'use client';

import { useState } from 'react';
import { TodoCard } from './TodoCard';
import { TodoForm } from './TodoForm';
import { Button } from '@/components/ui/button';
import { useTodos, type Todo } from '@/lib/hooks/useTodos';
import { useAuth } from '@/lib/providers/auth-provider';

type FilterType = 'all' | 'active' | 'completed' | 'mine';

export function TodoList() {
  const { user } = useAuth();
  const { data: todos, isLoading, error } = useTodos();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  return (
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
          onClick={() => {
            setEditingTodo(null);
            setShowForm(true);
          }}
        >
          + New Todo
        </Button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search todos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-emerald-700 border border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'active'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-emerald-700 border border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50'
          }`}
        >
          Active ({stats.active})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'completed'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-emerald-700 border border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50'
          }`}
        >
          Completed ({stats.completed})
        </button>
        <button
          onClick={() => setFilter('mine')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'mine'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-emerald-700 border border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50'
          }`}
        >
          Mine ({stats.mine})
        </button>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
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
    </div>
  );
}

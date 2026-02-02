'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToggleTodo, useDeleteTodo, type Todo } from '@/lib/hooks/useTodos';
import { useTodoParticipants } from '@/lib/hooks/useParticipants';
import { formatDate, formatTime } from '@/lib/utils';

interface TodoCardProps {
  todo: Todo;
  onEdit?: (todo: Todo) => void;
}

export function TodoCard({ todo, onEdit }: TodoCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();
  const { data: participants = [] } = useTodoParticipants(todo.id);

  const handleToggle = () => {
    toggleTodo.mutate({ id: todo.id, completed: !todo.completed });
  };

  const handleDelete = () => {
    deleteTodo.mutate(todo.id);
    setShowConfirmDelete(false);
  };

  const isOverdue =
    !todo.completed &&
    todo.due_date &&
    new Date(todo.due_date) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div
      className={`rounded-xl bg-white p-4 shadow-md border-2 transition-all hover:shadow-lg ${
        todo.completed
          ? 'border-gray-200 bg-gray-50'
          : isOverdue
          ? 'border-red-200'
          : 'border-green-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
            todo.completed
              ? 'bg-primary-600 border-primary-600'
              : 'border-gray-300 hover:border-primary-500'
          }`}
          disabled={toggleTodo.isPending}
        >
          {todo.completed && (
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold ${
              todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
            }`}
          >
            {todo.title}
          </h3>

          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}

          {/* Due date/time */}
          {(todo.due_date || todo.due_time) && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-xl">📅</span>
              <span
                className={`font-medium ${
                  todo.completed
                    ? 'text-gray-400'
                    : isOverdue
                    ? 'text-red-600'
                    : 'text-gray-700'
                }`}
              >
                {todo.due_date && formatDate(todo.due_date)}
                {todo.due_time && ` at ${formatTime(todo.due_time)}`}
              </span>
              {isOverdue && (
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                  Overdue
                </span>
              )}
            </div>
          )}

          {/* Participants */}
          {participants.length > 1 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-xl">👥</span>
              <span className="text-gray-600">
                Shared with {participants.length - 1} {participants.length === 2 ? 'person' : 'people'}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {!todo.completed && (
          <div className="flex gap-2">
            {todo.is_owner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(todo)}
                className="text-gray-600 hover:text-gray-800"
              >
                Edit
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete button */}
      {todo.is_owner && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          {showConfirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Delete this todo?</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleteTodo.isPending}
                className="text-red-600 hover:text-red-700"
              >
                Yes, delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmDelete(false)}
                disabled={deleteTodo.isPending}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmDelete(true)}
              className="text-gray-500 hover:text-red-600"
            >
              🗑️ Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

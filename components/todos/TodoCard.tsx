'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SwipeableCard } from '@/components/ui/SwipeableCard';
import { useToggleTodo, useDeleteTodo, type Todo } from '@/lib/hooks/useTodos';
import { useTodoParticipants } from '@/lib/hooks/useParticipants';
import { useHaptics } from '@/lib/hooks/useHaptics';
import { useCapacitor } from '@/lib/providers/capacitor-provider';
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
  const haptics = useHaptics();
  const { isNative } = useCapacitor();

  const handleToggle = async () => {
    await haptics.success();
    toggleTodo.mutate({ id: todo.id, completed: !todo.completed });
  };

  const handleDelete = async () => {
    await haptics.error();
    deleteTodo.mutate(todo.id);
    setShowConfirmDelete(false);
  };

  const handleEdit = async () => {
    await haptics.light();
    onEdit?.(todo);
  };

  const handleSwipeComplete = async () => {
    await haptics.success();
    toggleTodo.mutate({ id: todo.id, completed: !todo.completed });
  };

  const handleSwipeDelete = async () => {
    await haptics.warning();
    setShowConfirmDelete(true);
  };

  const isOverdue =
    !todo.completed &&
    todo.due_date &&
    new Date(todo.due_date) < new Date(new Date().setHours(0, 0, 0, 0));

  const cardContent = (
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
        {/* Checkbox - larger touch target on mobile */}
        <button
          onClick={handleToggle}
          className={`mt-1 flex flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
            isNative ? 'h-8 w-8' : 'h-6 w-6'
          } ${
            todo.completed
              ? 'bg-emerald-600 border-emerald-600'
              : 'border-emerald-300 hover:border-emerald-500 active:bg-emerald-50'
          }`}
          disabled={toggleTodo.isPending}
        >
          {todo.completed && (
            <svg className={`${isNative ? 'h-5 w-5' : 'h-4 w-4'} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Actions - larger touch targets on mobile */}
        {!todo.completed && (
          <div className="flex gap-2">
            {todo.is_owner && (
              <Button
                variant="ghost"
                size={isNative ? 'md' : 'sm'}
                onClick={handleEdit}
                className={`text-emerald-600 hover:text-emerald-700 active:bg-emerald-50 ${
                  isNative ? 'min-h-[44px] min-w-[44px]' : ''
                }`}
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
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Delete this todo?</span>
              <Button
                variant="ghost"
                size={isNative ? 'md' : 'sm'}
                onClick={handleDelete}
                disabled={deleteTodo.isPending}
                className={`text-red-600 hover:text-red-700 active:bg-red-50 ${
                  isNative ? 'min-h-[44px]' : ''
                }`}
              >
                Yes, delete
              </Button>
              <Button
                variant="ghost"
                size={isNative ? 'md' : 'sm'}
                onClick={() => setShowConfirmDelete(false)}
                disabled={deleteTodo.isPending}
                className={isNative ? 'min-h-[44px]' : ''}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size={isNative ? 'md' : 'sm'}
              onClick={() => {
                haptics.light();
                setShowConfirmDelete(true);
              }}
              className={`text-emerald-600 hover:text-red-600 active:bg-red-50 ${
                isNative ? 'min-h-[44px]' : ''
              }`}
            >
              🗑️ Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );

  // On native, wrap with swipeable gestures
  if (isNative && todo.is_owner) {
    return (
      <SwipeableCard
        leftAction={
          !todo.completed
            ? {
                icon: '✅',
                label: 'Complete',
                color: '#22c55e',
                onTrigger: handleSwipeComplete,
              }
            : {
                icon: '↩️',
                label: 'Undo',
                color: '#3b82f6',
                onTrigger: handleSwipeComplete,
              }
        }
        rightAction={{
          icon: '🗑️',
          label: 'Delete',
          color: '#ef4444',
          onTrigger: handleSwipeDelete,
        }}
      >
        {cardContent}
      </SwipeableCard>
    );
  }

  return cardContent;
}

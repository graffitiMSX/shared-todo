'use client';

import { useState } from 'react';
import {
  useChecklistItems,
  useToggleChecklistItem,
  useDeleteChecklistItem,
  type ChecklistItem,
} from '@/lib/hooks/useChecklist';
import { useLanguage } from '@/lib/providers/language-provider';

interface ChecklistDisplayProps {
  todoId: string;
  isParticipant: boolean;
  onEdit?: (item: ChecklistItem) => void;
}

export function ChecklistDisplay({ todoId, isParticipant, onEdit }: ChecklistDisplayProps) {
  const { t } = useLanguage();
  const { data: items = [], isLoading } = useChecklistItems(todoId);
  const toggleItem = useToggleChecklistItem();
  const deleteItem = useDeleteChecklistItem();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggle = async (item: ChecklistItem) => {
    try {
      await toggleItem.mutateAsync({
        id: item.id,
        todo_id: todoId,
        completed: !item.completed,
      });
    } catch (error) {
      console.error('Failed to toggle item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.todos.checklist.confirmDelete || 'Delete this item?')) return;

    setDeletingId(id);
    try {
      await deleteItem.mutateAsync({ id, todo_id: todoId });
    } catch (error) {
      alert(t.todos.checklist.deleteError || 'Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">{t.common.loading || 'Loading...'}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        {t.todos.checklist.empty || 'No checklist items yet'}
      </div>
    );
  }

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;

  return (
    <div className="space-y-3">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600">
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            {/* Checkbox */}
            <button
              type="button"
              onClick={() => handleToggle(item)}
              disabled={!isParticipant}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all ${
                item.completed
                  ? 'bg-emerald-600 border-emerald-600'
                  : 'border-emerald-300 hover:border-emerald-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {item.completed && (
                <svg
                  className="w-full h-full text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Text */}
            <span
              className={`flex-1 text-sm ${
                item.completed
                  ? 'text-gray-500 line-through'
                  : 'text-gray-900'
              }`}
            >
              {item.text}
            </span>

            {/* Actions - only show for participants on hover */}
            {isParticipant && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="px-2 py-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
                  >
                    {t.common.edit || 'Edit'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                >
                  {deletingId === item.id ? '...' : t.common.delete || 'Delete'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

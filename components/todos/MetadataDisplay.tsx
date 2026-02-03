'use client';

import { useState } from 'react';
import { useTodoMetadata, useDeleteMetadata, type TodoMetadata } from '@/lib/hooks/useMetadata';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/providers/language-provider';

interface MetadataDisplayProps {
  todoId: string;
  isOwner: boolean;
  onEdit?: (metadata: TodoMetadata) => void;
}

export function MetadataDisplay({ todoId, isOwner, onEdit }: MetadataDisplayProps) {
  const { t } = useLanguage();
  const { data: metadata = [], isLoading } = useTodoMetadata(todoId);
  const deleteMetadata = useDeleteMetadata();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleQuickAction = (item: TodoMetadata) => {
    switch (item.type) {
      case 'phone':
        window.location.href = `tel:${item.value}`;
        break;
      case 'link':
        const url = item.value.startsWith('http') ? item.value : `https://${item.value}`;
        window.open(url, '_blank');
        break;
      case 'address':
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.value)}`;
        window.open(mapsUrl, '_blank');
        break;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.todos.metadata.confirmDelete || 'Delete this metadata?')) return;

    setDeletingId(id);
    try {
      await deleteMetadata.mutateAsync({ id, todo_id: todoId });
    } catch (error) {
      alert(t.todos.metadata.deleteError || 'Failed to delete metadata');
    } finally {
      setDeletingId(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return '📞';
      case 'link':
        return '🔗';
      case 'address':
        return '📍';
      case 'note':
        return '📝';
      default:
        return '📄';
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'phone':
        return t.todos.metadata.call || 'Call';
      case 'link':
        return t.todos.metadata.open || 'Open';
      case 'address':
        return t.todos.metadata.openMaps || 'Open Maps';
      default:
        return '';
    }
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">{t.common.loading || 'Loading...'}</div>;
  }

  if (metadata.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        {t.todos.metadata.empty || 'No additional information yet'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {metadata.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <span className="text-2xl">{getIcon(item.type)}</span>

          <div className="flex-1 min-w-0">
            {item.label && (
              <div className="text-xs font-medium text-gray-600 mb-1">{item.label}</div>
            )}
            <div className="text-sm text-gray-900 break-words">{item.value}</div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {item.type !== 'note' && (
              <button
                onClick={() => handleQuickAction(item)}
                className="px-3 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                {getActionLabel(item.type)}
              </button>
            )}

            {isOwner && (
              <>
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="px-3 py-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    {t.common.edit || 'Edit'}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === item.id ? '...' : t.common.delete || 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

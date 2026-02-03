'use client';

import { useState, FormEvent, useEffect } from 'react';
import {
  useAddChecklistItem,
  useUpdateChecklistItem,
  type ChecklistItem,
} from '@/lib/hooks/useChecklist';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/providers/language-provider';

interface ChecklistFormProps {
  todoId: string;
  editingItem?: ChecklistItem | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ChecklistForm({ todoId, editingItem, onSuccess, onCancel }: ChecklistFormProps) {
  const { t } = useLanguage();
  const [text, setText] = useState(editingItem?.text || '');
  const [error, setError] = useState('');

  const addItem = useAddChecklistItem();
  const updateItem = useUpdateChecklistItem();

  const isLoading = addItem.isPending || updateItem.isPending;

  useEffect(() => {
    if (editingItem) {
      setText(editingItem.text);
    }
  }, [editingItem]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError(t.todos.checklist.textRequired || 'Text is required');
      return;
    }

    try {
      if (editingItem) {
        await updateItem.mutateAsync({
          id: editingItem.id,
          todo_id: todoId,
          text: text.trim(),
        });
      } else {
        await addItem.mutateAsync({
          todo_id: todoId,
          text: text.trim(),
        });
      }

      // Reset form
      setText('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.todos.checklist.saveError || 'Failed to save');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 border border-red-200">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={t.todos.checklist.textPlaceholder || 'e.g., Buy milk'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <Button type="submit" variant="primary" isLoading={isLoading} className="px-4">
          {editingItem ? t.common.save || 'Save' : t.todos.checklist.add || 'Add'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {t.common.cancel || 'Cancel'}
          </Button>
        )}
      </div>
    </form>
  );
}

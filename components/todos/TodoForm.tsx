'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateTodo, useUpdateTodo, type Todo } from '@/lib/hooks/useTodos';
import { ParticipantSelector } from './ParticipantSelector';

interface TodoFormProps {
  todo?: Todo;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TodoForm({ todo, onSuccess, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [dueDate, setDueDate] = useState(todo?.due_date || '');
  const [dueTime, setDueTime] = useState(todo?.due_time || '');
  const [error, setError] = useState('');

  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  const isLoading = createTodo.isPending || updateTodo.isPending;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      if (todo) {
        // Update existing todo
        await updateTodo.mutateAsync({
          id: todo.id,
          title: title.trim(),
          description: description.trim() || undefined,
          due_date: dueDate || undefined,
          due_time: dueTime || undefined,
        });
      } else {
        // Create new todo
        await createTodo.mutateAsync({
          title: title.trim(),
          description: description.trim() || undefined,
          due_date: dueDate || undefined,
          due_time: dueTime || undefined,
        });
      }

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save todo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          {error}
        </div>
      )}

      <Input
        label="Title"
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          placeholder="Add more details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Due Date (optional)"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <Input
          label="Due Time (optional)"
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
      </div>

      {/* Sharing section - only show when editing existing todo */}
      {todo && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <ParticipantSelector todoId={todo.id} isOwner={todo.is_owner || false} />
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
          {todo ? 'Update Todo' : 'Create Todo'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

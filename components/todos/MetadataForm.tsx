'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAddMetadata, useUpdateMetadata, type TodoMetadata, type MetadataType } from '@/lib/hooks/useMetadata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/providers/language-provider';

interface MetadataFormProps {
  todoId: string;
  editingMetadata?: TodoMetadata | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MetadataForm({ todoId, editingMetadata, onSuccess, onCancel }: MetadataFormProps) {
  const { t } = useLanguage();
  const [type, setType] = useState<MetadataType>(editingMetadata?.type || 'phone');
  const [label, setLabel] = useState(editingMetadata?.label || '');
  const [value, setValue] = useState(editingMetadata?.value || '');
  const [error, setError] = useState('');

  const addMetadata = useAddMetadata();
  const updateMetadata = useUpdateMetadata();

  const isLoading = addMetadata.isPending || updateMetadata.isPending;

  useEffect(() => {
    if (editingMetadata) {
      setType(editingMetadata.type);
      setLabel(editingMetadata.label || '');
      setValue(editingMetadata.value);
    }
  }, [editingMetadata]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!value.trim()) {
      setError(t.todos.metadata.valueRequired || 'Value is required');
      return;
    }

    // Validation
    if (type === 'phone' && !/^[\d\s\-\(\)\+]+$/.test(value)) {
      setError(t.todos.metadata.invalidPhone || 'Invalid phone number format');
      return;
    }

    if (type === 'link' && !value.includes('.')) {
      setError(t.todos.metadata.invalidLink || 'Invalid link format');
      return;
    }

    try {
      if (editingMetadata) {
        await updateMetadata.mutateAsync({
          id: editingMetadata.id,
          todo_id: todoId,
          label: label.trim() || undefined,
          value: value.trim(),
        });
      } else {
        await addMetadata.mutateAsync({
          todo_id: todoId,
          type,
          label: label.trim() || undefined,
          value: value.trim(),
        });
      }

      // Reset form
      setLabel('');
      setValue('');
      setType('phone');

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.todos.metadata.saveError || 'Failed to save');
    }
  };

  const getPlaceholder = (type: MetadataType) => {
    switch (type) {
      case 'phone':
        return t.todos.metadata.phonePlaceholder || '+1 (555) 123-4567';
      case 'link':
        return t.todos.metadata.linkPlaceholder || 'https://example.com';
      case 'address':
        return t.todos.metadata.addressPlaceholder || '123 Main St, City, State';
      case 'note':
        return t.todos.metadata.notePlaceholder || 'Additional notes...';
    }
  };

  const getLabelPlaceholder = (type: MetadataType) => {
    switch (type) {
      case 'phone':
        return t.todos.metadata.phoneLabelPlaceholder || 'e.g., Dentist office';
      case 'link':
        return t.todos.metadata.linkLabelPlaceholder || 'e.g., Reservation link';
      case 'address':
        return t.todos.metadata.addressLabelPlaceholder || 'e.g., Restaurant location';
      case 'note':
        return t.todos.metadata.noteLabelPlaceholder || 'e.g., Important info';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 border border-red-200">
          {error}
        </div>
      )}

      {/* Type selector - only show when adding new */}
      {!editingMetadata && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.todos.metadata.typeLabel || 'Type'}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['phone', 'link', 'address', 'note'] as MetadataType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                  type === t
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <span className="text-2xl">
                  {t === 'phone' && '📞'}
                  {t === 'link' && '🔗'}
                  {t === 'address' && '📍'}
                  {t === 'note' && '📝'}
                </span>
                <span className="text-xs font-medium text-gray-700 capitalize">{t}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Input
        label={t.todos.metadata.labelField || 'Label (optional)'}
        type="text"
        placeholder={getLabelPlaceholder(type)}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />

      {type === 'note' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.todos.metadata.valueField || 'Note'}
          </label>
          <textarea
            placeholder={getPlaceholder(type)}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            required
            className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      ) : (
        <Input
          label={t.todos.metadata.valueField || type.charAt(0).toUpperCase() + type.slice(1)}
          type="text"
          placeholder={getPlaceholder(type)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
          {editingMetadata
            ? t.todos.metadata.update || 'Update'
            : t.todos.metadata.add || 'Add'}
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

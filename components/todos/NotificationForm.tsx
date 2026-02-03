'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  useAddNotification,
  useUpdateNotification,
  calculateNotifyAt,
  type TodoNotification,
  type ReminderPreset,
} from '@/lib/hooks/useNotifications';
import { useNotificationSync } from '@/lib/hooks/useNotificationSync';
import { useLanguage } from '@/lib/providers/language-provider';

interface NotificationFormProps {
  todoId: string;
  todoTitle: string;
  dueDate: string;
  dueTime: string | null;
  editingNotification?: TodoNotification | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NotificationForm({
  todoId,
  todoTitle,
  dueDate,
  dueTime,
  editingNotification,
  onSuccess,
  onCancel,
}: NotificationFormProps) {
  const { t } = useLanguage();
  const [preset, setPreset] = useState<ReminderPreset>('15min');
  const [customMinutes, setCustomMinutes] = useState(30);
  const [notificationType, setNotificationType] = useState<'local' | 'push' | 'both'>('local');
  const [message, setMessage] = useState(editingNotification?.message || '');

  const addNotification = useAddNotification();
  const updateNotification = useUpdateNotification();
  const { scheduleNativeNotification, cancelNativeNotification } = useNotificationSync();

  const isLoading = addNotification.isPending || updateNotification.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dueDate) {
      alert('Please set a due date first to add reminders');
      return;
    }

    try {
      const notifyAt = calculateNotifyAt(dueDate, dueTime, preset, customMinutes);

      let savedNotification: TodoNotification;

      if (editingNotification) {
        // Cancel old native notification before updating
        await cancelNativeNotification(editingNotification.id);

        savedNotification = await updateNotification.mutateAsync({
          id: editingNotification.id,
          todoId,
          notify_at: notifyAt,
          notification_type: notificationType,
          message: message.trim() || undefined,
        });
      } else {
        savedNotification = await addNotification.mutateAsync({
          todo_id: todoId,
          notify_at: notifyAt,
          notification_type: notificationType,
          message: message.trim() || undefined,
        });
      }

      // Schedule native notification for local/both types
      if (notificationType !== 'push') {
        await scheduleNativeNotification(savedNotification, todoTitle);
      }

      setMessage('');
      setPreset('15min');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save notification:', error);
    }
  };

  const presetOptions: { value: ReminderPreset; label: string }[] = [
    { value: '15min', label: t.todos.notifications.presets['15min'] },
    { value: '1hour', label: t.todos.notifications.presets['1hour'] },
    { value: '1day', label: t.todos.notifications.presets['1day'] },
    { value: 'custom', label: t.todos.notifications.presets.custom },
  ];

  const typeOptions: { value: 'local' | 'push' | 'both'; label: string; icon: string }[] = [
    { value: 'local', label: 'In-app', icon: '⏰' },
    { value: 'push', label: 'Push', icon: '📲' },
    { value: 'both', label: 'Both', icon: '🔔' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-3 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.todos.notifications.remindMe}
        </label>
        <div className="flex flex-wrap gap-2">
          {presetOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPreset(option.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                preset === option.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {preset === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.todos.notifications.minutesBefore}
          </label>
          <input
            type="number"
            min="1"
            max="10080"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {customMinutes >= 60
              ? `${Math.floor(customMinutes / 60)}h ${customMinutes % 60}m before`
              : `${customMinutes} minutes before`}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.todos.notifications.type}
        </label>
        <div className="flex gap-2">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setNotificationType(option.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                notificationType === option.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span>{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.todos.notifications.messageLabel} ({t.todos.notifications.optional})
        </label>
        <input
          type="text"
          placeholder={t.todos.notifications.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
          {editingNotification ? t.todos.notifications.update : t.todos.notifications.add}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {t.common.cancel}
          </Button>
        )}
      </div>
    </form>
  );
}

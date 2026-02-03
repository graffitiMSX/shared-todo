'use client';

import { useTodoNotifications, useDeleteNotification, type TodoNotification } from '@/lib/hooks/useNotifications';
import { useNotificationSync } from '@/lib/hooks/useNotificationSync';
import { useLanguage } from '@/lib/providers/language-provider';

interface NotificationDisplayProps {
  todoId: string;
  onEdit?: (notification: TodoNotification) => void;
}

export function NotificationDisplay({ todoId, onEdit }: NotificationDisplayProps) {
  const { t } = useLanguage();
  const { data: notifications = [], isLoading } = useTodoNotifications(todoId);
  const deleteNotification = useDeleteNotification();
  const { cancelNativeNotification } = useNotificationSync();

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500 text-center py-2">
        Loading reminders...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-2">
        {t.todos.notifications.empty}
      </div>
    );
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'push':
        return '📲';
      case 'both':
        return '🔔';
      default:
        return '⏰';
    }
  };

  const handleDelete = async (notification: TodoNotification) => {
    try {
      // Cancel native notification first
      await cancelNativeNotification(notification.id);

      // Then delete from database
      await deleteNotification.mutateAsync({
        id: notification.id,
        todoId: notification.todo_id,
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 p-3 rounded-lg ${
            notification.sent ? 'bg-gray-100' : 'bg-emerald-50'
          }`}
        >
          <span className="text-xl">{getTypeIcon(notification.notification_type)}</span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${notification.sent ? 'text-gray-500' : 'text-gray-900'}`}>
              {formatDateTime(notification.notify_at)}
            </p>
            {notification.message && (
              <p className="text-xs text-gray-500 truncate">{notification.message}</p>
            )}
            {notification.sent && (
              <span className="text-xs text-emerald-600">✓ Sent</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!notification.sent && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(notification)}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Edit
              </button>
            )}
            <button
              type="button"
              onClick={() => handleDelete(notification)}
              disabled={deleteNotification.isPending}
              className="text-sm text-red-600 hover:text-red-700"
            >
              {deleteNotification.isPending ? '...' : 'Remove'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

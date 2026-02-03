import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  isNotificationsSupported,
  requestNotificationPermissions,
  checkNotificationPermissions,
  scheduleNotification,
  cancelNotification,
  setupNotificationListeners,
  registerNotificationActions,
  uuidToNotificationId,
} from '@/lib/capacitor/notifications';
import type { TodoNotification } from './useNotifications';

/**
 * Hook to manage native notification permissions and scheduling
 */
export function useNativeNotifications() {
  const router = useRouter();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      const supported = isNotificationsSupported();
      setIsSupported(supported);

      if (supported) {
        // Register action types
        await registerNotificationActions();

        // Check current permissions
        const granted = await checkNotificationPermissions();
        setPermissionGranted(granted);
      }
    };

    init();
  }, []);

  // Set up notification action listeners
  useEffect(() => {
    if (!isSupported) return;

    const cleanup = setupNotificationListeners((todoId) => {
      // Navigate to the specific todo when notification is tapped
      router.push(`/todos?highlight=${todoId}`);
    });

    return cleanup;
  }, [isSupported, router]);

  // Request permissions
  const requestPermissions = useCallback(async () => {
    const granted = await requestNotificationPermissions();
    setPermissionGranted(granted);
    return granted;
  }, []);

  // Schedule a notification from a TodoNotification record
  const scheduleFromReminder = useCallback(
    async (reminder: TodoNotification, todoTitle: string) => {
      if (!isSupported || !permissionGranted) {
        return false;
      }

      const notifyAt = new Date(reminder.notify_at);

      // Don't schedule if already in the past
      if (notifyAt <= new Date()) {
        console.log('Notification time is in the past, skipping');
        return false;
      }

      return scheduleNotification({
        id: uuidToNotificationId(reminder.id),
        title: `Reminder: ${todoTitle}`,
        body: reminder.message || `Don't forget about your todo!`,
        scheduledAt: notifyAt,
        todoId: reminder.todo_id,
      });
    },
    [isSupported, permissionGranted]
  );

  // Cancel a scheduled notification
  const cancelReminder = useCallback(
    async (reminderId: string) => {
      if (!isSupported) return false;

      return cancelNotification(uuidToNotificationId(reminderId));
    },
    [isSupported]
  );

  return {
    isSupported,
    permissionGranted,
    requestPermissions,
    scheduleFromReminder,
    cancelReminder,
  };
}

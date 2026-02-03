'use client';

import { useEffect, useCallback } from 'react';
import { useCapacitor } from '@/lib/providers/capacitor-provider';
import {
  scheduleNotification,
  cancelNotification,
  uuidToNotificationId,
} from '@/lib/capacitor/notifications';
import type { TodoNotification } from './useNotifications';

/**
 * Hook to sync a todo's reminders with native notifications
 * Call this hook in components that manage notifications
 */
export function useNotificationSync() {
  const { notificationsSupported, notificationsPermitted, requestNotificationPermission } =
    useCapacitor();

  /**
   * Schedule a native notification for a reminder
   */
  const scheduleNativeNotification = useCallback(
    async (reminder: TodoNotification, todoTitle: string): Promise<boolean> => {
      // Skip if notifications not supported or not the right type
      if (!notificationsSupported) {
        return false;
      }

      // Only schedule for 'local' or 'both' types
      if (reminder.notification_type === 'push') {
        // Push-only notifications will be handled by server
        return false;
      }

      // Request permission if not granted
      if (!notificationsPermitted) {
        const granted = await requestNotificationPermission();
        if (!granted) {
          console.log('Notification permission denied');
          return false;
        }
      }

      const notifyAt = new Date(reminder.notify_at);

      // Don't schedule if already in the past or already sent
      if (notifyAt <= new Date() || reminder.sent) {
        console.log('Notification time is in the past or already sent');
        return false;
      }

      return scheduleNotification({
        id: uuidToNotificationId(reminder.id),
        title: `⏰ Reminder: ${todoTitle}`,
        body: reminder.message || `Don't forget about your todo!`,
        scheduledAt: notifyAt,
        todoId: reminder.todo_id,
      });
    },
    [notificationsSupported, notificationsPermitted, requestNotificationPermission]
  );

  /**
   * Cancel a native notification for a reminder
   */
  const cancelNativeNotification = useCallback(
    async (reminderId: string): Promise<boolean> => {
      if (!notificationsSupported) {
        return false;
      }

      return cancelNotification(uuidToNotificationId(reminderId));
    },
    [notificationsSupported]
  );

  /**
   * Sync multiple reminders with native notifications
   */
  const syncNotifications = useCallback(
    async (reminders: TodoNotification[], todoTitle: string) => {
      if (!notificationsSupported) return;

      for (const reminder of reminders) {
        if (!reminder.sent) {
          await scheduleNativeNotification(reminder, todoTitle);
        }
      }
    },
    [notificationsSupported, scheduleNativeNotification]
  );

  return {
    isSupported: notificationsSupported,
    isPermitted: notificationsPermitted,
    requestPermission: requestNotificationPermission,
    scheduleNativeNotification,
    cancelNativeNotification,
    syncNotifications,
  };
}

import { Capacitor } from '@capacitor/core';
import {
  LocalNotifications,
  ScheduleOptions,
  LocalNotificationSchema,
  ActionPerformed,
} from '@capacitor/local-notifications';
import { isNativePlatform } from './native';

/**
 * Check if local notifications are supported
 */
export const isNotificationsSupported = () => {
  return isNativePlatform() && Capacitor.isPluginAvailable('LocalNotifications');
};

/**
 * Request notification permissions
 * Returns true if granted, false otherwise
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!isNotificationsSupported()) {
    console.log('Notifications not supported on this platform');
    return false;
  }

  try {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Check if notification permissions are granted
 */
export const checkNotificationPermissions = async (): Promise<boolean> => {
  if (!isNotificationsSupported()) {
    return false;
  }

  try {
    const result = await LocalNotifications.checkPermissions();
    return result.display === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

/**
 * Schedule a local notification for a todo reminder
 */
export const scheduleNotification = async (options: {
  id: number;
  title: string;
  body: string;
  scheduledAt: Date;
  todoId: string;
  extra?: Record<string, string>;
}): Promise<boolean> => {
  if (!isNotificationsSupported()) {
    console.log('Notifications not supported, skipping schedule');
    return false;
  }

  const hasPermission = await checkNotificationPermissions();
  if (!hasPermission) {
    const granted = await requestNotificationPermissions();
    if (!granted) {
      console.log('Notification permissions not granted');
      return false;
    }
  }

  try {
    const notification: LocalNotificationSchema = {
      id: options.id,
      title: options.title,
      body: options.body,
      schedule: {
        at: options.scheduledAt,
        allowWhileIdle: true,
      },
      sound: 'default',
      smallIcon: 'ic_stat_icon_config_sample',
      largeIcon: 'ic_launcher',
      actionTypeId: 'OPEN_TODO',
      extra: {
        todoId: options.todoId,
        ...options.extra,
      },
    };

    const scheduleOptions: ScheduleOptions = {
      notifications: [notification],
    };

    await LocalNotifications.schedule(scheduleOptions);
    console.log(`Notification scheduled for ${options.scheduledAt}`);
    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
};

/**
 * Cancel a scheduled notification by ID
 */
export const cancelNotification = async (id: number): Promise<boolean> => {
  if (!isNotificationsSupported()) {
    return false;
  }

  try {
    await LocalNotifications.cancel({ notifications: [{ id }] });
    console.log(`Notification ${id} cancelled`);
    return true;
  } catch (error) {
    console.error('Error cancelling notification:', error);
    return false;
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<boolean> => {
  if (!isNotificationsSupported()) {
    return false;
  }

  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
    console.log('All notifications cancelled');
    return true;
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
    return false;
  }
};

/**
 * Get all pending notifications
 */
export const getPendingNotifications = async () => {
  if (!isNotificationsSupported()) {
    return [];
  }

  try {
    const result = await LocalNotifications.getPending();
    return result.notifications;
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    return [];
  }
};

/**
 * Convert database notification ID (UUID) to numeric ID for local notifications
 * Uses a hash function to generate a consistent numeric ID
 */
export const uuidToNotificationId = (uuid: string): number => {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

/**
 * Set up notification action listeners
 * Call this early in the app lifecycle
 */
export const setupNotificationListeners = (
  onNotificationAction?: (todoId: string) => void
) => {
  if (!isNotificationsSupported()) {
    return () => {};
  }

  // Listen for notification taps
  const actionListener = LocalNotifications.addListener(
    'localNotificationActionPerformed',
    (notification: ActionPerformed) => {
      console.log('Notification action performed:', notification);

      const todoId = notification.notification.extra?.todoId;
      if (todoId && onNotificationAction) {
        onNotificationAction(todoId);
      }
    }
  );

  // Listen for notification received while app is in foreground
  const receivedListener = LocalNotifications.addListener(
    'localNotificationReceived',
    (notification) => {
      console.log('Notification received:', notification);
    }
  );

  // Return cleanup function
  return () => {
    actionListener.then((l) => l.remove());
    receivedListener.then((l) => l.remove());
  };
};

/**
 * Register notification action types
 */
export const registerNotificationActions = async () => {
  if (!isNotificationsSupported()) {
    return;
  }

  try {
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'OPEN_TODO',
          actions: [
            {
              id: 'view',
              title: 'View Todo',
            },
            {
              id: 'dismiss',
              title: 'Dismiss',
              destructive: true,
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error('Error registering notification actions:', error);
  }
};

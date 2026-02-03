// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/providers/auth-provider';

export interface TodoNotification {
  id: string;
  todo_id: string;
  user_id: string;
  notify_at: string;
  notification_type: 'local' | 'push' | 'both';
  message: string | null;
  sent: boolean;
  created_at: string;
}

export type ReminderPreset = '15min' | '1hour' | '1day' | 'custom';

export function useTodoNotifications(todoId: string) {
  const { user } = useAuth();
  const supabase = createClient();

  return useQuery({
    queryKey: ['todo-notifications', todoId, user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('todo_notifications')
        .select('*')
        .eq('todo_id', todoId)
        .eq('user_id', user.id)
        .order('notify_at', { ascending: true });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return (data || []) as TodoNotification[];
    },
    enabled: !!user && !!todoId,
  });
}

export function useAddNotification() {
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationData: {
      todo_id: string;
      notify_at: string;
      notification_type?: 'local' | 'push' | 'both';
      message?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('todo_notifications')
        .insert({
          todo_id: notificationData.todo_id,
          user_id: user.id,
          notify_at: notificationData.notify_at,
          notification_type: notificationData.notification_type || 'local',
          message: notificationData.message || null,
          sent: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding notification:', error);
        throw new Error(`Failed to add notification: ${error.message}`);
      }

      return data as TodoNotification;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todo-notifications', variables.todo_id] });
    },
  });
}

export function useUpdateNotification() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      todoId,
      ...updates
    }: {
      id: string;
      todoId: string;
      notify_at?: string;
      notification_type?: 'local' | 'push' | 'both';
      message?: string;
    }) => {
      const { data, error } = await supabase
        .from('todo_notifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating notification:', error);
        throw new Error(`Failed to update notification: ${error.message}`);
      }

      return data as TodoNotification;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todo-notifications', variables.todoId] });
    },
  });
}

export function useDeleteNotification() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, todoId }: { id: string; todoId: string }) => {
      const { error } = await supabase
        .from('todo_notifications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting notification:', error);
        throw new Error(`Failed to delete notification: ${error.message}`);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todo-notifications', variables.todoId] });
    },
  });
}

// Helper function to calculate notification time from preset
export function calculateNotifyAt(dueDate: string, dueTime: string | null, preset: ReminderPreset, customMinutes?: number): string {
  // Combine date and time
  let dateTimeStr = dueDate;
  if (dueTime) {
    dateTimeStr = `${dueDate}T${dueTime}`;
  } else {
    // If no time, default to 9:00 AM
    dateTimeStr = `${dueDate}T09:00`;
  }

  const dueDateTime = new Date(dateTimeStr);

  let minutesBefore = 0;
  switch (preset) {
    case '15min':
      minutesBefore = 15;
      break;
    case '1hour':
      minutesBefore = 60;
      break;
    case '1day':
      minutesBefore = 60 * 24;
      break;
    case 'custom':
      minutesBefore = customMinutes || 0;
      break;
  }

  const notifyAt = new Date(dueDateTime.getTime() - minutesBefore * 60 * 1000);
  return notifyAt.toISOString();
}

// Helper to get human-readable reminder description
export function getReminderDescription(notifyAt: string, dueDate: string, dueTime: string | null): string {
  const notifyDate = new Date(notifyAt);
  const now = new Date();

  // Format the notification time
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };

  return notifyDate.toLocaleDateString('en-US', options);
}

// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/providers/auth-provider';

export interface Participant {
  id: string;
  user_id: string;
  role: 'owner' | 'viewer';
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  email?: string;
  avatar_url: string | null;
}

// Get participants for a specific todo
export function useTodoParticipants(todoId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['todo-participants', todoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todo_participants')
        .select(`
          id,
          user_id,
          role,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq('todo_id', todoId);

      if (error) throw error;
      return data as Participant[];
    },
    enabled: !!todoId,
  });
}

// Search for users to add as participants
export function useSearchUsers(searchQuery: string) {
  const { user } = useAuth();
  const supabase = createClient();

  return useQuery({
    queryKey: ['search-users', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .neq('id', user?.id) // Exclude current user
        .or(`display_name.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: searchQuery.length >= 2,
  });
}

// Add participant to todo
export function useAddParticipant() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      todoId,
      userId,
      role = 'viewer',
    }: {
      todoId: string;
      userId: string;
      role?: 'owner' | 'viewer';
    }) => {
      const { data, error } = await supabase
        .from('todo_participants')
        .insert({
          todo_id: todoId,
          user_id: userId,
          role,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todo-participants', variables.todoId] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

// Remove participant from todo
export function useRemoveParticipant() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      todoId,
      userId,
    }: {
      todoId: string;
      userId: string;
    }) => {
      const { error } = await supabase
        .from('todo_participants')
        .delete()
        .eq('todo_id', todoId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todo-participants', variables.todoId] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

// Update participant role
export function useUpdateParticipantRole() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      todoId,
      userId,
      role,
    }: {
      todoId: string;
      userId: string;
      role: 'owner' | 'viewer';
    }) => {
      const { data, error } = await supabase
        .from('todo_participants')
        .update({ role })
        .eq('todo_id', todoId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todo-participants', variables.todoId] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

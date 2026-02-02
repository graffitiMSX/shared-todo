// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/providers/auth-provider';

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  due_time: string | null;
  completed: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_owner?: boolean;
}

export function useTodos() {
  const { user } = useAuth();
  const supabase = createClient();

  return useQuery({
    queryKey: ['todos', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get todos where user is a participant
      const { data, error } = await supabase
        .from('todos')
        .select(`
          id,
          title,
          description,
          due_date,
          due_time,
          completed,
          created_by,
          created_at,
          updated_at,
          todo_participants!inner(user_id, role)
        `)
        .eq('todo_participants.user_id', user.id)
        .order('created_at', { ascending: false });

      // Return empty array if error or no data
      if (error) {
        console.error('Error fetching todos:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Add is_owner flag
      const todos = data.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        due_date: todo.due_date,
        due_time: todo.due_time,
        completed: todo.completed,
        created_by: todo.created_by,
        created_at: todo.created_at,
        updated_at: todo.updated_at,
        is_owner: todo.created_by === user.id,
      })) as Todo[];

      return todos;
    },
    enabled: !!user,
  });
}

export function useCreateTodo() {
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoData: {
      title: string;
      description?: string;
      due_date?: string;
      due_time?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Create todo
      // @ts-ignore
      const { data: todo, error: todoError } = await supabase
        .from('todos')
        .insert({
          title: todoData.title,
          description: todoData.description || null,
          due_date: todoData.due_date || null,
          due_time: todoData.due_time || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (todoError) {
        console.error('Error creating todo:', todoError);
        throw new Error(`Failed to create todo: ${todoError.message}`);
      }

      // Add creator as owner participant
      const { error: participantError } = await supabase
        .from('todo_participants')
        .insert({
          todo_id: todo.id,
          user_id: user.id,
          role: 'owner',
        });

      if (participantError) {
        console.error('Error adding participant:', participantError);
        throw new Error(`Failed to add participant: ${participantError.message}`);
      }

      return todo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useUpdateTodo() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      title?: string;
      description?: string;
      due_date?: string | null;
      due_time?: string | null;
      completed?: boolean;
    }) => {
      // @ts-ignore
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useDeleteTodo() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoId: string) => {
      const { error } = await supabase.from('todos').delete().eq('id', todoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useToggleTodo() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      // @ts-ignore
      const { data, error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface ChecklistItem {
  id: string;
  todo_id: string;
  text: string;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export function useChecklistItems(todoId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['checklist-items', todoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todo_checklist_items')
        .select('*')
        .eq('todo_id', todoId)
        .order('position', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching checklist items:', error);
        throw error;
      }

      return (data || []) as ChecklistItem[];
    },
    enabled: !!todoId,
  });
}

export function useAddChecklistItem() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      todo_id,
      text,
      position,
    }: {
      todo_id: string;
      text: string;
      position?: number;
    }) => {
      // @ts-ignore - Supabase types need to be regenerated
      const { data, error } = await supabase.from('todo_checklist_items').insert({
        todo_id,
        text,
        position: position ?? 0,
        completed: false,
      }).select().single();

      if (error) {
        console.error('Error adding checklist item:', error);
        throw error;
      }

      return data as ChecklistItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checklist-items', variables.todo_id] });
    },
  });
}

export function useUpdateChecklistItem() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      todo_id,
      ...updates
    }: {
      id: string;
      todo_id: string;
      text?: string;
      completed?: boolean;
      position?: number;
    }) => {
      // @ts-ignore - Supabase types need to be regenerated
      const { data, error } = await supabase.from('todo_checklist_items').update(updates).eq('id', id).select().single();

      if (error) {
        console.error('Error updating checklist item:', error);
        throw error;
      }

      return data as ChecklistItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checklist-items', variables.todo_id] });
    },
  });
}

export function useDeleteChecklistItem() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, todo_id }: { id: string; todo_id: string }) => {
      const { error } = await supabase
        .from('todo_checklist_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting checklist item:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checklist-items', variables.todo_id] });
    },
  });
}

export function useToggleChecklistItem() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      todo_id,
      completed,
    }: {
      id: string;
      todo_id: string;
      completed: boolean;
    }) => {
      // @ts-ignore - Supabase types need to be regenerated
      const { data, error } = await supabase.from('todo_checklist_items').update({ completed }).eq('id', id).select().single();

      if (error) {
        console.error('Error toggling checklist item:', error);
        throw error;
      }

      return data as ChecklistItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checklist-items', variables.todo_id] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type MetadataType = 'phone' | 'link' | 'address' | 'note';

export interface TodoMetadata {
  id: string;
  todo_id: string;
  type: MetadataType;
  label: string | null;
  value: string;
  created_at: string;
}

export function useTodoMetadata(todoId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['todo-metadata', todoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todo_metadata')
        .select('*')
        .eq('todo_id', todoId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching metadata:', error);
        throw error;
      }

      return (data || []) as TodoMetadata[];
    },
    enabled: !!todoId,
  });
}

export function useAddMetadata() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metadata: {
      todo_id: string;
      type: MetadataType;
      label?: string;
      value: string;
    }) => {
      // @ts-ignore - Supabase types need to be regenerated
      const { data, error } = await supabase.from('todo_metadata').insert({
        todo_id: metadata.todo_id,
        type: metadata.type,
        label: metadata.label || null,
        value: metadata.value,
      }).select().single();

      if (error) {
        console.error('Error adding metadata:', error);
        throw error;
      }

      return data as TodoMetadata;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todo-metadata', variables.todo_id] });
    },
  });
}

export function useUpdateMetadata() {
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
      label?: string;
      value?: string;
    }) => {
      // @ts-ignore - Supabase types need to be regenerated
      const { data, error } = await supabase.from('todo_metadata').update(updates).eq('id', id).select().single();

      if (error) {
        console.error('Error updating metadata:', error);
        throw error;
      }

      return data as TodoMetadata;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todo-metadata', variables.todo_id] });
    },
  });
}

export function useDeleteMetadata() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, todo_id }: { id: string; todo_id: string }) => {
      const { error } = await supabase
        .from('todo_metadata')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting metadata:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todo-metadata', variables.todo_id] });
    },
  });
}

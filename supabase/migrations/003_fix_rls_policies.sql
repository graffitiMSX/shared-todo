-- Fix infinite recursion in todo_participants INSERT policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Owners can add participants" ON todo_participants;

-- Create a new policy that allows:
-- 1. Todo creators to add participants (including themselves)
-- 2. Existing owners to add participants
CREATE POLICY "Todo creators and owners can add participants"
  ON todo_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is the creator of the todo
    EXISTS (
      SELECT 1 FROM todos
      WHERE todos.id = todo_participants.todo_id
      AND todos.created_by = auth.uid()
    )
    OR
    -- Allow if user is already an owner participant
    EXISTS (
      SELECT 1 FROM todo_participants AS tp
      WHERE tp.todo_id = todo_participants.todo_id
      AND tp.user_id = auth.uid()
      AND tp.role = 'owner'
    )
  );

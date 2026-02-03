-- Fix infinite recursion by splitting into two separate policies
-- Drop the combined policy
DROP POLICY IF EXISTS "Todo creators and owners can add participants" ON todo_participants;

-- Policy 1: Allow todo creators to add themselves as first participant
-- This runs when the todo is just created and has no participants yet
CREATE POLICY "Todo creators can add themselves"
  ON todo_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User must be the creator of the todo
    EXISTS (
      SELECT 1 FROM todos
      WHERE todos.id = todo_participants.todo_id
      AND todos.created_by = auth.uid()
    )
    -- AND user is adding themselves
    AND user_id = auth.uid()
  );

-- Policy 2: Allow existing owner participants to add others
-- This runs when there's already at least one owner participant
CREATE POLICY "Existing owners can add participants"
  ON todo_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Check if current user is already an owner (without recursion)
    EXISTS (
      SELECT 1 FROM todo_participants AS existing_participants
      WHERE existing_participants.todo_id = todo_participants.todo_id
      AND existing_participants.user_id = auth.uid()
      AND existing_participants.role = 'owner'
    )
  );

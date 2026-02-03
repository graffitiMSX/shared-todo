-- Fix infinite recursion in todo_participants SELECT policy
-- The problem: the SELECT policy checks todo_participants to verify access to todo_participants

-- Create a SECURITY DEFINER function to check if user is a participant
-- This bypasses RLS to avoid recursion
CREATE OR REPLACE FUNCTION is_todo_participant(p_todo_id UUID, p_user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM todo_participants
    WHERE todo_id = p_todo_id
    AND user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql;

-- Drop the problematic SELECT policy
DROP POLICY IF EXISTS "Users can view participants for their todos" ON todo_participants;

-- Create a new SELECT policy using the SECURITY DEFINER function
CREATE POLICY "Users can view participants for their todos"
  ON todo_participants FOR SELECT
  TO authenticated
  USING (is_todo_participant(todo_id, auth.uid()));

-- Also fix the todos SELECT policy to use the function
DROP POLICY IF EXISTS "Users can view their todos" ON todos;

-- Creator can always see (needed for INSERT RETURNING) OR participants can see
CREATE POLICY "Users can view their todos"
  ON todos FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid()
    OR is_todo_participant(id, auth.uid())
  );

-- Fix the todos UPDATE policy
DROP POLICY IF EXISTS "Owners can update todos" ON todos;

-- Create helper function to check if user is an owner
CREATE OR REPLACE FUNCTION is_todo_owner(p_todo_id UUID, p_user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM todo_participants
    WHERE todo_id = p_todo_id
    AND user_id = p_user_id
    AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql;

CREATE POLICY "Owners can update todos"
  ON todos FOR UPDATE
  TO authenticated
  USING (is_todo_owner(id, auth.uid()))
  WITH CHECK (is_todo_owner(id, auth.uid()));

-- Fix the todos DELETE policy
DROP POLICY IF EXISTS "Owners can delete todos" ON todos;

CREATE POLICY "Owners can delete todos"
  ON todos FOR DELETE
  TO authenticated
  USING (is_todo_owner(id, auth.uid()));

-- Fix todo_participants DELETE policy
DROP POLICY IF EXISTS "Owners can remove participants" ON todo_participants;

CREATE POLICY "Owners can remove participants"
  ON todo_participants FOR DELETE
  TO authenticated
  USING (is_todo_owner(todo_id, auth.uid()));

-- Fix todo_participants INSERT policies (these also cause recursion!)
DROP POLICY IF EXISTS "Todo creators can add themselves" ON todo_participants;
DROP POLICY IF EXISTS "Existing owners can add participants" ON todo_participants;

-- Policy 1: Allow todo creators to add themselves as first participant
CREATE POLICY "Todo creators can add themselves"
  ON todo_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM todos
      WHERE todos.id = todo_participants.todo_id
      AND todos.created_by = auth.uid()
    )
    AND user_id = auth.uid()
  );

-- Policy 2: Allow existing owner participants to add others (use helper function)
CREATE POLICY "Existing owners can add participants"
  ON todo_participants FOR INSERT
  TO authenticated
  WITH CHECK (is_todo_owner(todo_id, auth.uid()));

-- Fix todo_metadata policies
DROP POLICY IF EXISTS "Users can view metadata for their todos" ON todo_metadata;
CREATE POLICY "Users can view metadata for their todos"
  ON todo_metadata FOR SELECT
  TO authenticated
  USING (is_todo_participant(todo_id, auth.uid()));

DROP POLICY IF EXISTS "Participants can add metadata" ON todo_metadata;
CREATE POLICY "Participants can add metadata"
  ON todo_metadata FOR INSERT
  TO authenticated
  WITH CHECK (is_todo_participant(todo_id, auth.uid()));

DROP POLICY IF EXISTS "Participants can update metadata" ON todo_metadata;
CREATE POLICY "Participants can update metadata"
  ON todo_metadata FOR UPDATE
  TO authenticated
  USING (is_todo_participant(todo_id, auth.uid()))
  WITH CHECK (is_todo_participant(todo_id, auth.uid()));

DROP POLICY IF EXISTS "Owners can delete metadata" ON todo_metadata;
CREATE POLICY "Owners can delete metadata"
  ON todo_metadata FOR DELETE
  TO authenticated
  USING (is_todo_owner(todo_id, auth.uid()));

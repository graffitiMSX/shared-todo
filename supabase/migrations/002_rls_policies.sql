-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can view any profile (for participant selection)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Todos policies
-- Users can view todos they participate in
CREATE POLICY "Users can view their todos"
  ON todos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todos.id
      AND todo_participants.user_id = auth.uid()
    )
  );

-- Authenticated users can create todos
CREATE POLICY "Authenticated users can create todos"
  ON todos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Owners can update their todos
CREATE POLICY "Owners can update todos"
  ON todos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todos.id
      AND todo_participants.user_id = auth.uid()
      AND todo_participants.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todos.id
      AND todo_participants.user_id = auth.uid()
      AND todo_participants.role = 'owner'
    )
  );

-- Owners can delete their todos
CREATE POLICY "Owners can delete todos"
  ON todos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todos.id
      AND todo_participants.user_id = auth.uid()
      AND todo_participants.role = 'owner'
    )
  );

-- Todo participants policies
-- Users can view participants for todos they have access to
CREATE POLICY "Users can view participants for their todos"
  ON todo_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_participants AS tp
      WHERE tp.todo_id = todo_participants.todo_id
      AND tp.user_id = auth.uid()
    )
  );

-- Owners can add participants
CREATE POLICY "Owners can add participants"
  ON todo_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM todo_participants AS tp
      WHERE tp.todo_id = todo_participants.todo_id
      AND tp.user_id = auth.uid()
      AND tp.role = 'owner'
    )
  );

-- Owners can remove participants
CREATE POLICY "Owners can remove participants"
  ON todo_participants FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_participants AS tp
      WHERE tp.todo_id = todo_participants.todo_id
      AND tp.user_id = auth.uid()
      AND tp.role = 'owner'
    )
  );

-- Todo metadata policies
-- Users can view metadata for todos they have access to
CREATE POLICY "Users can view metadata for their todos"
  ON todo_metadata FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todo_metadata.todo_id
      AND todo_participants.user_id = auth.uid()
    )
  );

-- Participants can add metadata
CREATE POLICY "Participants can add metadata"
  ON todo_metadata FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todo_metadata.todo_id
      AND todo_participants.user_id = auth.uid()
    )
  );

-- Participants can update metadata
CREATE POLICY "Participants can update metadata"
  ON todo_metadata FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todo_metadata.todo_id
      AND todo_participants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todo_metadata.todo_id
      AND todo_participants.user_id = auth.uid()
    )
  );

-- Owners can delete metadata
CREATE POLICY "Owners can delete metadata"
  ON todo_metadata FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todo_metadata.todo_id
      AND todo_participants.user_id = auth.uid()
      AND todo_participants.role = 'owner'
    )
  );

-- Todo notifications policies
-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON todo_notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own notification settings
CREATE POLICY "Users can create their own notifications"
  ON todo_notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update their own notifications"
  ON todo_notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON todo_notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  due_time TIME,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create todo_participants table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS todo_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  todo_id UUID REFERENCES todos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('owner', 'viewer')) DEFAULT 'viewer' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(todo_id, user_id)
);

-- Create todo_metadata table
CREATE TABLE IF NOT EXISTS todo_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  todo_id UUID REFERENCES todos(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('phone', 'link', 'address', 'note')) NOT NULL,
  label TEXT,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create todo_notifications table
CREATE TABLE IF NOT EXISTS todo_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  todo_id UUID REFERENCES todos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  notify_at TIMESTAMPTZ NOT NULL,
  notification_type TEXT CHECK (notification_type IN ('local', 'push', 'both')) DEFAULT 'local' NOT NULL,
  message TEXT,
  sent BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_created_by ON todos(created_by);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todo_participants_todo_id ON todo_participants(todo_id);
CREATE INDEX IF NOT EXISTS idx_todo_participants_user_id ON todo_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_metadata_todo_id ON todo_metadata(todo_id);
CREATE INDEX IF NOT EXISTS idx_todo_notifications_todo_id ON todo_notifications(todo_id);
CREATE INDEX IF NOT EXISTS idx_todo_notifications_user_id ON todo_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_notifications_notify_at ON todo_notifications(notify_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
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

-- Helper functions to avoid RLS recursion (SECURITY DEFINER bypasses RLS)
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

-- Todos policies
-- Users can view todos they participate in (or created - needed for RETURNING)
CREATE POLICY "Users can view their todos"
  ON todos FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid()  -- Creator can always see (needed for INSERT RETURNING)
    OR is_todo_participant(id, auth.uid())  -- Participants can see
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
  USING (is_todo_owner(id, auth.uid()))
  WITH CHECK (is_todo_owner(id, auth.uid()));

-- Owners can delete their todos
CREATE POLICY "Owners can delete todos"
  ON todos FOR DELETE
  TO authenticated
  USING (is_todo_owner(id, auth.uid()));

-- Todo participants policies
-- Users can view participants for todos they have access to
CREATE POLICY "Users can view participants for their todos"
  ON todo_participants FOR SELECT
  TO authenticated
  USING (is_todo_participant(todo_id, auth.uid()));

-- Split into two policies to avoid infinite recursion
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

-- Policy 2: Allow existing owner participants to add others (use helper function to avoid recursion)
CREATE POLICY "Existing owners can add participants"
  ON todo_participants FOR INSERT
  TO authenticated
  WITH CHECK (is_todo_owner(todo_id, auth.uid()));

-- Owners can remove participants
CREATE POLICY "Owners can remove participants"
  ON todo_participants FOR DELETE
  TO authenticated
  USING (is_todo_owner(todo_id, auth.uid()));

-- Todo metadata policies
-- Users can view metadata for todos they have access to
CREATE POLICY "Users can view metadata for their todos"
  ON todo_metadata FOR SELECT
  TO authenticated
  USING (is_todo_participant(todo_id, auth.uid()));

-- Participants can add metadata
CREATE POLICY "Participants can add metadata"
  ON todo_metadata FOR INSERT
  TO authenticated
  WITH CHECK (is_todo_participant(todo_id, auth.uid()));

-- Participants can update metadata
CREATE POLICY "Participants can update metadata"
  ON todo_metadata FOR UPDATE
  TO authenticated
  USING (is_todo_participant(todo_id, auth.uid()))
  WITH CHECK (is_todo_participant(todo_id, auth.uid()));

-- Owners can delete metadata
CREATE POLICY "Owners can delete metadata"
  ON todo_metadata FOR DELETE
  TO authenticated
  USING (is_todo_owner(todo_id, auth.uid()));

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

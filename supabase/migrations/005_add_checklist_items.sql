-- Create todo_checklist_items table for checklist functionality
CREATE TABLE IF NOT EXISTS todo_checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  todo_id UUID REFERENCES todos(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  position INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_checklist_items_todo_id ON todo_checklist_items(todo_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_position ON todo_checklist_items(todo_id, position);

-- Create trigger for updated_at
CREATE TRIGGER update_checklist_items_updated_at
  BEFORE UPDATE ON todo_checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE todo_checklist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Same access pattern as todo metadata
-- Users can view checklist items for todos they have access to
CREATE POLICY "Users can view checklist items for their todos"
  ON todo_checklist_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todo_checklist_items.todo_id
      AND todo_participants.user_id = auth.uid()
    )
  );

-- Participants can add checklist items
CREATE POLICY "Participants can add checklist items"
  ON todo_checklist_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todo_checklist_items.todo_id
      AND todo_participants.user_id = auth.uid()
    )
  );

-- Participants can update checklist items (check/uncheck, edit text)
CREATE POLICY "Participants can update checklist items"
  ON todo_checklist_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todo_checklist_items.todo_id
      AND todo_participants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todo_checklist_items.todo_id
      AND todo_participants.user_id = auth.uid()
    )
  );

-- Participants can delete checklist items
CREATE POLICY "Participants can delete checklist items"
  ON todo_checklist_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM todo_participants
      WHERE todo_participants.todo_id = todo_checklist_items.todo_id
      AND todo_participants.user_id = auth.uid()
    )
  );

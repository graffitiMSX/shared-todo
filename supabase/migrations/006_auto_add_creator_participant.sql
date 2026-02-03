-- Automatically add creator as owner participant when todo is created
-- This bypasses RLS issues by using SECURITY DEFINER

-- Create function to add creator as participant
CREATE OR REPLACE FUNCTION add_creator_as_participant()
RETURNS TRIGGER
SECURITY DEFINER -- Runs with elevated privileges, bypassing RLS
AS $$
BEGIN
  -- Add the creator as an owner participant
  INSERT INTO todo_participants (todo_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires after todo insert
DROP TRIGGER IF EXISTS auto_add_creator_participant ON todos;
CREATE TRIGGER auto_add_creator_participant
  AFTER INSERT ON todos
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_as_participant();


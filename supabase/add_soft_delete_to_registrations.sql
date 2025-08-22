-- Add soft delete columns to existing registrations table
-- Run this if you already have a registrations table

-- Add new columns if they don't exist
DO $$ 
BEGIN 
  -- Add cancelled_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'registrations' AND column_name = 'cancelled_at'
  ) THEN 
    ALTER TABLE registrations ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add is_active column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'registrations' AND column_name = 'is_active'
  ) THEN 
    ALTER TABLE registrations ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Update existing records to have is_active = true
UPDATE registrations SET is_active = true WHERE is_active IS NULL;

-- Drop old unique constraint if it exists
DO $$ 
BEGIN 
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'registrations' 
    AND constraint_name = 'unique_user_course_registration'
  ) THEN 
    ALTER TABLE registrations DROP CONSTRAINT unique_user_course_registration;
  END IF;
END $$;

-- Add new unique constraint for active registrations only
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'registrations' 
    AND constraint_name = 'unique_active_user_course_registration'
  ) THEN 
    ALTER TABLE registrations ADD CONSTRAINT unique_active_user_course_registration 
    UNIQUE (user_id, course_id, is_active);
  END IF;
END $$;

-- Add indexes if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_registrations_is_active'
  ) THEN 
    CREATE INDEX idx_registrations_is_active ON registrations(is_active);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_registrations_active_user_course'
  ) THEN 
    CREATE INDEX idx_registrations_active_user_course ON registrations(user_id, course_id) WHERE is_active = true;
  END IF;
END $$;

-- Update the enrollment_details view
CREATE OR REPLACE VIEW enrollment_details AS
SELECT 
  r.id as registration_id,
  r.registered_at,
  r.cancelled_at,
  r.is_active as registration_active,
  u.id as user_id,
  u.student_id,
  u.name as user_name,
  u.phone,
  c.id as course_id,
  c.code as course_code,
  c.name as course_name,
  c.professor,
  c.assistant,
  c.day,
  c.time_slot
FROM registrations r
JOIN users u ON r.user_id = u.id
JOIN courses c ON r.course_id = c.id
WHERE c.is_active = true AND r.is_active = true
ORDER BY c.code, r.registered_at;

-- Update helper functions
CREATE OR REPLACE FUNCTION get_course_enrollment_count(course_code_param VARCHAR)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM registrations r
    JOIN courses c ON r.course_id = c.id
    WHERE c.code = course_code_param 
      AND c.is_active = true 
      AND r.is_active = true
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_user_registered(user_id_param INTEGER, course_code_param VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM registrations r
    JOIN courses c ON r.course_id = c.id
    WHERE r.user_id = user_id_param 
      AND c.code = course_code_param 
      AND c.is_active = true
      AND r.is_active = true
  );
END;
$$ LANGUAGE plpgsql;
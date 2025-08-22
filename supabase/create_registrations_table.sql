-- Registrations table for course enrollment tracking
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id INTEGER NOT NULL,
  course_id UUID NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraints
  CONSTRAINT fk_registrations_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_registrations_course_id 
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Unique constraint to prevent duplicate active registrations
  CONSTRAINT unique_active_user_course_registration 
    UNIQUE (user_id, course_id, is_active)
);

-- Create indexes for better performance
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_course_id ON registrations(course_id);
CREATE INDEX idx_registrations_registered_at ON registrations(registered_at);
CREATE INDEX idx_registrations_is_active ON registrations(is_active);
CREATE INDEX idx_registrations_active_user_course ON registrations(user_id, course_id) WHERE is_active = true;

-- RLS (Row Level Security) policies
-- For course registration system, we need to allow public access
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to anon and authenticated roles
GRANT ALL ON registrations TO anon;
GRANT ALL ON registrations TO authenticated;

-- Grant permissions on the view
GRANT SELECT ON enrollment_details TO anon;
GRANT SELECT ON enrollment_details TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_course_enrollment_count(VARCHAR) TO anon;
GRANT EXECUTE ON FUNCTION get_course_enrollment_count(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION is_user_registered(INTEGER, VARCHAR) TO anon;
GRANT EXECUTE ON FUNCTION is_user_registered(INTEGER, VARCHAR) TO authenticated;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_registrations_updated_at 
  BEFORE UPDATE ON registrations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Helper view for easy enrollment queries with user and course details
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

-- Helper function to get enrollment count for a course
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

-- Helper function to check if user is registered for a course
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
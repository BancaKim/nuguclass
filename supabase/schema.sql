-- Users table (for admin check) - create or modify existing table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(10) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add is_admin column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_admin'
  ) THEN 
    ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Courses table schema for Supabase
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  professor VARCHAR(100) NOT NULL,
  assistant VARCHAR(100) DEFAULT '',
  time_slot VARCHAR(50) NOT NULL,
  day VARCHAR(20) CHECK (day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')) NOT NULL,
  start_time VARCHAR(10) NOT NULL,
  end_time VARCHAR(10) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on course code for better performance
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_day ON courses(day);
CREATE INDEX idx_courses_active ON courses(is_active);

-- RLS (Row Level Security) policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active courses
CREATE POLICY "Allow public read access for active courses" ON courses
  FOR SELECT USING (true);

-- Allow authenticated users full access (admin check will be done at application level)
CREATE POLICY "Allow authenticated full access" ON courses
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow anonymous users read access for active courses
CREATE POLICY "Allow anonymous read access" ON courses
  FOR SELECT USING (is_active = true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_courses_updated_at 
  BEFORE UPDATE ON courses 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password should be hashed in real application)
INSERT INTO users (student_id, password, name, phone, is_admin) VALUES
('admin', 'admin123', '관리자', '02-123-4567', true)
ON CONFLICT (student_id) DO NOTHING;

-- Insert some test users
INSERT INTO users (student_id, password, name, phone, is_admin) VALUES
('S25001', 'password', '김학생', '010-1234-5678', false),
('S25002', 'password', '이학생', '010-2345-6789', false),
('S25003', 'password', '박학생', '010-3456-7890', false)
ON CONFLICT (student_id) DO NOTHING;
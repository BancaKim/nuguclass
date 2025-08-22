import { createClient } from '@supabase/supabase-js'
import type { Course } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface DatabaseUser {
  id?: number
  student_id: string // Format: 1 letter + 5 numbers (e.g., A12345, S25001)
  password: string
  name: string
  phone: string
  created_at?: string
  updated_at?: string
}

// Database types for Supabase courses table
export interface DatabaseCourse {
  id: string
  code: string
  name: string
  professor: string
  assistant: string
  time_slot: string
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
  start_time: string
  end_time: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Convert database course to frontend course type
export const dbCourseToFrontend = (dbCourse: DatabaseCourse): Course => ({
  code: dbCourse.code,
  name: dbCourse.name,
  professor: dbCourse.professor,
  assistant: dbCourse.assistant,
  timeSlot: dbCourse.time_slot,
  day: dbCourse.day,
  startTime: dbCourse.start_time,
  endTime: dbCourse.end_time
})

// Convert frontend course to database format
export const frontendCourseToDb = (course: Course): Omit<DatabaseCourse, 'id' | 'created_at' | 'updated_at' | 'is_active'> => ({
  code: course.code,
  name: course.name,
  professor: course.professor,
  assistant: course.assistant,
  time_slot: course.timeSlot,
  day: course.day,
  start_time: course.startTime,
  end_time: course.endTime
})
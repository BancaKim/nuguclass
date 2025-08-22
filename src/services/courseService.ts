import { supabase, dbCourseToFrontend, frontendCourseToDb } from '../lib/supabase'
import type { Course } from '../types'

export class CourseService {
  // Get all active courses
  static async getAllCourses(): Promise<Course[]> {
    console.log('CourseService - Fetching all courses from Supabase...');
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('day')
      .order('start_time')

    if (error) {
      console.error('CourseService - Error fetching courses:', error);
      throw new Error(`Failed to fetch courses: ${error.message}`)
    }

    console.log('CourseService - Raw data from Supabase:', data);
    const frontendCourses = data.map(dbCourseToFrontend);
    console.log('CourseService - Converted to frontend format:', frontendCourses);
    
    return frontendCourses;
  }

  // Add a new course
  static async addCourse(course: Course): Promise<Course> {
    const dbCourse = frontendCourseToDb(course)
    
    console.log('Adding course:', dbCourse) // 디버깅용
    
    const { data, error } = await supabase
      .from('courses')
      .insert([{ ...dbCourse, is_active: true }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error details:', error) // 자세한 에러 정보
      throw new Error(`Failed to add course: ${error.message}`)
    }

    return dbCourseToFrontend(data)
  }

  // Update an existing course
  static async updateCourse(courseCode: string, updates: Partial<Course>): Promise<Course> {
    const dbUpdates = updates.code ? frontendCourseToDb(updates as Course) : {}
    
    const { data, error } = await supabase
      .from('courses')
      .update(dbUpdates)
      .eq('code', courseCode)
      .eq('is_active', true)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update course: ${error.message}`)
    }

    return dbCourseToFrontend(data)
  }

  // Soft delete a course (set is_active to false)
  static async deleteCourse(courseCode: string): Promise<void> {
    console.log('CourseService - Soft deleting course:', courseCode);
    
    const { error, data } = await supabase
      .from('courses')
      .update({ is_active: false })
      .eq('code', courseCode)
      .select()

    console.log('CourseService - Delete result:', { error, data });

    if (error) {
      console.error('CourseService - Error deleting course:', error);
      throw new Error(`Failed to delete course: ${error.message}`)
    }

    if (!data || data.length === 0) {
      console.warn('CourseService - No course found with code:', courseCode);
      throw new Error(`Course with code ${courseCode} not found`)
    }

    console.log('CourseService - Course soft deleted successfully:', data[0]);
  }

  // Hard delete a course (permanently remove from database)
  static async hardDeleteCourse(courseCode: string): Promise<void> {
    console.log('CourseService - Hard deleting course:', courseCode);
    
    const { error, data } = await supabase
      .from('courses')
      .delete()
      .eq('code', courseCode)
      .select()

    console.log('CourseService - Hard delete result:', { error, data });

    if (error) {
      console.error('CourseService - Error hard deleting course:', error);
      throw new Error(`Failed to hard delete course: ${error.message}`)
    }

    if (!data || data.length === 0) {
      console.warn('CourseService - No course found with code:', courseCode);
      throw new Error(`Course with code ${courseCode} not found`)
    }

    console.log('CourseService - Course hard deleted successfully:', data[0]);
  }

  // Get course by code
  static async getCourseByCode(courseCode: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('code', courseCode)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Course not found
      }
      throw new Error(`Failed to fetch course: ${error.message}`)
    }

    return dbCourseToFrontend(data)
  }

  // Bulk insert courses (useful for initial data migration)
  static async bulkInsertCourses(courses: Course[]): Promise<Course[]> {
    const dbCourses = courses.map(course => ({ ...frontendCourseToDb(course), is_active: true }))
    
    const { data, error } = await supabase
      .from('courses')
      .insert(dbCourses)
      .select()

    if (error) {
      throw new Error(`Failed to bulk insert courses: ${error.message}`)
    }

    return data.map(dbCourseToFrontend)
  }

  // Check if course code already exists
  static async courseExists(courseCode: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('courses')
      .select('code')
      .eq('code', courseCode)
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check course existence: ${error.message}`)
    }

    return !!data
  }
}
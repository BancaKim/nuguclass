import { supabase } from '../lib/supabase'

export interface EnrollmentDetail {
  registration_id: string;
  registered_at: string;
  user_id: number;
  student_id: string;
  user_name: string;
  phone: string;
  course_id: string;
  course_code: string;
  course_name: string;
  professor: string;
  assistant: string;
  day: string;
  time_slot: string;
}

export class RegistrationService {
  // Register a user for a course
  static async registerForCourse(userId: number, courseCode: string): Promise<void> {
    console.log('RegistrationService - Registering user for course:', { userId, courseCode });
    
    // First get the course ID from course code
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('code', courseCode)
      .eq('is_active', true)
      .single();

    if (courseError || !course) {
      console.error('RegistrationService - Course not found:', courseError);
      throw new Error(`Course with code ${courseCode} not found`);
    }

    // Check if already registered (active registration)
    const { data: existing, error: checkError } = await supabase
      .from('registrations')
      .select('id, is_active')
      .eq('user_id', userId)
      .eq('course_id', course.id)
      .eq('is_active', true)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('RegistrationService - Error checking existing registration:', checkError);
      throw new Error(`Error checking registration: ${checkError.message}`);
    }

    if (existing) {
      throw new Error('이미 수강신청된 과목입니다.');
    }

    // Check if there's a previous cancelled registration
    const { data: cancelled, error: cancelledError } = await supabase
      .from('registrations')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', course.id)
      .eq('is_active', false)
      .single();

    if (cancelledError && cancelledError.code !== 'PGRST116') {
      console.error('RegistrationService - Error checking cancelled registration:', cancelledError);
      throw new Error(`Error checking cancelled registration: ${cancelledError.message}`);
    }

    let insertError;
    if (cancelled) {
      // Reactivate the cancelled registration
      const { error } = await supabase
        .from('registrations')
        .update({ 
          is_active: true, 
          registered_at: new Date().toISOString(),
          cancelled_at: null 
        })
        .eq('id', cancelled.id);
      insertError = error;
    } else {
      // Create new registration
      const { error } = await supabase
        .from('registrations')
        .insert([{
          user_id: userId,
          course_id: course.id,
          is_active: true
        }]);
      insertError = error;
    }

    if (insertError) {
      console.error('RegistrationService - Error registering for course:', insertError);
      throw new Error(`Failed to register for course: ${insertError.message}`);
    }

    console.log('RegistrationService - Successfully registered for course');
  }

  // Unregister a user from a course
  static async unregisterFromCourse(userId: number, courseCode: string): Promise<void> {
    console.log('RegistrationService - Unregistering user from course:', { userId, courseCode });
    
    // Get the course ID from course code
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('code', courseCode)
      .eq('is_active', true)
      .single();

    if (courseError || !course) {
      console.error('RegistrationService - Course not found:', courseError);
      throw new Error(`Course with code ${courseCode} not found`);
    }

    // Soft delete the registration
    const { error: updateError } = await supabase
      .from('registrations')
      .update({ 
        is_active: false, 
        cancelled_at: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .eq('course_id', course.id)
      .eq('is_active', true);

    if (updateError) {
      console.error('RegistrationService - Error unregistering from course:', updateError);
      throw new Error(`Failed to unregister from course: ${updateError.message}`);
    }

    console.log('RegistrationService - Successfully unregistered from course');
  }

  // Check if user is registered for a course
  static async isUserRegistered(userId: number, courseCode: string): Promise<boolean> {
    console.log('RegistrationService - Checking if user is registered:', { userId, courseCode });
    
    const { data, error } = await supabase
      .rpc('is_user_registered', { 
        user_id_param: userId, 
        course_code_param: courseCode 
      });

    if (error) {
      console.error('RegistrationService - Error checking registration:', error);
      throw new Error(`Error checking registration: ${error.message}`);
    }

    return data || false;
  }

  // Get all users registered for a specific course
  static async getCourseEnrollments(courseCode: string): Promise<EnrollmentDetail[]> {
    console.log('RegistrationService - Getting course enrollments:', courseCode);
    
    const { data, error } = await supabase
      .from('enrollment_details')
      .select('*')
      .eq('course_code', courseCode)
      .order('registered_at');

    if (error) {
      console.error('RegistrationService - Error fetching enrollments:', error);
      throw new Error(`Failed to fetch enrollments: ${error.message}`);
    }

    return data || [];
  }

  // Get all courses a user is registered for
  static async getUserRegistrations(userId: number): Promise<EnrollmentDetail[]> {
    console.log('RegistrationService - Getting user registrations:', userId);
    
    const { data, error } = await supabase
      .from('enrollment_details')
      .select('*')
      .eq('user_id', userId)
      .order('course_code');

    if (error) {
      console.error('RegistrationService - Error fetching user registrations:', error);
      throw new Error(`Failed to fetch user registrations: ${error.message}`);
    }

    return data || [];
  }

  // Get enrollment count for a course
  static async getCourseEnrollmentCount(courseCode: string): Promise<number> {
    console.log('RegistrationService - Getting enrollment count:', courseCode);
    
    const { data, error } = await supabase
      .rpc('get_course_enrollment_count', { 
        course_code_param: courseCode 
      });

    if (error) {
      console.error('RegistrationService - Error getting enrollment count:', error);
      throw new Error(`Error getting enrollment count: ${error.message}`);
    }

    return data || 0;
  }

  // Get all registrations (for admin purposes)
  static async getAllRegistrations(): Promise<EnrollmentDetail[]> {
    console.log('RegistrationService - Getting all registrations');
    
    const { data, error } = await supabase
      .from('enrollment_details')
      .select('*')
      .order('course_code', { ascending: true })
      .order('registered_at', { ascending: true });

    if (error) {
      console.error('RegistrationService - Error fetching all registrations:', error);
      throw new Error(`Failed to fetch all registrations: ${error.message}`);
    }

    return data || [];
  }

  // Get registration history including cancelled ones (for admin purposes)
  static async getRegistrationHistory(courseCode?: string, userId?: number): Promise<any[]> {
    console.log('RegistrationService - Getting registration history');
    
    let query = supabase
      .from('registrations')
      .select(`
        id,
        registered_at,
        cancelled_at,
        is_active,
        users (
          id,
          student_id,
          name,
          phone
        ),
        courses (
          id,
          code,
          name,
          professor
        )
      `)
      .order('registered_at', { ascending: false });

    if (courseCode) {
      query = query.eq('courses.code', courseCode);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('RegistrationService - Error fetching registration history:', error);
      throw new Error(`Failed to fetch registration history: ${error.message}`);
    }

    return data || [];
  }
}
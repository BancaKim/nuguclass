import { CourseService } from '../services/courseService';
import { courses } from '../data/courses';

// Migration utility to move courses from local data to Supabase
export const migrateCourses = async (): Promise<void> => {
  try {
    console.log('Starting course migration...');
    
    // Check if any courses already exist in the database
    const existingCourses = await CourseService.getAllCourses();
    if (existingCourses.length > 0) {
      console.log(`Found ${existingCourses.length} existing courses in database. Skipping migration.`);
      return;
    }

    // Bulk insert all courses
    const migratedCourses = await CourseService.bulkInsertCourses(courses);
    
    console.log(`Successfully migrated ${migratedCourses.length} courses to Supabase!`);
    console.log('Course migration completed.');
    
  } catch (error) {
    console.error('Course migration failed:', error);
    throw error;
  }
};

// Helper function to check migration status
export const checkMigrationStatus = async (): Promise<{ isComplete: boolean; courseCount: number }> => {
  try {
    const dbCourses = await CourseService.getAllCourses();
    return {
      isComplete: dbCourses.length > 0,
      courseCount: dbCourses.length
    };
  } catch (error) {
    console.error('Failed to check migration status:', error);
    return {
      isComplete: false,
      courseCount: 0
    };
  }
};

// Development helper: Clear all courses from database (use with caution!)
export const clearAllCourses = async (): Promise<void> => {
  try {
    console.log('Warning: This will clear ALL courses from the database!');
    
    const existingCourses = await CourseService.getAllCourses();
    
    for (const course of existingCourses) {
      await CourseService.deleteCourse(course.code);
    }
    
    console.log(`Cleared ${existingCourses.length} courses from database.`);
  } catch (error) {
    console.error('Failed to clear courses:', error);
    throw error;
  }
};
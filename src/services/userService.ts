import { supabase } from '../lib/supabase'
import type { User } from '../types'
import { decrypt } from '../utils/encryption'

export class UserService {
  // Get all users
  static async getAllUsers(): Promise<User[]> {
    console.log('UserService - Fetching all users from Supabase...');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('UserService - Error fetching users:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    console.log('UserService - Raw user data from Supabase:', data);
    
    // Convert database format to frontend format
    const frontendUsers: User[] = data.map(dbUser => {
      let decryptedPhone = '';
      if (dbUser.phone) {
        try {
          decryptedPhone = decrypt(dbUser.phone);
        } catch (error) {
          console.error('Phone decryption failed for user:', dbUser.id, error);
          decryptedPhone = '복호화 실패';
        }
      }

      return {
        id: dbUser.id.toString(),
        studentId: dbUser.student_id,
        name: dbUser.name,
        email: `${dbUser.student_id}@sogang.ac.kr`, // Generate email from student ID
        phone: decryptedPhone,
        batch: dbUser.batch || '',
        isAdmin: dbUser.is_admin || false,
        password: '', // Don't expose password
      };
    });
    
    console.log('UserService - Converted to frontend format:', frontendUsers);
    
    return frontendUsers;
  }

  // Get user by ID
  static async getUserById(userId: number): Promise<User | null> {
    console.log('UserService - Getting user by ID:', userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      console.error('UserService - Error fetching user:', error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    let decryptedPhone = '';
    if (data.phone) {
      try {
        decryptedPhone = decrypt(data.phone);
      } catch (error) {
        console.error('Phone decryption failed for user:', data.id, error);
        decryptedPhone = '복호화 실패';
      }
    }

    return {
      id: data.id.toString(),
      studentId: data.student_id,
      name: data.name,
      email: `${data.student_id}@sogang.ac.kr`,
      phone: decryptedPhone,
      batch: data.batch || '',
      isAdmin: data.is_admin || false,
      password: '',
    };
  }

  // Get user by student ID
  static async getUserByStudentId(studentId: string): Promise<User | null> {
    console.log('UserService - Getting user by student ID:', studentId);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      console.error('UserService - Error fetching user:', error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    let decryptedPhone = '';
    if (data.phone) {
      try {
        decryptedPhone = decrypt(data.phone);
      } catch (error) {
        console.error('Phone decryption failed for user:', data.id, error);
        decryptedPhone = '복호화 실패';
      }
    }

    return {
      id: data.id.toString(),
      studentId: data.student_id,
      name: data.name,
      email: `${data.student_id}@sogang.ac.kr`,
      phone: decryptedPhone,
      batch: data.batch || '',
      isAdmin: data.is_admin || false,
      password: '',
    };
  }

  // Update user
  static async updateUser(userId: number, updates: Partial<User>): Promise<User> {
    console.log('UserService - Updating user:', { userId, updates });
    
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.phone) dbUpdates.phone = updates.phone;
    if (updates.studentId) dbUpdates.student_id = updates.studentId;
    if (updates.batch) dbUpdates.batch = updates.batch;
    if (updates.isAdmin !== undefined) dbUpdates.is_admin = updates.isAdmin;
    if (updates.password) dbUpdates.password = updates.password;
    
    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('UserService - Error updating user:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }

    let decryptedPhone = '';
    if (data.phone) {
      try {
        decryptedPhone = decrypt(data.phone);
      } catch (error) {
        console.error('Phone decryption failed for user:', data.id, error);
        decryptedPhone = '복호화 실패';
      }
    }

    return {
      id: data.id.toString(),
      studentId: data.student_id,
      name: data.name,
      email: `${data.student_id}@sogang.ac.kr`,
      phone: decryptedPhone,
      batch: data.batch || '',
      isAdmin: data.is_admin || false,
    };
  }

  // Delete user
  static async deleteUser(userId: number): Promise<void> {
    console.log('UserService - Deleting user:', userId);
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('UserService - Error deleting user:', error);
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    console.log('UserService - User deleted successfully');
  }

  // Get user count
  static async getUserCount(): Promise<number> {
    console.log('UserService - Getting user count');
    
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('UserService - Error getting user count:', error);
      throw new Error(`Failed to get user count: ${error.message}`);
    }

    return count || 0;
  }

  // Create user (for admin use)
  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    console.log('UserService - Creating user:', userData);
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        student_id: userData.studentId,
        name: userData.name,
        phone: userData.phone,
        password: userData.password,
        is_admin: userData.isAdmin || false
      }])
      .select()
      .single();

    if (error) {
      console.error('UserService - Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return {
      id: data.id.toString(),
      studentId: data.student_id,
      name: data.name,
      email: `${data.student_id}@sogang.ac.kr`,
      phone: data.phone || '',
      batch: data.batch || '',
      isAdmin: data.is_admin || false,
    };
  }
}
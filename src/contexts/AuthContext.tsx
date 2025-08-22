import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import { storageUtils } from '../utils/storage';
import { defaultCredentials } from '../data/users';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = storageUtils.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (studentId: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // First check default credentials for demo accounts
      const credential = defaultCredentials.find(
        cred => cred.studentId === studentId && cred.password === password
      );
      
      if (credential) {
        const users = storageUtils.getUsers();
        const foundUser = users.find(u => u.studentId === studentId);
        
        console.log('Login - Found credential:', credential);
        console.log('Login - All users:', users);
        console.log('Login - Found user:', foundUser);
        
        if (foundUser) {
          console.log('Login - Setting user as admin:', foundUser.isAdmin);
          setUser(foundUser);
          storageUtils.setCurrentUser(foundUser);
          setIsLoading(false);
          return true;
        }
      }

      // Then check Supabase database for registered users
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('student_id', studentId)
        .eq('password', password) // 실제 운영에서는 암호화된 비밀번호와 비교
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Database error:', error);
        setIsLoading(false);
        return false;
      }

      if (dbUser) {
        const user: User = {
          id: dbUser.id.toString(),
          name: dbUser.name,
          studentId: dbUser.student_id,
          email: `${dbUser.student_id}@student.sogang.ac.kr`, // Generate email from student ID
          isAdmin: dbUser.is_admin || false
        };
        
        setUser(user);
        storageUtils.setCurrentUser(user);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    storageUtils.setCurrentUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
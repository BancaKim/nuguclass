import type { User, Registration } from '../types';
import { defaultUsers } from '../data/users';

const USERS_KEY = 'sogang_users';
const REGISTRATIONS_KEY = 'sogang_registrations';
const CURRENT_USER_KEY = 'sogang_current_user';

export const storageUtils = {
  // User management
  getUsers(): User[] {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Registration management
  getRegistrations(): Registration[] {
    const stored = localStorage.getItem(REGISTRATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveRegistrations(registrations: Registration[]): void {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
  },

  addRegistration(userId: string, courseCode: string): void {
    const registrations = this.getRegistrations();
    const newRegistration: Registration = {
      id: Date.now().toString(),
      userId,
      courseCode,
      registeredAt: new Date()
    };
    registrations.push(newRegistration);
    this.saveRegistrations(registrations);
  },

  removeRegistration(userId: string, courseCode: string): void {
    const registrations = this.getRegistrations();
    const filtered = registrations.filter(
      r => !(r.userId === userId && r.courseCode === courseCode)
    );
    this.saveRegistrations(filtered);
  },

  getUserRegistrations(userId: string): Registration[] {
    const registrations = this.getRegistrations();
    return registrations.filter(r => r.userId === userId);
  },

  getCourseRegistrations(courseCode: string): Registration[] {
    const registrations = this.getRegistrations();
    return registrations.filter(r => r.courseCode === courseCode);
  },

  // Current user session
  getCurrentUser(): User | null {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Clear all data
  clearAll(): void {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(REGISTRATIONS_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
import type { User } from '../types';

export const defaultUsers: User[] = [
  {
    id: '1',
    name: '관리자',
    studentId: 'admin',
    email: 'admin@sogang.ac.kr',
    batch: '관리자',
    isAdmin: true
  },
  {
    id: '2',
    name: '김학생',
    studentId: 'S25001',
    email: 'student1@sogang.ac.kr',
    batch: '72기',
    isAdmin: false
  },
  {
    id: '3',
    name: '이학생',
    studentId: 'S25002',
    email: 'student2@sogang.ac.kr',
    batch: '73기',
    isAdmin: false
  },
  {
    id: '4',
    name: '박학생',
    studentId: 'S25003',
    email: 'student3@sogang.ac.kr',
    batch: '74기',
    isAdmin: false
  }
];

export const defaultCredentials = [
  { studentId: 'admin', password: 'admin123' },
  { studentId: 'S25001', password: 'password' },
  { studentId: 'S25002', password: 'password' },
  { studentId: 'S25003', password: 'password' }
];
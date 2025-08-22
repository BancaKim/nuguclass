export interface User {
  id: string;
  name: string;
  studentId: string;
  email: string;
  isAdmin: boolean;
}

export interface Course {
  code: string;
  name: string;
  professor: string;
  assistant: string;
  timeSlot: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
}

export interface Registration {
  id: string;
  userId: string;
  courseCode: string;
  registeredAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (studentId: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface TimeSlot {
  start: string;
  end: string;
  label: string;
}

export interface DaySchedule {
  [key: string]: Course[];
}
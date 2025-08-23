export interface User {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone?: string; // 핸드폰 번호 (선택사항)
  batch: string; // 기수 (예: 72기)
  isAdmin: boolean;
  password?: string; // 비밀번호 (업데이트 시에만 사용)
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
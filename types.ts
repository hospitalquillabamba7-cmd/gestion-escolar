export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  courseIds?: string[];
  courseHistory?: Course[];
  profilePictureUrl?: string | null;
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  profilePictureUrl?: string | null;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  STUDENTS = 'STUDENTS',
  TEACHERS = 'TEACHERS',
  COURSES = 'COURSES',
  ATTENDANCE = 'ATTENDANCE',
  AI_ASSISTANT = 'AI_ASSISTANT',
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  checkInTime: string; // ISO string for easier state management
  checkOutTime: string | null;
  status: 'Checked In' | 'Checked Out';
}
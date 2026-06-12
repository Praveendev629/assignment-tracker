export interface User {
  _id: string;
  firebaseUid: string;
  gmail: string;
  username: string;
  profilePhoto: string;
  createdAt: string;
}

export interface Student {
  _id: string;
  name: string;
  initial: string;
  createdBy: string;
  createdAt: string;
  assignmentCount?: number;
}

export interface Assignment {
  _id: string;
  studentId: string | Student;
  subject: string;
  assignmentTitle: string;
  marks: number;
  submissionDate: string;
  createdBy: string;
  createdAt: string;
}

export type ThemeKey = 'red' | 'blue' | 'purple' | 'green' | 'orange';

export interface AppTheme {
  key: ThemeKey;
  label: string;
  primary: string;
  gradient: [string, string];
}

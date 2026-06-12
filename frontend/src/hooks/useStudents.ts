import { useState, useCallback } from 'react';
import { Student } from '../types';
import { studentService } from '../services/studentService';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const res = await studentService.getStudents();
      setStudents(res.students ?? []);
    } catch (e: any) { setError(e.message); }
    finally { setIsLoading(false); }
  }, []);

  const deleteStudent = async (id: string) => {
    await studentService.deleteStudent(id);
    setStudents(prev => prev.filter(s => s._id !== id));
  };

  return { students, isLoading, error, fetchStudents, deleteStudent };
};

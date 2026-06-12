import { useState, useCallback } from 'react';
import { Assignment } from '../types';
import { assignmentService } from '../services/assignmentService';

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async (studentId?: string, subject?: string) => {
    setIsLoading(true); setError(null);
    try {
      const res = studentId
        ? await assignmentService.getAssignmentsByStudent(studentId, subject)
        : await assignmentService.getAssignments(subject);
      setAssignments(res.assignments ?? []);
    } catch (e: any) { setError(e.message); }
    finally { setIsLoading(false); }
  }, []);

  return { assignments, isLoading, error, fetchAssignments };
};

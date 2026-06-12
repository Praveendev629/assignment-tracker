import api from './api';

export const assignmentService = {
  createAssignment: (data: { studentId: string; subject: string; assignmentTitle: string; marks: number; submissionDate: string }) =>
    api.post('/assignments', data) as Promise<any>,
  createAssignmentForAll: (data: { subject: string; assignmentTitle: string; marks: number; submissionDate: string }) =>
    api.post('/assignments/all', data) as Promise<any>,
  getAssignments: (subject?: string) =>
    api.get('/assignments', { params: subject ? { subject } : {} }) as Promise<any>,
  getAssignmentsByStudent: (studentId: string, subject?: string) =>
    api.get(`/assignments/student/${studentId}`, { params: subject ? { subject } : {} }) as Promise<any>,
  deleteAssignment: (id: string) => api.delete(`/assignments/${id}`) as Promise<any>,
};

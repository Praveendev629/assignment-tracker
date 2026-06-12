import api from './api';

export const studentService = {
  createStudent: (data: { name: string; initial?: string }) => api.post('/students', data) as Promise<any>,
  getStudents: () => api.get('/students') as Promise<any>,
  getStudent: (id: string) => api.get(`/students/${id}`) as Promise<any>,
  deleteStudent: (id: string) => api.delete(`/students/${id}`) as Promise<any>,
};

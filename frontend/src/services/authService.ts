import api from './api';

export const authService = {
  login: (data: { firebaseToken: string; gmail: string; username?: string; profilePhoto?: string }) =>
    api.post('/auth/login', data) as Promise<any>,
  getProfile: () => api.get('/auth/profile') as Promise<any>,
  updateUsername: (username: string) => api.put('/auth/update-username', { username }) as Promise<any>,
};

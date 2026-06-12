export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

export const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const checkDevPassword = (input: string): boolean => input === 'developer001';

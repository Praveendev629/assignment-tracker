import { AppTheme, ThemeKey } from '../types';

export const themes: Record<ThemeKey, AppTheme> = {
  red:    { key: 'red',    label: 'Red & Black',    primary: '#E53935', gradient: ['#E53935', '#0A0A0A'] },
  blue:   { key: 'blue',   label: 'Blue & Black',   primary: '#1565C0', gradient: ['#1565C0', '#0A0A0A'] },
  purple: { key: 'purple', label: 'Purple & Black',  primary: '#6A1B9A', gradient: ['#6A1B9A', '#0A0A0A'] },
  green:  { key: 'green',  label: 'Green & Black',  primary: '#2E7D32', gradient: ['#2E7D32', '#0A0A0A'] },
  orange: { key: 'orange', label: 'Orange & Black', primary: '#E65100', gradient: ['#E65100', '#0A0A0A'] },
};

export const colors = {
  background: '#0A0A0A',
  surface: '#141414',
  surfaceVariant: '#1E1E1E',
  border: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#666666',
  error: '#CF6679',
  success: '#81C784',
  white: '#FFFFFF',
};

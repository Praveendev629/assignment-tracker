import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppTheme, ThemeKey } from '../types';
import { themes } from '../theme';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: themes.red, setTheme: () => {} });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<AppTheme>(themes.red);

  useEffect(() => {
    AsyncStorage.getItem('app_theme').then(key => {
      if (key && themes[key as ThemeKey]) setThemeState(themes[key as ThemeKey]);
    }).catch(() => {});
  }, []);

  const setTheme = async (key: ThemeKey) => {
    setThemeState(themes[key]);
    await AsyncStorage.setItem('app_theme', key).catch(() => {});
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

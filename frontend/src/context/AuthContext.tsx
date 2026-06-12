import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (firebaseToken: string, gmail: string, username: string, photoURL?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (u: User) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('auth_token');
        const u = await AsyncStorage.getItem('auth_user');
        if (t && u) { setToken(t); setUser(JSON.parse(u)); }
      } catch (e) {
        console.warn('Auth load error:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = async (t: string, u: User) => {
    await AsyncStorage.setItem('auth_token', t);
    await AsyncStorage.setItem('auth_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  /**
   * Sign in (or auto-register) using Google account data.
   * The username is fetched from Google — no manual input needed.
   */
  const signIn = async (
    firebaseToken: string,
    gmail: string,
    username: string,
    photoURL?: string,
  ) => {
    const res = await authService.login({
      firebaseToken,
      gmail,
      username,
      profilePhoto: photoURL,
    });
    await persist(res.token, res.user);
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
    setToken(null);
    setUser(null);
  };

  const updateUser = (u: User) => {
    setUser(u);
    AsyncStorage.setItem('auth_user', JSON.stringify(u)).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { hokApi } from '@/services/hokApi';

interface AuthUser {
  id: string;
  email: string;
  role?: string;
  name?: string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('hok_session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (error) {
        console.error('Failed to parse stored session', error);
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const result = await hokApi.register({
        email,
        password,
        name: [firstName, lastName].filter(Boolean).join(' ').trim() || undefined,
      });

      if (result?.access_token) {
        const session = { user: result.user, token: result.access_token };
        localStorage.setItem('hok_session', JSON.stringify(session));
        setUser(result.user);
        setToken(result.access_token);
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await hokApi.login(email, password);

      if (result?.access_token) {
        const session = { user: result.user, token: result.access_token };
        localStorage.setItem('hok_session', JSON.stringify(session));
        setUser(result.user);
        setToken(result.access_token);
      }

      return { error: null };
    } catch (error: any) {
      console.error('Login failed', error);
      return { error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('hok_session');
    setUser(null);
    setToken(null);
    return { error: null };
  };

  const value = {
    user,
    token,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

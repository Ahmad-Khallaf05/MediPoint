
'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'patient' | 'doctor' | 'pharmacist' | 'laboratory' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  accessCode?: string; // Used for staff/admin login, like a username
  accessPassword?: string; // Password for staff/admin login
  clinicId?: string; // ID of the clinic the staff user is associated with
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, redirectTo?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const mockSessionCheck = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(mockSessionCheck);
  }, []);

  const login = useCallback((userData: User, redirectTo?: string) => {
    setUser(userData);
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      if (userData.role === 'patient') {
        router.push('/dashboard/patient');
      } else if (userData.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else if (userData.role === 'pharmacist') {
        router.push('/dashboard/pharmacist');
      } else if (userData.role === 'laboratory') {
        router.push('/dashboard/laboratory');
      } else if (userData.role === 'admin') {
        router.push('/dashboard/admin');
      }
       else {
        router.push('/');
      }
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

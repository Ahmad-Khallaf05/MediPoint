
'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api';

export type UserRole = 'patient' | 'doctor' | 'pharmacist' | 'laboratory' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  accessCode?: string; // Used for staff/admin login, like a username
  accessPassword?: string; // Password for staff/admin login
  clinicId?: string; // ID of the clinic the staff user is associated with
  token?: string; // API token for authentication
  phone?: string; // Patient phone number
  email?: string; // Staff email
  specialization?: string; // Doctor specialization
  license_number?: string; // Professional license number
  clinic?: any; // Clinic information for staff
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, redirectTo?: string) => void;
  logout: () => void;
  isLoading: boolean;
  patientLogin: (phone: string, password: string) => Promise<void>;
  staffLogin: (accessCode: string, password: string) => Promise<void>;
  patientRegister: (userData: any) => Promise<void>;
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
    // Check for stored token and fetch fresh user data from database
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        
        if (storedToken) {
          // Fetch fresh user data from backend
          const userData = await apiService.getProfile(storedToken);
          setUser({ ...userData, token: storedToken });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback((userData: User, redirectTo?: string) => {
    setUser(userData);
    
    // Store only token in localStorage, user data will be fetched from database
    if (userData.token) {
      localStorage.setItem('auth_token', userData.token);
    }
    
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
      } else {
        router.push('/');
      }
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      if (user?.token) {
        await apiService.logout(user.token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('auth_token');
      router.push('/login');
    }
  }, [user, router]);

  const patientLogin = useCallback(async (phone: string, password: string) => {
    try {
      const response = await apiService.patientLogin(phone, password);
      const userData: User = {
        id: response.user.id,
        name: response.user.name,
        role: response.user.role as UserRole,
        phone: response.user.phone,
        token: response.token,
      };
      login(userData);
    } catch (error) {
      throw error;
    }
  }, [login]);

  const staffLogin = useCallback(async (accessCode: string, password: string) => {
    try {
      const response = await apiService.staffLogin(accessCode, password);
      const userData: User = {
        id: response.user.id,
        name: response.user.name,
        role: response.user.role as UserRole,
        accessCode: response.user.access_code,
        clinicId: response.user.clinic_id,
        token: response.token,
      };
      login(userData);
    } catch (error) {
      throw error;
    }
  }, [login]);

  const patientRegister = useCallback(async (userData: any) => {
    try {
      const response = await apiService.patientRegister(userData);
      const user: User = {
        id: response.user.id,
        name: response.user.name,
        role: response.user.role as UserRole,
        phone: response.user.phone,
        token: response.token,
      };
      login(user);
    } catch (error) {
      throw error;
    }
  }, [login]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      patientLogin, 
      staffLogin, 
      patientRegister 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

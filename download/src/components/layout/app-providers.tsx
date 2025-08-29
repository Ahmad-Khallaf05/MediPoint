
'use client';

import type { ReactNode } from 'react';
import { LanguageProvider } from '@/context/language-context';
import { AuthProvider } from '@/context/auth-context';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>{children}</AuthProvider>
    </LanguageProvider>
  );
}

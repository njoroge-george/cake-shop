'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeContextProvider } from '@/contexts/ThemeContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeContextProvider>
        {children}
      </ThemeContextProvider>
    </SessionProvider>
  );
}

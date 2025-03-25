'use client';

import { usePathname } from 'next/navigation';
import { MainLayout } from './main-layout';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
} 
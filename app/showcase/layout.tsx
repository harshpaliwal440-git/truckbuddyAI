import React from 'react';
import { AdminPlatformProvider } from '@/lib/admin-store';

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminPlatformProvider>{children}</AdminPlatformProvider>;
}

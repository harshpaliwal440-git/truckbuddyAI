import React from 'react';
import { AdminPlatformProvider } from '@/lib/admin-store';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPlatformProvider>
      <AdminShell>{children}</AdminShell>
    </AdminPlatformProvider>
  );
}

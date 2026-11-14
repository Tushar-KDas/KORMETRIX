import React from 'react';
import { SuperAdminSidebar } from '@/components/layout/super-admin-sidebar';
import { SuperAdminHeader } from '@/components/layout/super-admin-header';
import { RoleGuard } from '@/components/auth/role-guard';

export default function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FB] dark:bg-[#101827]">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <SuperAdminHeader />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <RoleGuard allowedRoles={['super_admin']} requiredRoleLabel="Platform Super Admin">
            {children}
          </RoleGuard>
        </main>
      </div>
    </div>
  );
}

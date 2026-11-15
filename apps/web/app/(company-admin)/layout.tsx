import React from 'react';
import { CompanyAdminSidebar } from '@/components/layout/company-admin-sidebar';
import { CompanyAdminHeader } from '@/components/layout/company-admin-header';
import { RoleGuard } from '@/components/auth/role-guard';
import { SidebarProvider } from '@/lib/sidebar-context';

export default function CompanyAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[#F5F7FB] dark:bg-[#101827]">
        <CompanyAdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <CompanyAdminHeader />
          <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 space-y-4 sm:space-y-6">
            <RoleGuard allowedRoles={['company_admin', 'super_admin']} requiredRoleLabel="Company Admin or Super Admin">
              {children}
            </RoleGuard>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

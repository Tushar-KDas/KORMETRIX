import React from 'react';
import { EmployeeSidebar } from '@/components/layout/employee-sidebar';
import { EmployeeHeader } from '@/components/layout/employee-header';
import { SidebarProvider } from '@/lib/sidebar-context';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[#F5F7FB] dark:bg-[#101827]">
        <EmployeeSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <EmployeeHeader />
          <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 space-y-4 sm:space-y-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

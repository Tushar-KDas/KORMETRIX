import React from 'react';
import { EmployeeSidebar } from '@/components/layout/employee-sidebar';
import { EmployeeHeader } from '@/components/layout/employee-header';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FB] dark:bg-[#101827]">
      <EmployeeSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <EmployeeHeader />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

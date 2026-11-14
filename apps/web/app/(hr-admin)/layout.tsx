import React from 'react';
import { HRAdminSidebar } from '@/components/layout/hr-admin-sidebar';
import { HRAdminHeader } from '@/components/layout/hr-admin-header';

export default function HRAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FB] dark:bg-[#101827]">
      <HRAdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <HRAdminHeader />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

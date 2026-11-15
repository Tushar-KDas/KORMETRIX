import React from 'react';
import { ManagerSidebar } from '@/components/layout/manager-sidebar';
import { ManagerHeader } from '@/components/layout/manager-header';
import { SidebarProvider } from '@/lib/sidebar-context';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[#F5F7FB] dark:bg-[#101827]">
        <ManagerSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ManagerHeader />
          <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 space-y-4 sm:space-y-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

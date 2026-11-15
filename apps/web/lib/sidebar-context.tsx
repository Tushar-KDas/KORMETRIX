'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  // Mobile drawer
  isMobileOpen: boolean;
  toggleMobile: () => void;
  closeMobile: () => void;
  openMobile: () => void;

  // Desktop/Global sidebar visibility (Focus / Fullscreen Mode)
  isSidebarHidden: boolean;
  toggleSidebar: () => void;
  setSidebarHidden: (val: boolean) => void;

  // Dashboard options / widgets toggle
  hideDashboardOptions: boolean;
  toggleDashboardOptions: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [hideDashboardOptions, setHideDashboardOptions] = useState(false);

  // Close mobile drawer on route change or screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);
  const openMobile = () => setIsMobileOpen(true);

  const toggleSidebar = () => setIsSidebarHidden((prev) => !prev);
  const setSidebarHidden = (val: boolean) => setIsSidebarHidden(val);

  const toggleDashboardOptions = () => setHideDashboardOptions((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isMobileOpen,
        toggleMobile,
        closeMobile,
        openMobile,
        isSidebarHidden,
        toggleSidebar,
        setSidebarHidden,
        hideDashboardOptions,
        toggleDashboardOptions,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    // Provide safe fallback if used outside provider
    return {
      isMobileOpen: false,
      toggleMobile: () => {},
      closeMobile: () => {},
      openMobile: () => {},
      isSidebarHidden: false,
      toggleSidebar: () => {},
      setSidebarHidden: () => {},
      hideDashboardOptions: false,
      toggleDashboardOptions: () => {},
    };
  }
  return context;
}

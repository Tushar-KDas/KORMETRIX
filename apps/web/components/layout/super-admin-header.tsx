'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  ShieldCheck,
  Building2,
  Sliders,
  LogOut,
  Layers,
  Globe,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
} from 'lucide-react';
import { RoleSwitcherModal } from './role-switcher-modal';
import { MobileAppDownloadButton } from '@/components/common/mobile-app-download-button';
import { useCurrentUser } from '@/lib/use-current-user';
import { useSidebar } from '@/lib/sidebar-context';

export function SuperAdminHeader() {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const {
    toggleMobile,
    isSidebarHidden,
    toggleSidebar,
    hideDashboardOptions,
    toggleDashboardOptions,
  } = useSidebar();
  const [isDark, setIsDark] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="h-16 px-3 sm:px-6 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-20 transition-colors gap-2">
      {/* Mobile Hamburger & Focus/Options Toggles */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={toggleMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Open Navigation"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Focus Mode Toggle (Hide/Show Sidebar) */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
          title={isSidebarHidden ? 'Show full sidebar menu' : 'Hide sidebar for focus mode'}
        >
          {isSidebarHidden ? (
            <>
              <PanelLeftOpen className="w-4 h-4 text-[#3758D8]" />
              <span className="hidden xl:inline">Show Menu</span>
            </>
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 text-slate-500" />
              <span className="hidden xl:inline">Hide Menu</span>
            </>
          )}
        </button>

        {/* Dashboard Options Toggle (Hide/Show Dashboard Options) */}
        <button
          type="button"
          onClick={toggleDashboardOptions}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
          title={hideDashboardOptions ? 'Show dashboard options & action widgets' : 'Hide dashboard options for compact view'}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#3758D8]" />
          <span className="hidden sm:inline">
            {hideDashboardOptions ? 'Show Options' : 'Hide Options'}
          </span>
        </button>
      </div>

      {/* Search Bar across all 128 tenants */}
      <div className="relative flex-1 max-w-[160px] sm:max-w-xs md:max-w-md mx-1 sm:mx-2">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search tenants... (Ctrl + K)"
          className="w-full pl-8 sm:pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border-none rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3758D8] transition-all"
        />
        <kbd className="hidden md:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-xs">
          ⌘K
        </kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Switch Role Quick Button */}
        <button
          onClick={() => setShowRoleModal(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-[#3758D8] border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Switch Dashboard</span>
        </button>

        {/* Mobile App Download Button */}
        <MobileAppDownloadButton />

        {/* Global Cluster Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>128 Tenants Online</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Platform Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              2
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white">Platform System Alerts</h4>
                <span className="text-[#3758D8] font-bold cursor-pointer">Clear</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40">
                  <p className="font-bold text-[#3758D8]">New Tenant Provisioned</p>
                  <p className="text-[11px] text-slate-500">Dhaka Logistics Hub (42 Seats) activated starter trial</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                  <p className="font-bold text-emerald-600">MRR Revenue Target Met</p>
                  <p className="text-[11px] text-slate-500">Monthly subscription run-rate surpassed ৳ 2,45,000</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Super Admin User Profile Capsule */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">{currentUser.designation}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-[#3758D8]">
                  {currentUser.department} • {currentUser.employeeCode}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowRoleModal(true);
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  <Layers className="w-4 h-4 text-[#3758D8]" />
                  <span>Switch Role Dashboard</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => router.push('/login/super-admin')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out / Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <RoleSwitcherModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        currentRole="super-admin"
      />
    </header>
  );
}

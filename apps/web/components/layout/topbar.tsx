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
  Check,
  Globe,
  LogOut,
  User,
  Settings,
  Building,
  ShieldCheck,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
} from 'lucide-react';
import { MobileAppDownloadButton } from '@/components/common/mobile-app-download-button';
import { useCurrentUser } from '@/lib/use-current-user';
import { useSidebar } from '@/lib/sidebar-context';

export function Topbar() {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const {
    toggleMobile,
    isSidebarHidden,
    toggleSidebar,
    hideDashboardOptions,
    toggleDashboardOptions,
  } = useSidebar();
  const [locale, setLocale] = useState<'bn' | 'en'>('bn');
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleLanguage = () => {
    setLocale((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    router.push('/login');
  };

  return (
    <header className="h-16 px-3 sm:px-6 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-20 transition-colors gap-2">
      {/* Mobile Hamburger & Focus Mode Toggles */}
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

        {/* Dashboard Options Toggle */}
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

      {/* Search Bar */}
      <div className="relative flex-1 max-w-[160px] sm:max-w-xs md:max-w-md mx-1 sm:mx-2">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={locale === 'bn' ? 'খুঁজুন... (Ctrl + K)' : 'Search anything... (Ctrl + K)'}
          className="w-full pl-8 sm:pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border-none rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3758D8] transition-all"
        />
        <kbd className="hidden md:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-xs">
          ⌘K
        </kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Mobile App Download Button */}
        <MobileAppDownloadButton />

        {/* Bangladesh Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          title="Toggle Language"
        >
          <span className="text-base leading-none">🇧🇩</span>
          <span>{locale === 'bn' ? 'বাংলা' : 'English'}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Notifications</h4>
                <span className="text-xs text-[#3758D8] font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-slate-700 dark:text-slate-300">
                  <p className="font-semibold text-[#3758D8]">Sarah Khan applied for Leave</p>
                  <p className="text-[11px] text-slate-500">Annual Leave for 3 days starting 28 Apr</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-slate-700 dark:text-slate-300">
                  <p className="font-semibold text-emerald-600">Payroll Processed for April</p>
                  <p className="text-[11px] text-slate-500">Total BDT ৳ 2,45,000 ready for review</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-slate-700 dark:text-slate-300">
                  <p className="font-semibold text-amber-600">Late Attendance Alert</p>
                  <p className="text-[11px] text-slate-500">12 employees punched in after grace period</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Capsule with Interactive Dropdown & Logout */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{currentUser.designation}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div className="overflow-hidden">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 text-[#3758D8]">
                    {currentUser.department} • {currentUser.employeeCode}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/platform-admin"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-[#3758D8]" />
                  <span>Super Admin Dashboard</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>Company Admin Dashboard</span>
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span>System Settings</span>
                </Link>
              </div>

              {/* Logout Option in Topbar */}
              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
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
    </header>
  );
}

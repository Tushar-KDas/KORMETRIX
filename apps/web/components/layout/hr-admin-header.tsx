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
  HeartHandshake,
  UserPlus,
  Briefcase,
  LogOut,
  Layers,
  Sparkles,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { RoleSwitcherModal } from './role-switcher-modal';
import { MobileAppDownloadButton } from '@/components/common/mobile-app-download-button';
import { useCurrentUser } from '@/lib/use-current-user';
import { useSidebar } from '@/lib/sidebar-context';

export function HRAdminHeader() {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const { toggleMobile, isSidebarHidden, toggleSidebar } = useSidebar();
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
    <header className="h-16 px-3 sm:px-6 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-20 transition-colors gap-2 sm:gap-4">
      {/* Left: Mobile Menu & Focus Mode */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={toggleMobile}
          aria-label="Toggle Navigation Menu"
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </button>

        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
          title={isSidebarHidden ? 'Show Navigation Menu' : 'Hide Navigation Menu (Full View)'}
        >
          {isSidebarHidden ? (
            <>
              <PanelLeftOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline text-teal-600 dark:text-teal-400">Show Menu</span>
            </>
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline text-slate-600 dark:text-slate-400 font-semibold">Hide Menu</span>
            </>
          )}
        </button>
      </div>

      {/* Search Bar - Responsive */}
      <div className="relative w-28 sm:w-44 md:w-64 lg:w-80 transition-all flex-shrink min-w-0">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search applicants... (Ctrl + K)"
          className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs bg-slate-100 dark:bg-slate-800/80 border-none rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A389] transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        {/* Recruitment Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900/60 text-xs font-bold">
          <Briefcase className="w-3.5 h-3.5 text-[#16A389]" />
          <span>WorkForce 360 Ltd HR</span>
        </div>

        {/* Mobile App Download Button */}
        <MobileAppDownloadButton />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-teal-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              4
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white">People Operations Alerts</h4>
                <span className="text-[#16A389] font-bold cursor-pointer">Clear</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40">
                  <p className="font-bold text-teal-700 dark:text-teal-300">New Applicant Registered</p>
                  <p className="text-[11px] text-slate-500">Nasir Uddin applied for Senior React Developer</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40">
                  <p className="font-bold text-purple-700 dark:text-purple-300">Interview Scheduled</p>
                  <p className="text-[11px] text-slate-500">Technical interview today at 02:30 PM</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* HR Profile Capsule */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-teal-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-[#16A389] font-bold">{currentUser.designation}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950/60 text-teal-700">
                  {currentUser.department} • {currentUser.employeeCode}
                </span>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => router.push('/login')}
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
        currentRole="hr-admin"
      />
    </header>
  );
}

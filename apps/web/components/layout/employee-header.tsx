'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  MapPin,
  Clock,
  Layers,
  LogOut,
  User,
  Settings,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { RoleSwitcherModal } from './role-switcher-modal';
import { MobileAppDownloadButton } from '@/components/common/mobile-app-download-button';
import { useCurrentUser } from '@/lib/use-current-user';
import { useSidebar } from '@/lib/sidebar-context';

export function EmployeeHeader() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const { toggleMobile, isSidebarHidden, toggleSidebar } = useSidebar();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-20 flex-shrink-0 gap-2 sm:gap-4">
        {/* Left: Mobile Menu & Focus Mode */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={toggleMobile}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </button>

          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title={isSidebarHidden ? 'Show Navigation Menu' : 'Hide Navigation Menu (Full View)'}
          >
            {isSidebarHidden ? (
              <>
                <PanelLeftOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline text-blue-600 dark:text-blue-400">Show Menu</span>
              </>
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-slate-500" />
                <span className="hidden md:inline text-slate-600 dark:text-slate-400 font-semibold">Hide Menu</span>
              </>
            )}
          </button>
        </div>

        {/* Search & Geofence Badge */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks, documents..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border-none focus:ring-2 focus:ring-[#3758D8] text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/60 whitespace-nowrap">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>Banani HQ</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile App Download Button */}
          <MobileAppDownloadButton />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">My Notifications</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">3 Unread</span>
                </div>
                <div className="py-2 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                    <p className="font-bold text-slate-800 dark:text-white">Leave Request Approved</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Your manager approved 2 days casual leave for next week.</p>
                    <span className="text-[10px] text-blue-600 font-semibold mt-1 block">5m ago</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <p className="font-bold text-slate-800 dark:text-white">New Task Assigned</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Complete UI Design ticket for KORMETRIX Sprint 4.</p>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">2h ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-[#3758D8]"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">{currentUser.designation}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#3758D8] border border-blue-200 dark:border-blue-800">
                    {currentUser.designation} • {currentUser.employeeId}
                  </span>
                </div>
                <button
                  onClick={() => router.push('/employee')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <User className="w-4 h-4 text-slate-400" /> My Profile
                </button>
                <button
                  onClick={() => router.push('/employee/attendance')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <Clock className="w-4 h-4 text-slate-400" /> My Attendance Log
                </button>
                <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        currentRole="employee"
      />
    </>
  );
}

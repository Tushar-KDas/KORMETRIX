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
  Building2,
  MapPin,
  LogOut,
  Layers,
  Settings,
} from 'lucide-react';
import { RoleSwitcherModal } from './role-switcher-modal';
import { MobileAppDownloadButton } from '@/components/common/mobile-app-download-button';
import { useCurrentUser } from '@/lib/use-current-user';

export function CompanyAdminHeader() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [selectedBranch, setSelectedBranch] = useState('Banani Head Office');
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
    <header className="h-16 px-6 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-20 transition-colors">
      {/* Search Bar */}
      <div className="relative w-72 md:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search employees, departments, projects... (Ctrl + K)"
          className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800/80 border-none rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
        />
      </div>

      {/* Center/Right Controls */}
      <div className="flex items-center gap-3">
        {/* Branch Selector of WorkForce 360 Ltd */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer pr-1"
          >
            <option>WorkForce 360 Ltd • Banani HQ</option>
            <option>WorkForce 360 Ltd • Gulshan Hub</option>
            <option>WorkForce 360 Ltd • Dhanmondi Branch</option>
          </select>
        </div>

        {/* Mobile App Download Button */}
        <MobileAppDownloadButton />

        {/* Switch Role Quick Button */}
        <button
          onClick={() => setShowRoleModal(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Switch Dashboard</span>
        </button>

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
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white">Company Notifications</h4>
                <span className="text-emerald-600 font-bold cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40">
                  <p className="font-bold text-[#3758D8]">Sarah Khan applied for Leave</p>
                  <p className="text-[11px] text-slate-500">Annual Leave for 3 days starting 28 Apr</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                  <p className="font-bold text-emerald-600">April Payroll Calculated</p>
                  <p className="text-[11px] text-slate-500">Total BDT ৳ 2,45,000 ready for bank export</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Company Admin Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-emerald-600 font-bold">WorkForce 360 Ltd</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700">
                  {currentUser.designation} • WorkForce 360 Ltd
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
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Switch Role Dashboard</span>
                </button>
                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span>Company Settings</span>
                </Link>
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
        currentRole="company-admin"
      />
    </header>
  );
}

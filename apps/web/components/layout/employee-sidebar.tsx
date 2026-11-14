'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Clock,
  CalendarCheck,
  CheckSquare,
  Receipt,
  FileText,
  DollarSign,
  Bell,
  LogOut,
  User,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoleSwitcherModal } from './role-switcher-modal';
import { MobileAppDownloadButton } from '@/components/common/mobile-app-download-button';

interface NavItem {
  name: string;
  nameBn: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const employeeNav: NavItem[] = [
  { name: 'My Dashboard', nameBn: 'আমার ড্যাশবোর্ড', href: '/employee', icon: LayoutDashboard },
  { name: 'My Attendance', nameBn: 'আমার উপস্থিতি', href: '/employee/attendance', icon: Clock },
  { name: 'Apply Leave', nameBn: 'ছুটির আবেদন', href: '/employee/leave', icon: CalendarCheck, badge: '14 Days' },
  { name: 'My Tasks', nameBn: 'আমার টাস্ক', href: '/employee/tasks', icon: CheckSquare, badge: '3' },
  { name: 'Payslips & Tax', nameBn: 'পে-স্লিপ ও ট্যাক্স', href: '/employee/payslips', icon: Receipt },
  { name: 'Expense Claims', nameBn: 'খরচের দাবি', href: '/employee/expenses', icon: DollarSign },
  { name: 'My Documents', nameBn: 'আমার ডকুমেন্টস', href: '/employee/documents', icon: FileText },
  { name: 'Notices & Policy', nameBn: 'নোটিশ বোর্ড', href: '/employee/notices', icon: Bell },
];

export function EmployeeSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <aside className="w-64 flex-shrink-0 bg-[#0F172A] text-slate-300 flex flex-col h-screen border-r border-slate-800 select-none z-30">
        {/* Brand Header */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-800/80 bg-[#090D16]">
          <img
            src="/icon.png"
            alt="WorkForce 360"
            className="w-10 h-10 object-contain drop-shadow-md"
          />
          <div>
            <h1 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              WorkForce <span className="text-[#3758D8]">360</span>
            </h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Employee Portal</p>
          </div>
        </div>

        {/* Employee Self-Service Scope Pill */}
        <div className="p-3 mx-3 my-2 rounded-2xl bg-blue-950/40 border border-blue-900/60 flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="text-[10px] font-bold text-blue-400 uppercase block">Signed in as</span>
            <p className="text-xs font-black text-white truncate">Ahmed Rahman (ENG-042)</p>
          </div>
          <button
            onClick={() => setShowRoleModal(true)}
            className="text-[10px] font-bold text-blue-800 bg-white px-2 py-0.5 rounded-full hover:bg-blue-50 transition-colors flex-shrink-0"
          >
            Switch
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Self Service (ESS)</p>
          {employeeNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/employee' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-[#3758D8] text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-blue-400')} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-blue-300'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile App Download Card */}
        <div className="px-3 pb-2">
          <MobileAppDownloadButton variant="sidebar" />
        </div>

        {/* Footer with Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-[#090D16]">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 hover:text-white border border-rose-900/40 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out / লগআউট
          </button>
        </div>
      </aside>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        currentRole="employee"
      />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sign Out of Employee Portal?</h3>
              <p className="text-xs text-slate-500 mt-1">You will be redirected to the secure login gateway.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push('/login')}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

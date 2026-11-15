'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  Briefcase,
  CheckSquare,
  TrendingUp,
  Receipt,
  Monitor,
  FolderLock,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Layers,
  ShieldCheck,
  X,
  PanelLeftClose,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoleSwitcherModal } from './role-switcher-modal';
import { MobileAppDownloadButton } from '@/components/common/mobile-app-download-button';
import { useSidebar } from '@/lib/sidebar-context';

interface NavItem {
  name: string;
  nameBn: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const companyAdminNav: NavItem[] = [
  { name: 'Dashboard', nameBn: 'ড্যাশবোর্ড', href: '/admin', icon: LayoutDashboard },
  { name: 'Organization', nameBn: 'প্রতিষ্ঠান', href: '/admin/organization', icon: Building2 },
  { name: 'Access Requests', nameBn: 'অনবোর্ডিং রিকোয়েস্ট', href: '/admin/access-requests', icon: ShieldCheck, badge: 'NEW' },
  { name: 'Employees', nameBn: 'কর্মী ব্যবস্থাপনা', href: '/admin/employees', icon: Users, badge: '248' },
  { name: 'Attendance', nameBn: 'উপস্থিতি', href: '/admin/attendance', icon: Clock },
  { name: 'Leave', nameBn: 'ছুটি', href: '/admin/leave', icon: CalendarCheck, badge: '4' },
  { name: 'Payroll', nameBn: 'বেতন ও পে-রোল', href: '/admin/payroll', icon: CreditCard },
  { name: 'Projects', nameBn: 'প্রজেক্ট', href: '/admin/projects', icon: Briefcase },
  { name: 'Tasks', nameBn: 'টাস্ক', href: '/admin/tasks', icon: CheckSquare },
  { name: 'Performance', nameBn: 'পারফরম্যান্স', href: '/admin/performance', icon: TrendingUp },
  { name: 'Expenses', nameBn: 'খরচ', href: '/admin/expenses', icon: Receipt },
  { name: 'Assets', nameBn: 'সম্পদ', href: '/admin/assets', icon: Monitor },
  { name: 'Documents', nameBn: 'ডকুমেন্টস', href: '/admin/documents', icon: FolderLock },
  { name: 'Announcements', nameBn: 'যোগাযোগ', href: '/admin/communication', icon: MessageSquare },
  { name: 'Reports', nameBn: 'রিপোর্ট', href: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', nameBn: 'সেটিংস', href: '/admin/settings', icon: Settings },
];

export function CompanyAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isMobileOpen, closeMobile, isSidebarHidden, toggleSidebar } = useSidebar();

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'bg-[#0F172A] text-slate-300 flex flex-col h-screen border-r border-slate-800 select-none z-50 transition-all duration-300 ease-in-out',
          // Mobile Drawer:
          'fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl lg:shadow-none lg:static',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          // Desktop Toggle / Focus Mode:
          isSidebarHidden ? 'lg:hidden' : 'lg:flex lg:w-64 lg:flex-shrink-0'
        )}
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-[#0B1120]">
          <div className="flex items-center gap-3">
            <img
              src="/icon.png"
              alt="WorkForce 360"
              className="w-10 h-10 object-contain drop-shadow-md"
            />
            <div>
              <h1 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
                WorkForce <span className="text-[#10B981]">360</span>
              </h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Company Admin</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={closeMobile}
            className="lg:hidden p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tenant Organization Context Pill */}
        <div className="p-3 mx-3 my-2 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="text-[10px] font-bold text-emerald-400 uppercase block">Single Enterprise</span>
            <p className="text-xs font-black text-white truncate">WorkForce 360 Ltd</p>
          </div>
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-800">
            Banani HQ
          </span>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Company Management</p>
          {companyAdminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-[#10B981] text-white shadow-md shadow-emerald-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-slate-400')} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
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

        {/* Footer & Focus Collapse */}
        <div className="p-3 border-t border-slate-800 bg-[#0B1120]/50 space-y-2">
          {/* Desktop Hide/Collapse Sidebar Action */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex w-full items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-[11px] font-bold text-slate-400 hover:text-slate-200 transition-colors"
            title="Hide navigation sidebar for full dashboard view"
          >
            <span className="flex items-center gap-2">
              <PanelLeftClose className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hide Sidebar (Focus)</span>
            </span>
            <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">Full</span>
          </button>

          <button
            onClick={() => setShowRoleModal(true)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Switch Role
            </span>
            <span>⇄</span>
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all flex items-center justify-center gap-2 text-xs font-bold"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out / Logout</span>
          </button>
        </div>
      </aside>

      <RoleSwitcherModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        currentRole="company-admin"
      />

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] text-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-slate-700 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Log Out from Company Admin?</h3>
              <p className="text-xs text-slate-400">You will be securely returned to login.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => router.push('/login/company-admin')}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors shadow-md shadow-red-600/30"
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

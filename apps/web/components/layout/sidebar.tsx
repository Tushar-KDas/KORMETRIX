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
  Sliders,
  Settings,
  Rocket,
  ShieldCheck,
  UserCheck,
  Smartphone,
  LogOut,
  AlertCircle,
  X,
  PanelLeftClose,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/lib/sidebar-context';
import { MobileAppDownloadButton } from '@/components/common/mobile-app-download-button';

interface NavItem {
  name: string;
  nameBn: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', nameBn: 'ড্যাশবোর্ড', href: '/platform-admin', icon: LayoutDashboard },
  { name: 'Organization', nameBn: 'প্রতিষ্ঠান', href: '/admin/organization', icon: Building2 },
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
  { name: 'Communication', nameBn: 'যোগাযোগ', href: '/admin/communication', icon: MessageSquare },
  { name: 'Reports', nameBn: 'রিপোর্ট', href: '/admin/reports', icon: BarChart3 },
  { name: 'Remote Control', nameBn: 'রিমোট কন্ট্রোল', href: '/platform-admin/remote-control', icon: Sliders },
  { name: 'Settings', nameBn: 'সেটিংস', href: '/admin/settings', icon: Settings },
];

const portalsNav: NavItem[] = [
  { name: 'Manager Portal', nameBn: 'ম্যানেজার পোর্টাল', href: '/manager', icon: UserCheck },
  { name: 'Employee Portal', nameBn: 'কর্মী পোর্টাল', href: '/employee', icon: Smartphone },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isMobileOpen, closeMobile, isSidebarHidden, toggleSidebar } = useSidebar();

  const handleLogout = () => {
    // Clear session and redirect to login
    router.push('/login');
  };

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
              alt="KORMETRIX"
              className="w-10 h-10 object-contain drop-shadow-md"
            />
            <div>
              <h1 className="font-bold text-white text-base tracking-tight flex items-center gap-0.5">
                KORMETRI<span className="text-[#19B89A]">X</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">People. Work. Performance.</p>
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

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Menu</p>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/platform-admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-[#3758D8] text-white shadow-md shadow-blue-600/30 font-semibold'
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

          <div className="pt-4 mt-2 border-t border-slate-800/80">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Dedicated Portals</p>
            {portalsNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Upgrade Banner & Version */}
        <div className="p-4 border-t border-slate-800 bg-[#0B1120]/50 space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-blue-500/20 shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-[#3758D8]" /> Enterprise Plan
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold">Active</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2.5">All features and remote controls enabled.</p>
            <Link
              href="/platform-admin/subscriptions"
              className="block w-full py-1.5 text-center text-xs font-semibold rounded-lg bg-[#3758D8] text-white hover:bg-blue-600 transition-colors shadow-sm"
            >
              Manage Plans
            </Link>
          </div>

          <MobileAppDownloadButton variant="sidebar" />

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex w-full py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors items-center justify-center gap-2 text-xs font-semibold"
            title="Hide sidebar to focus"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
            <span>Hide Sidebar (Focus)</span>
          </button>

          {/* Prominent Logout Button (Matches Mockup Image 4) */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all flex items-center justify-center gap-2 text-xs font-bold shadow-xs group"
          >
            <LogOut className="w-4 h-4 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out / Logout</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure Tenant
            </span>
            <span>v2.0.0</span>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] text-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-slate-700 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Log Out from KORMETRIX?</h3>
              <p className="text-xs text-slate-400">
                You will be securely signed out from this session and returned to the role login page.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={handleLogout}
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

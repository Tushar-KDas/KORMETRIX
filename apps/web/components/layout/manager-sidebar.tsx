'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
  CheckSquare,
  Briefcase,
  TrendingUp,
  LogOut,
  Layers,
  ShieldCheck,
  UserCheck,
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

const managerNav: NavItem[] = [
  { name: 'Manager Overview', nameBn: 'ম্যানেজার ওভারভিউ', href: '/manager', icon: LayoutDashboard },
  { name: 'Access Requests', nameBn: 'অনবোর্ডিং রিকোয়েস্ট', href: '/manager/access-requests', icon: UserCheck, badge: 'NEW' },
  { name: 'My Team', nameBn: 'আমার টিম', href: '/manager/team', icon: Users, badge: '8' },
  { name: 'Team Attendance', nameBn: 'টিম উপস্থিতি', href: '/manager/attendance', icon: Clock },
  { name: 'Leave Approvals', nameBn: 'ছুটি অনুমোদন', href: '/manager/leave', icon: CalendarCheck, badge: '2' },
  { name: 'Task Management', nameBn: 'টাস্ক স্প্রিন্ট', href: '/manager/tasks', icon: CheckSquare, badge: '12' },
  { name: 'Team Projects', nameBn: 'টিম প্রজেক্ট', href: '/manager/projects', icon: Briefcase },
  { name: 'Performance & Goals', nameBn: 'পারফরম্যান্স ও লক্ষ্য', href: '/manager/performance', icon: TrendingUp },
];

export function ManagerSidebar() {
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
          'bg-[#141226] text-slate-300 flex flex-col h-screen border-r border-purple-950 select-none z-50 transition-all duration-300 ease-in-out',
          // Mobile Drawer:
          'fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl lg:shadow-none lg:static',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          // Desktop Toggle / Focus Mode:
          isSidebarHidden ? 'lg:hidden' : 'lg:flex lg:w-64 lg:flex-shrink-0'
        )}
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-purple-900/50 bg-[#0E0C1C]">
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
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Kormetrix Team</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={closeMobile}
            className="lg:hidden p-1.5 rounded-xl bg-purple-900/60 text-slate-400 hover:text-white transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manager Scope Pill */}
        <div className="p-3 mx-3 my-2 rounded-2xl bg-purple-950/40 border border-purple-900/60 flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="text-[10px] font-bold text-purple-400 uppercase block">Department Scope</span>
            <p className="text-xs font-black text-white truncate">Engineering Lead</p>
          </div>
          <button
            onClick={() => setShowRoleModal(true)}
            className="text-[10px] font-bold text-purple-800 bg-white px-2 py-0.5 rounded-full hover:bg-purple-50 transition-colors flex-shrink-0"
          >
            Switch
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Team Operations</p>
          {managerNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/manager' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-purple-950/60 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-purple-400')} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      isActive ? 'bg-white/20 text-white' : 'bg-purple-950 text-purple-300 border border-purple-800'
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
        <div className="p-3 border-t border-purple-900/50 bg-[#0E0C1C] space-y-2">
          {/* Desktop Hide Sidebar Action */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex w-full items-center justify-between p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-[11px] font-bold text-purple-300 hover:text-white transition-colors"
            title="Hide navigation sidebar for full dashboard view"
          >
            <span className="flex items-center gap-2">
              <PanelLeftClose className="w-3.5 h-3.5 text-purple-400" />
              <span>Hide Sidebar (Focus)</span>
            </span>
            <span className="text-[9px] bg-purple-900 px-1.5 py-0.5 rounded text-purple-300 border border-purple-800">Full</span>
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
        currentRole="manager"
      />

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] text-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-slate-700 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Log Out from Manager Portal?</h3>
              <p className="text-xs text-slate-400">You will be safely logged out.</p>
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
                onClick={() => router.push('/login')}
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

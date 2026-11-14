'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Sliders,
  ShieldCheck,
  Activity,
  HardDrive,
  FileText,
  LogOut,
  Layers,
  Sparkles,
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

const superAdminNav: NavItem[] = [
  { name: 'Platform Overview', nameBn: 'প্ল্যাটফর্ম ওভারভিউ', href: '/platform-admin', icon: LayoutDashboard },
  { name: 'Organizations', nameBn: 'প্রতিষ্ঠানসমূহ', href: '/platform-admin/organizations', icon: Building2, badge: '128' },
  { name: 'SaaS Subscriptions', nameBn: 'সাবস্ক্রিপশন ও বিলিং', href: '/platform-admin/subscriptions', icon: CreditCard },
  { name: 'Remote Control & Flags', nameBn: 'রিমোট কন্ট্রোল ও ফ্ল্যাগ', href: '/platform-admin/remote-control', icon: Sliders },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <aside className="w-64 flex-shrink-0 bg-[#0B1120] text-slate-300 flex flex-col h-screen border-r border-slate-800 select-none z-30">
        {/* Brand Header */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-800 bg-[#070D18]">
          <img
            src="/icon.png"
            alt="WorkForce 360"
            className="w-10 h-10 object-contain drop-shadow-md"
          />
          <div>
            <h1 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              WorkForce <span className="text-[#3758D8]">360</span>
            </h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Super Admin Console</p>
          </div>
        </div>

        {/* Role Identity Pill */}
        <div className="p-3 mx-3 my-2 rounded-2xl bg-blue-950/60 border border-blue-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-blue-200">Root Authority</span>
          </div>
          <button
            onClick={() => setShowRoleModal(true)}
            className="text-[10px] font-bold text-[#3758D8] bg-white px-2 py-0.5 rounded-full hover:bg-blue-50 transition-colors"
          >
            Switch
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Platform Engine</p>
          {superAdminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/platform-admin' && pathname.startsWith(item.href));

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
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Workspace Portals</p>
            <button
              onClick={() => setShowRoleModal(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-emerald-400" /> All 5 Role Dashboards
              </span>
              <span>⇄</span>
            </button>
          </div>
        </div>

        {/* Mobile App Download Card */}
        <div className="px-3 pb-2">
          <MobileAppDownloadButton variant="sidebar" />
        </div>

        {/* Footer & Logout */}
        <div className="p-4 border-t border-slate-800 bg-[#070D18]/80 space-y-3">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Multi-Tenant Cloud</span>
            <p className="font-bold text-white flex items-center justify-between">
              <span>Active Clusters:</span>
              <span className="text-emerald-400">4 Nodes Online</span>
            </p>
          </div>

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
        currentRole="super-admin"
      />

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] text-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-slate-700 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Log Out from Super Admin?</h3>
              <p className="text-xs text-slate-400">Session will be terminated securely.</p>
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
                onClick={() => router.push('/login/super-admin')}
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

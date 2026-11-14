'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HeartHandshake,
  Users2,
  UserPlus,
  Briefcase,
  CalendarCheck,
  Clock,
  FolderLock,
  MessageCircleQuestion,
  BarChart3,
  LogOut,
  Layers,
  Sparkles,
  ClipboardList,
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

const hrAdminNav: NavItem[] = [
  { name: 'HR Overview', nameBn: 'এইচআর ওভারভিউ', href: '/hr', icon: HeartHandshake },
  { name: 'Access Requests', nameBn: 'অনবোর্ডিং রিকোয়েস্ট', href: '/hr/access-requests', icon: UserPlus, badge: 'NEW' },
  { name: 'Employee Directory', nameBn: 'কর্মী তালিকা', href: '/hr/employees', icon: Users2, badge: '248' },
  { name: 'Recruitment & Vacancies', nameBn: 'নিয়োগ ও সার্কুলার', href: '/hr/recruitment', icon: Briefcase, badge: '4' },
  { name: 'Onboarding & Checklist', nameBn: 'অনবোর্ডিং', href: '/hr/onboarding', icon: UserPlus, badge: '5' },
  { name: 'Attendance & Roster', nameBn: 'উপস্থিতি ও রোস্টার', href: '/hr/attendance', icon: Clock },
  { name: 'Leave Approvals', nameBn: 'ছুটি অনুমোদন', href: '/hr/leave', icon: CalendarCheck, badge: '4' },
  { name: 'Contracts & Documents', nameBn: 'চুক্তিপত্র ও ডকুমেন্টস', href: '/hr/documents', icon: FolderLock },
  { name: 'Employee Relations', nameBn: 'কর্মী সহায়তা ও মতামত', href: '/hr/relations', icon: MessageCircleQuestion },
  { name: 'HR Reports & Turnover', nameBn: 'এইচআর রিপোর্ট', href: '/hr/reports', icon: BarChart3 },
];

export function HRAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <aside className="w-64 flex-shrink-0 bg-[#0C1E28] text-slate-300 flex flex-col h-screen border-r border-teal-950 select-none z-30">
        {/* Brand Header */}
        <div className="p-4 flex items-center gap-3 border-b border-teal-900/50 bg-[#08151D]">
          <img
            src="/icon.png"
            alt="WorkForce 360"
            className="w-10 h-10 object-contain drop-shadow-md"
          />
          <div>
            <h1 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              WorkForce <span className="text-[#16A389]">360</span>
            </h1>
            <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">People & Culture HRMS</p>
          </div>
        </div>

        {/* HR Context Pill */}
        <div className="p-3 mx-3 my-2 rounded-2xl bg-teal-950/60 border border-teal-900/60 flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="text-[10px] font-bold text-teal-400 uppercase block">HR Admin Access</span>
            <p className="text-xs font-black text-white truncate">People Operations</p>
          </div>
          <button
            onClick={() => setShowRoleModal(true)}
            className="text-[10px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded-full hover:bg-teal-50 transition-colors flex-shrink-0"
          >
            Switch
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">People Operations</p>
          {hrAdminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/hr' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-[#16A389] text-white shadow-md shadow-teal-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-teal-900/40 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-teal-400')} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      isActive ? 'bg-white/20 text-white' : 'bg-teal-950 text-teal-300 border border-teal-800'
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

        {/* Footer & Logout */}
        <div className="p-4 border-t border-teal-900/50 bg-[#08151D] space-y-3">
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
        currentRole="hr-admin"
      />

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] text-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-slate-700 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Log Out from HR Admin?</h3>
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

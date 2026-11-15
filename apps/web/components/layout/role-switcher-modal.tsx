'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  Users2,
  UserCheck,
  Smartphone,
  X,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: 'super-admin' | 'company-admin' | 'hr-admin' | 'manager' | 'employee';
}

const roles = [
  {
    id: 'super-admin',
    roleKey: 'super_admin',
    name: 'Platform Super Admin',
    nameBn: 'প্ল্যাটফর্ম সুপার অ্যাডমিন',
    desc: 'Root SaaS administration, 128 tenants, subscriptions, remote control & device fleets.',
    badge: 'Platform Root',
    badgeColor: 'bg-blue-100 text-[#3758D8] dark:bg-blue-950/60',
    href: '/platform-admin',
    icon: ShieldCheck,
    accent: '#3758D8',
  },
  {
    id: 'company-admin',
    roleKey: 'company_admin',
    name: 'Company Admin',
    nameBn: 'কোম্পানি অ্যাডমিন',
    desc: 'Organization control center, branches, geofences, attendance policies, payroll & finance.',
    badge: 'WorkForce 360 Ltd',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60',
    href: '/admin',
    icon: Building2,
    accent: '#10B981',
  },
  {
    id: 'hr-admin',
    roleKey: 'hr_admin',
    name: 'HR Admin',
    nameBn: 'এইচআর অ্যাডমিন',
    desc: 'People & Culture, recruitment pipeline, onboarding checklists, leave approvals & relations.',
    badge: 'HR & Culture',
    badgeColor: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60',
    href: '/hr',
    icon: Users2,
    accent: '#16A389',
  },
  {
    id: 'manager',
    roleKey: 'manager',
    name: 'Manager / Team Lead',
    nameBn: 'ম্যানেজার / টিম লিড',
    desc: 'Daily team supervision, 8 members, attendance rosters, task management & approvals.',
    badge: 'Engineering Lead',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60',
    href: '/manager',
    icon: UserCheck,
    accent: '#8B5CF6',
  },
  {
    id: 'employee',
    roleKey: 'employee',
    name: 'Employee Self-Service',
    nameBn: 'কর্মী সেলফ-সার্ভিস',
    desc: 'Personal attendance punch, shifts, leave balances, assigned tasks & April payslip.',
    badge: 'Software Engineer',
    badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60',
    href: '/employee',
    icon: Smartphone,
    accent: '#06B6D4',
  },
];

export function RoleSwitcherModal({ isOpen, onClose, currentRole }: RoleSwitcherModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSelectRole = (roleKey: string, href: string) => {
    localStorage.setItem('wf360_user_role', roleKey);
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Switch Workspace Dashboard</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select any of the five purpose-built role dashboards inside KORMETRIX.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const isCurrent = r.id === currentRole;

            return (
              <div
                key={r.id}
                onClick={() => handleSelectRole(r.roleKey, r.href)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isCurrent
                    ? 'border-[#3758D8] bg-blue-50/50 dark:bg-blue-950/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                    style={{ backgroundColor: r.accent }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-[#3758D8] transition-colors">
                        {r.name}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.badgeColor}`}>
                        {r.badge}
                      </span>
                      {isCurrent && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{r.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-[#3758D8] group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <p>
            🔒 Zero-Trust Enforcement: Super Admin and Company Admin have full platform credentials overview.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';
import { showAppToast } from '@/components/common/toast';

import React from 'react';
import { Check, Shield, Zap, Sparkles, Building2 } from 'lucide-react';
import { formatBDT } from '@/lib/utils';

const plans = [
  {
    name: 'Free Tier',
    code: 'FREE',
    priceBDT: 0,
    annualBDT: 0,
    employees: 'Up to 10 Employees',
    branches: '1 Branch',
    storage: '2 GB Cloud Storage',
    features: ['Basic Attendance Punch', 'Standard Leave Ledger', 'Email Notifications'],
    badge: 'Starter',
  },
  {
    name: 'Starter',
    code: 'STARTER',
    priceBDT: 4999,
    annualBDT: 49990,
    employees: 'Up to 50 Employees',
    branches: '2 Branches',
    storage: '10 GB Cloud Storage',
    features: ['GPS Geofence Attendance', 'Leave Management', 'Basic Reports Export', 'Standard Support'],
    badge: 'Popular for SMBs',
  },
  {
    name: 'Professional',
    code: 'PROFESSIONAL',
    priceBDT: 14999,
    annualBDT: 149990,
    employees: 'Up to 200 Employees',
    branches: '5 Branches',
    storage: '50 GB Cloud Storage',
    features: ['Bangladesh Payroll & Tax Slabs', 'Remote Control System', 'Universal Approval Workflows', 'Priority Support'],
    badge: 'Most Popular',
    highlighted: true,
  },
  {
    name: 'Business',
    code: 'BUSINESS',
    priceBDT: 29999,
    annualBDT: 299990,
    employees: 'Up to 500 Employees',
    branches: '10 Branches',
    storage: '100 GB Cloud Storage',
    features: ['Multi-Branch Shifts', 'Custom Branding & Domain', 'Forensic Audit Logs', 'Dedicated Account Manager'],
    badge: 'High Scale',
  },
  {
    name: 'Enterprise',
    code: 'ENTERPRISE',
    priceBDT: 69999,
    annualBDT: 699990,
    employees: 'Unlimited Employees',
    branches: 'Unlimited Branches',
    storage: '500 GB Cloud Storage',
    features: ['Custom Remote Config Rules', 'Custom Integration Adapters', '24/7 SLA Guarantee', 'On-Premise Isolated Option'],
    badge: 'Enterprise',
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">SaaS Plans & Subscription Management</h1>
        <p className="text-slate-500 text-sm">Configure multi-tenant subscription tiers, employee limits, and recurring BDT billing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {plans.map((p) => (
          <div
            key={p.code}
            className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
              p.highlighted
                ? 'bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/40 dark:to-[#1E293B] border-[#3758D8] shadow-lg shadow-blue-500/10 ring-2 ring-[#3758D8]'
                : 'bg-white dark:bg-[#1E293B] border-slate-200/80 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {p.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.name}</h3>
              <div className="mt-3 mb-4">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{formatBDT(p.priceBDT)}</span>
                <span className="text-xs text-slate-500 font-medium"> /month</span>
              </div>

              <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300 border-t border-b border-slate-100 dark:border-slate-800 py-3 mb-3">
                <p className="font-bold text-slate-900 dark:text-white">{p.employees}</p>
                <p>{p.branches}</p>
                <p>{p.storage}</p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-4">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => showAppToast(`Plan ${p.name} selected!`)}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                p.highlighted
                  ? 'bg-[#3758D8] text-white hover:bg-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

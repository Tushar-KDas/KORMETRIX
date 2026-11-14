'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Smartphone,
  Layers,
  ArrowRight,
  CheckCircle,
  Building2,
  Users,
  CreditCard,
  Sliders,
  Award,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#101827] text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      {/* Navbar */}
      <nav className="h-20 max-w-[1400px] w-full mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3758D8] to-[#06B6D4] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            W
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            WorkForce <span className="text-[#3758D8]">360</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Link href="/login/super-admin" className="text-[#3758D8] hover:underline flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Super Admin
          </Link>
          <Link href="/login/company-admin" className="text-emerald-600 hover:underline flex items-center gap-1">
            <Building2 className="w-4 h-4" /> Company Admin
          </Link>
          <Link href="/manager" className="hover:text-[#3758D8] transition-colors">Manager</Link>
          <Link href="/employee" className="hover:text-[#3758D8] transition-colors">Employee</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            Role Login
          </Link>
          <Link
            href="/platform-admin"
            className="px-4 py-2 rounded-xl bg-[#3758D8] text-white text-xs font-bold hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/25 flex items-center gap-1.5"
          >
            Enter App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-[1400px] w-full mx-auto px-6 py-12 md:py-20 flex-1 flex flex-col justify-center text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-xs font-bold text-[#3758D8] mx-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Enterprise HRMS & Workforce Management SaaS — Bangladesh Edition
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
          One Platform. <br />
          <span className="bg-gradient-to-r from-[#3758D8] to-[#16A389] bg-clip-text text-transparent">
            Complete Workforce Control.
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          Multi-tenant attendance geofencing, automated Bangladesh tax & payroll, two-stage leave ledger,
          universal approval workflows, and remote device control.
        </p>

        {/* Portal Shortcuts */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto w-full text-left">
          <Link
            href="/platform-admin"
            className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#3758D8] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[#3758D8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Platform Super Admin</h3>
            <p className="text-xs text-slate-500 mt-1">Tenant provisioning, remote config, SaaS billing & audit logs.</p>
          </Link>

          <Link
            href="/admin"
            className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Company Admin Dashboard</h3>
            <p className="text-xs text-slate-500 mt-1">Employee lifecycle, payroll calculation & attendance geofences.</p>
          </Link>

          <Link
            href="/manager"
            className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Manager Portal</h3>
            <p className="text-xs text-slate-500 mt-1">Scoped team review, 88% efficiency tracking & leave approvals.</p>
          </Link>

          <Link
            href="/employee"
            className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-cyan-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Employee Self-Service</h3>
            <p className="text-xs text-slate-500 mt-1">Daily punch, tasks, leave ledger balance & April 2025 payslip.</p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-slate-200 dark:border-slate-800 max-w-[1400px] w-full mx-auto px-6 flex items-center justify-between text-xs text-slate-500">
        <p>© 2026 WorkForce 360 Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Asia/Dhaka</span>
          <span>BDT ৳ Currency</span>
          <span className="text-emerald-500 font-bold">● High Availability</span>
        </div>
      </footer>
    </div>
  );
}

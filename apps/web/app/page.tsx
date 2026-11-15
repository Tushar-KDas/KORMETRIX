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
  HeartHandshake,
  Download,
} from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/brand-config';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#101827] text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      {/* Navbar */}
      <nav className="h-20 max-w-[1400px] w-full mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/icon.png"
            alt="KORMETRIX"
            className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              KORMETRI<span className="text-[#19B89A]">X</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {BRAND_CONFIG.tagline}
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Link href="/login/super-admin" className="text-[#3158D8] hover:underline flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> KORMETRIX Control
          </Link>
          <Link href="/login/company-admin" className="text-emerald-600 hover:underline flex items-center gap-1.5">
            <Building2 className="w-4 h-4" /> Kormetrix Company
          </Link>
          <Link href="/hr" className="text-[#19B89A] hover:underline flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4" /> Kormetrix People
          </Link>
          <Link href="/manager" className="hover:text-[#3158D8] transition-colors">Kormetrix Team</Link>
          <Link href="/employee" className="hover:text-[#3158D8] transition-colors">Kormetrix Desk</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Role Login
          </Link>
          <Link
            href="/platform-admin"
            className="px-4 py-2 rounded-xl bg-[#3158D8] text-white text-xs font-bold hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/25 flex items-center gap-1.5"
          >
            Enter Platform <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-[1400px] w-full mx-auto px-6 py-12 md:py-16 flex-1 flex flex-col justify-center text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-xs font-bold text-[#3158D8] mx-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {BRAND_CONFIG.description}
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Manage Your People. <br />
          <span className="bg-gradient-to-r from-[#14243F] via-[#3158D8] to-[#19B89A] bg-clip-text text-transparent">
            Empower Your Business.
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          One powerful platform to manage your employees, attendance, payroll, HR operations and team performance with KORMETRIX.
        </p>

        {/* 5 Integrated Role Portals */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto w-full text-left">
          {/* 1. Super Admin */}
          <Link
            href="/platform-admin"
            className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#3158D8] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[#3158D8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">KORMETRIX Control</h3>
            <p className="text-xs text-slate-500 mt-1">Tenant provisioning, remote brand config, telemetry & audit logs.</p>
          </Link>

          {/* 2. Company Admin */}
          <Link
            href="/admin"
            className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Kormetrix Company</h3>
            <p className="text-xs text-slate-500 mt-1">Workforce directory, GPS geofencing, payroll & branches.</p>
          </Link>

          {/* 3. HR Admin */}
          <Link
            href="/hr"
            className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#19B89A] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-[#19B89A] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Kormetrix People</h3>
            <p className="text-xs text-slate-500 mt-1">Recruitment funnel, onboarding workflows & leave approvals.</p>
          </Link>

          {/* 4. Manager Portal */}
          <Link
            href="/manager"
            className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Kormetrix Team</h3>
            <p className="text-xs text-slate-500 mt-1">Scoped team review, 1-click approvals & sprint tasks.</p>
          </Link>

          {/* 5. Employee Portal */}
          <Link
            href="/employee"
            className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-cyan-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Kormetrix Desk</h3>
            <p className="text-xs text-slate-500 mt-1">Self-service punch, leave ledger, tasks & instant payslips.</p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-slate-200 dark:border-slate-800 max-w-[1400px] w-full mx-auto px-6 flex items-center justify-between text-xs text-slate-500">
        <p>{BRAND_CONFIG.metadata.copyright}</p>
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-600 dark:text-slate-300">People. Work. Performance.</span>
          <span>Asia/Dhaka</span>
          <span className="text-emerald-500 font-bold">● System Operational</span>
        </div>
      </footer>
    </div>
  );
}

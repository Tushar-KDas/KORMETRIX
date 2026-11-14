'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CompanyAdminLoginPage() {
  const router = useRouter();
  const [selectedOrg] = useState('WorkForce 360 Ltd');
  const [email, setEmail] = useState('admin@workforce360.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('wf360_user_role', 'company_admin');
      localStorage.setItem('wf360_organization', 'WorkForce 360 Ltd');
      router.push('/admin');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#101827] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#10B981] text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Company Admin Login</h2>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
            WorkForce 360 Ltd • Enterprise Admin
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {/* Fixed Single Enterprise Organization */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">WorkForce 360 Ltd</p>
                <p className="text-[10px] text-slate-500">Banani Corporate HQ, Dhaka</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Active Enterprise
            </span>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Company Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-[#10B981]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-[#10B981]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Entering Workspace...' : 'Enter Company Admin Dashboard'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
          <Link href="/login" className="text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> All Roles
          </Link>
          <Link href="/login/super-admin" className="text-[#3758D8] hover:underline">
            Super Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
}

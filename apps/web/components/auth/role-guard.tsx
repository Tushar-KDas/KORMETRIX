'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, ArrowLeft, LogIn } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('super_admin' | 'company_admin' | 'hr_admin' | 'manager' | 'employee')[];
  requiredRoleLabel?: string;
}

export function RoleGuard({ children, allowedRoles, requiredRoleLabel = 'Super Admin or Company Admin' }: RoleGuardProps) {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<string>('company_admin');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    // Check role stored in localStorage
    const savedRole = localStorage.getItem('wf360_user_role') || 'company_admin';
    setCurrentRole(savedRole);

    const authorized = allowedRoles.includes(savedRole as any);
    setIsAuthorized(authorized);
    setChecked(true);
  }, [allowedRoles]);

  if (!checked) {
    return <div className="p-8 text-center text-xs text-slate-400">Verifying security clearances...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-black tracking-widest text-rose-600 uppercase bg-rose-50 dark:bg-rose-950/50 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
              403 FORBIDDEN — RESTRICTED CONSOLE
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3">
              Access Restricted
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              সুপার অ্যাডমিন এবং কোম্পানি অ্যাডমিন ছাড়া অন্য কোনো ইউজার এই প্যানেলে প্রবেশ করতে পারবে না।
              You are signed in with the role <b className="text-slate-800 dark:text-white font-mono uppercase">{currentRole}</b>, but access requires <b className="text-rose-600">{requiredRoleLabel}</b> credentials.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs text-left space-y-1.5 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              <span>Zero-Trust Enterprise Security Enforcement</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Your security ID and timestamp have been logged in the audit ledger. To access this workspace, please authenticate via the designated administrative gateway.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => router.push(currentRole === 'employee' ? '/employee' : currentRole === 'manager' ? '/manager' : '/hr')}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Return to My Portal
            </button>
            <button
              onClick={() => router.push('/login/company-admin')}
              className="flex-1 py-3 px-4 rounded-xl bg-[#3758D8] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Admin Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

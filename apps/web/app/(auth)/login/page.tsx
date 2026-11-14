'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building2,
  HeartHandshake,
  Users,
  CheckCircle2,
  Laptop,
} from 'lucide-react';
import { mock100Employees } from '@/lib/employees-100';
import { showAppToast } from '@/components/common/toast';

type RoleType = 'super-admin' | 'company-admin' | 'hr-admin' | 'manager' | 'employee';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role') as RoleType | null;

  const [activeRole, setActiveRole] = useState<RoleType>(roleParam || 'super-admin');
  const [email, setEmail] = useState('superadmin@workforce360.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const handleRoleTabChange = (role: RoleType) => {
    setActiveRole(role);
    if (role === 'super-admin') {
      setEmail('superadmin@workforce360.com');
      setPassword('password123');
    } else if (role === 'company-admin') {
      setEmail('admin@workforce360.com');
      setPassword('password123');
    } else if (role === 'hr-admin') {
      setEmail('hr@workforce360.com');
      setPassword('password123');
    } else if (role === 'manager') {
      setEmail('manager@workforce360.com');
      setPassword('password123');
    } else {
      setEmail('ahmed@workforce360.com');
      setPassword('password123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if user is in pending access requests
    try {
      const storedReqs = JSON.parse(localStorage.getItem('wf360_access_requests') || '[]');
      const pendingMatch = storedReqs.find((r: any) => r.email?.toLowerCase() === cleanEmail && r.status === 'PENDING');
      if (pendingMatch) {
        setIsLoading(false);
        showAppToast(
          `হ্যালো ${pendingMatch.fullName}, আপনার অ্যাকাউন্টটি এখনো HR Admin অনুমোদনের অপেক্ষায় আছে। অনুমোদন হওয়ার পর লগইন করতে পারবেন।`,
          'warning',
          'অনুমোদন বাকি আছে (Pending HR Approval)'
        );
        return;
      }
    } catch (e) {}

    // 2. Look up in 100 Employees Dataset + Custom Added Employees
    let customEmployees: any[] = [];
    try {
      customEmployees = JSON.parse(localStorage.getItem('wf360_custom_employees_roster') || '[]');
    } catch (e) {}

    const allRoster = [...customEmployees, ...mock100Employees];
    const foundEmp = allRoster.find((emp: any) => emp.email?.toLowerCase() === cleanEmail);

    let loggedInUser: any = null;

    if (foundEmp) {
      const isLead = foundEmp.designation?.toLowerCase().includes('lead') ||
                    foundEmp.designation?.toLowerCase().includes('director') ||
                    foundEmp.designation?.toLowerCase().includes('manager');
      const calculatedRole = foundEmp.role || (isLead ? 'manager' : 'employee');

      loggedInUser = {
        id: foundEmp.id,
        employeeId: foundEmp.employeeId,
        name: foundEmp.name,
        email: foundEmp.email,
        designation: foundEmp.designation,
        team: foundEmp.team,
        teamId: foundEmp.teamId,
        role: calculatedRole,
        branch: foundEmp.branch || 'Banani HQ, Dhaka',
        avatar: foundEmp.avatar,
        bloodGroup: foundEmp.bloodGroup,
        joiningDate: foundEmp.joiningDate,
        grossSalaryBDT: foundEmp.grossSalaryBDT || 65000,
      };
    } else if (cleanEmail.includes('superadmin')) {
      loggedInUser = {
        employeeId: 'ROOT-001',
        name: 'Md. Rahim Ahmed',
        email: cleanEmail,
        role: 'super_admin',
        designation: 'Root Platform Administrator',
        team: 'Platform Fleet Operations',
        branch: 'Banani HQ, Dhaka',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      };
    } else if (cleanEmail.includes('admin@')) {
      loggedInUser = {
        employeeId: 'ADM-001',
        name: 'Tanvir Hasan',
        email: cleanEmail,
        role: 'company_admin',
        designation: 'Managing Director & Enterprise Admin',
        team: 'Executive Leadership',
        branch: 'Banani HQ, Dhaka',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      };
    } else if (cleanEmail.includes('hr@')) {
      loggedInUser = {
        employeeId: 'HR-001',
        name: 'Sarah Khan',
        email: cleanEmail,
        role: 'hr_admin',
        designation: 'Head of People & Culture • HR Admin',
        team: 'Human Resources & Talent',
        branch: 'Banani HQ, Dhaka',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      };
    } else if (cleanEmail.includes('manager@')) {
      loggedInUser = {
        employeeId: 'MGR-001',
        name: 'Tanvir Hasan',
        email: cleanEmail,
        role: 'manager',
        designation: 'Engineering Team Lead • Manager',
        team: 'Engineering & Technology',
        branch: 'Banani HQ, Dhaka',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      };
    } else {
      loggedInUser = {
        employeeId: 'WF-1099',
        name: cleanEmail.split('@')[0].split('.').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        email: cleanEmail,
        role: 'employee',
        designation: 'Associate Member',
        team: 'Engineering & Technology',
        branch: 'Banani HQ, Dhaka',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      };
    }

    // Persist session to localStorage
    localStorage.setItem('wf360_current_user', JSON.stringify(loggedInUser));
    localStorage.setItem('wf360_user_role', loggedInUser.role);
    localStorage.setItem('wf360_organization', 'WorkForce 360 Ltd');

    setTimeout(() => {
      setIsLoading(false);
      showAppToast(`স্বাগতম, ${loggedInUser.name}! আপনার ড্যাশবোর্ড লোড হচ্ছে...`, 'success', 'লগইন সফল');

      if (loggedInUser.role === 'super_admin') {
        setLoginMessage(`Authenticated as Super Admin. Redirecting...`);
        setTimeout(() => router.push('/platform-admin'), 400);
      } else if (loggedInUser.role === 'company_admin') {
        setLoginMessage(`Authenticated as Company Admin. Redirecting...`);
        setTimeout(() => router.push('/admin'), 400);
      } else if (loggedInUser.role === 'hr_admin') {
        setLoginMessage(`Authenticated as HR Admin. Redirecting...`);
        setTimeout(() => router.push('/hr'), 400);
      } else if (loggedInUser.role === 'manager') {
        setLoginMessage(`Authenticated as Team Manager. Redirecting...`);
        setTimeout(() => router.push('/manager'), 400);
      } else {
        setLoginMessage(`Authenticated as ${loggedInUser.name}. Redirecting...`);
        setTimeout(() => router.push('/employee'), 400);
      }
    }, 450);
  };

  return (
    <div className="w-full max-w-xl bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-2xl space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <img
          src="/icon.png"
          alt="WorkForce 360 Logo"
          className="w-16 h-16 object-contain mx-auto drop-shadow-md animate-in zoom-in-95"
        />
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">WorkForce 360</h2>
        <p className="text-xs text-slate-500 font-semibold">One Platform. Complete Workforce Control.</p>
      </div>

      {/* Dedicated 5-Role Tabs Switcher */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
          Select Your Workspace Role (সকল ৫টি রোল)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleRoleTabChange('super-admin')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeRole === 'super-admin'
                ? 'bg-[#3758D8] text-white shadow-md shadow-blue-600/30 font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[11px]">Super Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('company-admin')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeRole === 'company-admin'
                ? 'bg-[#10B981] text-white shadow-md shadow-emerald-600/30 font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span className="text-[11px]">Company Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('hr-admin')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeRole === 'hr-admin'
                ? 'bg-[#14B8A6] text-white shadow-md shadow-teal-600/30 font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span className="text-[11px]">HR Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('manager')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeRole === 'manager'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[11px]">Manager</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('employee')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeRole === 'employee'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span className="text-[11px]">Employee</span>
          </button>
        </div>
      </div>

      {/* Dynamic Role Banner Info */}
      <div
        className={`p-3.5 rounded-2xl border text-xs space-y-1 transition-all ${
          activeRole === 'super-admin'
            ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50 text-[#3758D8] dark:text-blue-300'
            : activeRole === 'company-admin'
            ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300'
            : activeRole === 'hr-admin'
            ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900/50 text-teal-700 dark:text-teal-300'
            : activeRole === 'manager'
            ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50 text-purple-700 dark:text-purple-300'
            : 'bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900/50 text-cyan-700 dark:text-cyan-300'
        }`}
      >
        <div className="flex items-center justify-between font-black">
          <span className="flex items-center gap-1.5 uppercase tracking-wide">
            {activeRole === 'super-admin' && <ShieldCheck className="w-4 h-4" />}
            {activeRole === 'company-admin' && <Building2 className="w-4 h-4" />}
            {activeRole === 'hr-admin' && <HeartHandshake className="w-4 h-4" />}
            {activeRole === 'manager' && <Users className="w-4 h-4" />}
            {activeRole === 'employee' && <Laptop className="w-4 h-4" />}
            {activeRole === 'super-admin' && 'Platform Super Admin Access'}
            {activeRole === 'company-admin' && 'WorkForce 360 Ltd • Company Admin'}
            {activeRole === 'hr-admin' && 'WorkForce 360 Ltd • HR Admin'}
            {activeRole === 'manager' && 'WorkForce 360 Ltd • Team Manager'}
            {activeRole === 'employee' && 'WorkForce 360 Ltd • Employee Self-Service'}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 font-mono">
            {activeRole === 'super-admin' ? 'Root Platform' : 'WorkForce 360 Ltd'}
          </span>
        </div>
        <p className="text-[11px] opacity-90">
          {activeRole === 'super-admin' &&
            'Manage platform security, remote device fleet, and global SaaS infrastructure.'}
          {activeRole === 'company-admin' &&
            'Complete company control: 100 employees, 5 departments, payroll, and Bangladesh compliance.'}
          {activeRole === 'hr-admin' &&
            'People operations, employee directory, leave approvals, recruitment & onboarding.'}
          {activeRole === 'manager' &&
            'Manage department team roster, shift attendance, task boards, and leave approvals.'}
          {activeRole === 'employee' &&
            'Geofence mobile/web punch, attendance log, leave balance, payslips & ID card.'}
        </p>
      </div>

      {/* Single Enterprise Organization Badge (Strictly One Company) */}
      {activeRole !== 'super-admin' && (
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">WorkForce 360 Ltd</p>
              <p className="text-[10px] text-slate-500">Banani Corporate HQ, Dhaka • Verified Enterprise</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            Primary Company
          </span>
        </div>
      )}

      {/* Feedback Alert */}
      {loginMessage && (
        <div className="p-3 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{loginMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">Authorized Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3758D8]"
              placeholder="name@workforce360.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3758D8]"
              placeholder="••••••••"
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

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-[#3758D8] rounded"
            />
            Remember this device
          </label>
          <span className="font-medium text-slate-400">Demo Password: password123</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-xl text-white font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 ${
            activeRole === 'super-admin'
              ? 'bg-[#3758D8] hover:bg-blue-600 shadow-blue-500/25'
              : activeRole === 'company-admin'
              ? 'bg-[#10B981] hover:bg-emerald-600 shadow-emerald-500/25'
              : activeRole === 'hr-admin'
              ? 'bg-[#14B8A6] hover:bg-teal-600 shadow-teal-500/25'
              : activeRole === 'manager'
              ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/25'
              : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/25'
          }`}
        >
          {isLoading
            ? 'Authenticating Session...'
            : activeRole === 'super-admin'
            ? 'Enter Super Admin Dashboard'
            : activeRole === 'company-admin'
            ? 'Enter Company Admin Dashboard'
            : activeRole === 'hr-admin'
            ? 'Enter HR Admin Portal'
            : activeRole === 'manager'
            ? 'Enter Manager Portal'
            : 'Enter Employee Portal'}{' '}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* All 5 Role Direct Portal Links */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
          <span>Direct Role Portals (এক ক্লিকে প্রবেশ):</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Link href="/platform-admin" className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300">
            Super Admin →
          </Link>
          <Link href="/admin" className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300">
            Company Admin →
          </Link>
          <Link href="/hr" className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300">
            HR Admin →
          </Link>
          <Link href="/manager" className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300">
            Manager →
          </Link>
          <Link href="/employee" className="px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:text-cyan-300">
            Employee →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#101827] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm font-bold text-slate-500">Loading WorkForce 360 Login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

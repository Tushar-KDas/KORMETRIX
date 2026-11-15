'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  UserCheck,
  Coins,
  ArrowUpRight,
  PlusCircle,
  Fingerprint,
  CalendarPlus,
  CheckCircle2,
  FolderPlus,
  FileSpreadsheet,
  Calendar,
  Clock,
  Briefcase,
  AlertCircle,
  Sparkles,
  X,
  MapPin,
  Check,
  Download,
  Plus,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { mockDashboardData } from '@/lib/mock-data';
import { cn, formatBDT } from '@/lib/utils';
import { useSidebar } from '@/lib/sidebar-context';

export default function PlatformAdminDashboard() {
  const { kpis, businessOverview, attendance, departmentDistribution, recentActivities, upcomingEvents, systemHealth, leaveBalances } = mockDashboardData;
  const { hideDashboardOptions, toggleDashboardOptions } = useSidebar();

  // 1. Time range filter states
  const [businessTimeRange, setBusinessTimeRange] = useState<'12M' | '2025' | '30D'>('12M');
  const [attendancePeriod, setAttendancePeriod] = useState<'Today' | 'This Week' | 'This Month'>('Today');

  // Dynamic business data based on filter
  const chartData = businessTimeRange === '30D'
    ? [
        { month: 'W1', revenue: 58000, organizations: 126, users: 24800 },
        { month: 'W2', revenue: 61000, organizations: 127, users: 25100 },
        { month: 'W3', revenue: 63000, organizations: 127, users: 25400 },
        { month: 'W4', revenue: 63000, organizations: 128, users: 25800 },
      ]
    : businessOverview;

  // Dynamic attendance data based on period
  const attendanceRate = attendancePeriod === 'Today' ? 92 : attendancePeriod === 'This Week' ? 94 : 91;
  const presentCount = attendancePeriod === 'Today' ? 16472 : attendancePeriod === 'This Week' ? 16920 : 16380;
  const latePercent = attendancePeriod === 'Today' ? 8 : attendancePeriod === 'This Week' ? 4 : 6;
  const absentPercent = attendancePeriod === 'Today' ? 8 : attendancePeriod === 'This Week' ? 2 : 3;

  const donutData = [
    { name: 'Present', value: presentCount, color: '#10B981' },
    { name: 'Absent', value: Math.round(18000 * (absentPercent / 100)), color: '#EF4444' },
    { name: 'On Leave', value: 642, color: '#8B5CF6' },
  ];

  // 2. Modals state for all quick actions
  const [activeModal, setActiveModal] = useState<
    'NONE' | 'ADD_EMP' | 'MARK_ATTENDANCE' | 'APPLY_LEAVE' | 'CREATE_TASK' | 'ADD_PROJECT' | 'GEN_REPORT' | 'VIEW_ACTIVITIES' | 'VIEW_DEPTS' | 'VIEW_CALENDAR'
  >('NONE');

  // Feedback notification toast
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setActiveModal('NONE');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Quick Form States
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('Engineering');
  const [newEmpSalary, setNewEmpSalary] = useState(75000);

  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [leaveDays, setLeaveDays] = useState(3);
  const [leaveReason, setLeaveReason] = useState('');

  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('HIGH');

  const [projName, setProjName] = useState('');
  const [projBudget, setProjBudget] = useState(1500000);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Toast Alert */}
      {feedbackToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 1. WELCOME HERO BANNER (Matches Image 2 & 5) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              Welcome Back, Super Admin! <span>👋</span>
            </h1>
            <p className="text-blue-100/90 text-sm md:text-base font-medium max-w-xl">
              Manage your entire workforce ecosystem from one powerful platform.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full w-fit mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Online • 24 Apr 2025, 11:45 AM • Asia/Dhaka</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleDashboardOptions}
              className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 border border-white/20 shadow-xs"
              title="Toggle Quick Actions & Dashboard options"
            >
              {hideDashboardOptions ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Show Options</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-blue-200" />
                  <span>Hide Options</span>
                </>
              )}
            </button>
            <div className="hidden lg:flex flex-col items-end text-right">
              <span className="text-xl font-serif italic text-blue-200">
                People. Work. Performance.
              </span>
              <span className="text-xs text-blue-200/80 mt-1">KORMETRIX Control • Enterprise Bangladesh</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. TOP 4 METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Organizations */}
        <Link
          href="/platform-admin/organizations"
          className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#3758D8] transition-all group block"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#3758D8] group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {kpis.totalOrganizationsGrowth}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Organizations</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{kpis.totalOrganizations}</h3>
        </Link>

        {/* Total Users */}
        <Link
          href="/admin/employees"
          className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all group block"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {kpis.totalUsersGrowth}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Users</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{kpis.totalUsers}</h3>
        </Link>

        {/* Active Employees */}
        <Link
          href="/admin/employees"
          className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-500 transition-all group block"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {kpis.activeEmployeesGrowth}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Employees</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{kpis.activeEmployees}</h3>
        </Link>

        {/* Monthly Revenue BDT */}
        <Link
          href="/platform-admin/subscriptions"
          className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-500 transition-all group block"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Coins className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {kpis.monthlyRevenueGrowth}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Monthly Revenue</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {formatBDT(kpis.monthlyRevenueBDT)}
          </h3>
        </Link>
      </div>

      {/* 3. BUSINESS OVERVIEW & ATTENDANCE OVERVIEW & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Business Overview Chart with Working Filter */}
        <div className={cn(
          'bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4',
          hideDashboardOptions ? 'lg:col-span-7' : 'lg:col-span-5'
        )}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Business Overview</h2>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-1">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3758D8]" /> Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Organizations</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Users</span>
              </div>
            </div>
            <select
              value={businessTimeRange}
              onChange={(e) => setBusinessTimeRange(e.target.value as any)}
              className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#3758D8] cursor-pointer"
            >
              <option value="12M">Last 12 Months</option>
              <option value="2025">Year 2025</option>
              <option value="30D">Last 30 Days</option>
            </select>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(val) => `${val / 1000}K`} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    name === 'revenue' ? formatBDT(Number(value)) : value,
                    name === 'revenue' ? 'Revenue' : name === 'organizations' ? 'Orgs' : 'Users',
                  ]}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3758D8" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="organizations" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Overview Donut with Working Period Selector */}
        <div className={cn(
          'bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between',
          hideDashboardOptions ? 'lg:col-span-5' : 'lg:col-span-4'
        )}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Attendance Overview</h2>
              <p className="text-xs text-slate-500 font-medium">Daily Workforce Presence</p>
            </div>
            <select
              value={attendancePeriod}
              onChange={(e) => setAttendancePeriod(e.target.value as any)}
              className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border-none focus:ring-0 cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          <div className="relative h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{attendanceRate}%</span>
              <span className="text-[11px] font-bold text-emerald-600">Present</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <div className="p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30">
              <span className="block text-xs font-bold text-emerald-700 dark:text-emerald-400">On Time</span>
              <span className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
                {100 - latePercent - absentPercent}%
              </span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/30">
              <span className="block text-xs font-bold text-amber-700 dark:text-amber-400">Late</span>
              <span className="text-sm font-extrabold text-amber-800 dark:text-amber-300">{latePercent}%</span>
            </div>
            <div className="p-2 rounded-xl bg-red-50/60 dark:bg-red-950/30">
              <span className="block text-xs font-bold text-red-700 dark:text-red-400">Absent</span>
              <span className="text-sm font-extrabold text-red-800 dark:text-red-300">{absentPercent}%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel - Each Card Directly Works with Action Modal or Navigation */}
        {!hideDashboardOptions && (
          <div className="lg:col-span-3 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Quick Actions</h2>
              <Link href="/admin" className="text-xs font-semibold text-[#3758D8] hover:underline">View All →</Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setActiveModal('ADD_EMP')}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 transition-all flex flex-col items-center justify-center text-center group border border-slate-100 dark:border-slate-800"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-[#3758D8] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Add Employee</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('MARK_ATTENDANCE')}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 transition-all flex flex-col items-center justify-center text-center group border border-slate-100 dark:border-slate-800"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Mark Attendance</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('APPLY_LEAVE')}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 transition-all flex flex-col items-center justify-center text-center group border border-slate-100 dark:border-slate-800"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <CalendarPlus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Apply Leave</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('CREATE_TASK')}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-200 transition-all flex flex-col items-center justify-center text-center group border border-slate-100 dark:border-slate-800"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Create Task</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('ADD_PROJECT')}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition-all flex flex-col items-center justify-center text-center group border border-slate-100 dark:border-slate-800"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Add Project</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('GEN_REPORT')}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 transition-all flex flex-col items-center justify-center text-center group border border-slate-100 dark:border-slate-800"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Generate Report</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. RECENT ACTIVITIES & DEPARTMENT STATS & UPCOMING EVENTS & SYSTEM HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activities with Interactive View All */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Activities</h2>
            <button
              onClick={() => setActiveModal('VIEW_ACTIVITIES')}
              className="text-xs font-semibold text-[#3758D8] hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => setActiveModal('VIEW_ACTIVITIES')}
                className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#3758D8] font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {act.avatarText}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug line-clamp-1">{act.title}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{act.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Statistics with Interactive View Details */}
        <div className="lg:col-span-3 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Department Stats</h2>
            <button
              onClick={() => setActiveModal('VIEW_DEPTS')}
              className="text-xs font-semibold text-[#3758D8] hover:underline"
            >
              View Details →
            </button>
          </div>

          <div className="relative h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  innerRadius={48}
                  outerRadius={68}
                  dataKey="percentage"
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`dept-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-slate-900 dark:text-white">18.5K</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase">Total</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-medium">
            {departmentDistribution.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dept.color }} />
                  {dept.name}
                </span>
                <span className="font-bold">{dept.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events with Interactive View Calendar */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Events</h2>
            <button
              onClick={() => setActiveModal('VIEW_CALENDAR')}
              className="text-xs font-semibold text-[#3758D8] hover:underline"
            >
              Calendar →
            </button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((ev, i) => (
              <div
                key={i}
                onClick={() => setActiveModal('VIEW_CALENDAR')}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 cursor-pointer hover:border-[#3758D8] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.badgeColor}`}>{ev.type}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{ev.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{ev.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="lg:col-span-3 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" /> System Health
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Operational
            </span>
          </div>

          <p className="text-xs text-slate-300">All WorkForce 360 platform clusters running optimal.</p>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {systemHealth.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs py-1">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {item.name}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">{item.latencyMs}ms</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. LEAVE BALANCE & PAYROLL SUMMARY & BANGLADESH LANDMARK CARD (From Image 5) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Leave Balance Overview */}
        <div className="md:col-span-5 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Leave Balance Ledger</h2>
            <Link href="/admin/leave" className="text-xs font-semibold text-[#3758D8] hover:underline">View Ledger →</Link>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            <Link href="/admin/leave" className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 hover:border-blue-500 transition-colors block">
              <span className="block text-2xl font-black text-[#3758D8]">{leaveBalances.annual}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Annual</span>
            </Link>
            <Link href="/admin/leave" className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 hover:border-purple-500 transition-colors block">
              <span className="block text-2xl font-black text-purple-600">{leaveBalances.sick}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Sick</span>
            </Link>
            <Link href="/admin/leave" className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 hover:border-amber-500 transition-colors block">
              <span className="block text-2xl font-black text-amber-600">{leaveBalances.casual}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Casual</span>
            </Link>
            <Link href="/admin/leave" className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 hover:border-rose-500 transition-colors block">
              <span className="block text-2xl font-black text-rose-600">{leaveBalances.emergency}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Emergency</span>
            </Link>
          </div>
        </div>

        {/* Payroll Summary Card */}
        <div className="md:col-span-4 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Payroll Summary</h2>
            <Link href="/admin/payroll" className="text-xs font-semibold text-[#3758D8] hover:underline">View Report →</Link>
          </div>

          <div className="py-2">
            <span className="text-xs font-semibold text-slate-500">Total April 2025 Disbursement</span>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {formatBDT(245000)}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              ↑ 12% vs last month • 248 Payslips Ready
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Locked & Finalized</span>
            <span className="font-bold text-emerald-600">Reconciled</span>
          </div>
        </div>

        {/* Bangladesh Landmark Motif Banner */}
        <div className="md:col-span-3 rounded-3xl bg-gradient-to-br from-[#17243B] via-[#0F172A] to-[#10B981]/20 p-6 text-white flex flex-col justify-between border border-slate-800 shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              National Edition
            </span>
            <h3 className="text-base font-bold text-white mt-2">WorkForce 360</h3>
            <p className="text-xs text-slate-300">Building a Productive & Digital Bangladesh</p>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Asia/Dhaka</span>
            <span>BDT ৳ Localization</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* INTERACTIVE MODALS FOR EVERY SINGLE DASHBOARD OPTION */}
      {/* ============================================================== */}

      {/* 1. Modal: Add Employee */}
      {activeModal === 'ADD_EMP' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Quick Add Employee</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast(`Employee ${newEmpName || 'New Member'} successfully registered to ${newEmpDept}!`);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahfuzur Rahman"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Department</label>
                  <select
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option>Engineering</option>
                    <option>Human Resources</option>
                    <option>Sales & Marketing</option>
                    <option>Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Gross Salary (BDT ৳)</label>
                  <input
                    type="number"
                    value={newEmpSalary}
                    onChange={(e) => setNewEmpSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3">
                <Link href="/admin/employees" className="text-[#3758D8] font-bold hover:underline">
                  Go to Full Directory →
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 shadow-md"
                >
                  Confirm & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Mark Attendance */}
      {activeModal === 'MARK_ATTENDANCE' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Admin Attendance Punch Override</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <p className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Inside Banani HQ Geofence (23.7937° N, 90.4048° E)
              </p>
              <p className="text-[11px] text-emerald-600">Accuracy: 8 meters • Biometric validation matched</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Select Employee</label>
                <select className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
                  <option>Ahmed Rahman (EMP-002) - Software Engineer</option>
                  <option>Sarah Khan (EMP-003) - HR Executive</option>
                  <option>Tanvir Hasan (EMP-001) - Lead Engineer</option>
                  <option>Rafiq Ahmed (EMP-004) - Marketing</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => triggerToast('Successfully marked Check-In at 09:15 AM (On Time)!')}
                  className="py-2.5 rounded-xl bg-[#10B981] text-white font-bold hover:bg-emerald-600 shadow-md"
                >
                  Punch Check In
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast('Successfully marked Check-Out at 06:00 PM!')}
                  className="py-2.5 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 shadow-md"
                >
                  Punch Check Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Apply Leave */}
      {activeModal === 'APPLY_LEAVE' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Apply for Employee Leave</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast(`Leave application for ${leaveDays} days (${leaveType}) submitted and routed to manager!`);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Emergency Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Reason for Leave</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Family wedding or personal commitment"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Create Task */}
      {activeModal === 'CREATE_TASK' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Quick Task Assignment</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast(`Task "${taskTitle || 'New Assignment'}" assigned to Ahmed Rahman!`);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Test Biometric GPS Geofence Sync"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Assignee</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
                    <option>Ahmed Rahman</option>
                    <option>Sarah Khan</option>
                    <option>Tanvir Hasan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-700 shadow-md"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Add Project */}
      {activeModal === 'ADD_PROJECT' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Quick Add Project</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast(`Project "${projName || 'New Project'}" created with budget ${formatBDT(projBudget)}!`);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sylhet Fiber Backbone Expansion"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Budget in BDT (৳)</label>
                <input
                  type="number"
                  value={projBudget}
                  onChange={(e) => setProjBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-md"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal: Generate Report */}
      {activeModal === 'GEN_REPORT' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Quick Export Report</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => triggerToast('Downloaded Monthly Attendance Compliance Ledger (XLSX)!')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left font-bold flex items-center justify-between transition-colors"
              >
                <span>Attendance & Late Minutes Ledger</span>
                <Download className="w-4 h-4 text-[#3758D8]" />
              </button>
              <button
                type="button"
                onClick={() => triggerToast('Downloaded Bangladesh Bank BEFTN Salary Batch File (CSV)!')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left font-bold flex items-center justify-between transition-colors"
              >
                <span>BEFTN Auto-Payroll Bank Batch</span>
                <Download className="w-4 h-4 text-emerald-600" />
              </button>
              <button
                type="button"
                onClick={() => triggerToast('Downloaded NBR Income Tax (TDS) Withholding Certificate (PDF)!')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left font-bold flex items-center justify-between transition-colors"
              >
                <span>NBR TDS Tax Withholding Certificate</span>
                <Download className="w-4 h-4 text-rose-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal: View All Activities */}
      {activeModal === 'VIEW_ACTIVITIES' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Audit Log & All Recent Activities</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentActivities.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-[#3758D8] font-bold flex items-center justify-center text-[11px]">
                      {act.avatarText}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{act.title}</p>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{act.type}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{act.timeAgo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal: View Department Breakdown */}
      {activeModal === 'VIEW_DEPTS' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Department Headcount & Allocation</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5">
              {departmentDistribution.map((d) => (
                <div key={d.name} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="font-bold text-slate-900 dark:text-white">{d.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#3758D8]">{d.count} Staff</span>
                    <span className="block text-[10px] text-slate-400 font-semibold">{d.percentage}% of Workforce</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. Modal: Calendar */}
      {activeModal === 'VIEW_CALENDAR' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Corporate Calendar & Schedule</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5">
              {upcomingEvents.map((ev, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{ev.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.badgeColor}`}>{ev.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{ev.time}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => triggerToast('Meeting invite scheduled for tomorrow at 10:00 AM!')}
              className="w-full py-2.5 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 transition-colors shadow-md"
            >
              + Schedule New Meeting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

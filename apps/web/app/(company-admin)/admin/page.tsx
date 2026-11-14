'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  ArrowUpRight,
  TrendingUp,
  FileText,
  UserCheck,
  Check,
  X,
  MapPin,
  CalendarPlus,
  Briefcase,
  Download,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const attendanceWeekData = [
  { day: 'Mon', present: 228, absent: 20 },
  { day: 'Tue', present: 235, absent: 13 },
  { day: 'Wed', present: 232, absent: 16 },
  { day: 'Thu', daylight: 240, present: 240, absent: 8 },
  { day: 'Fri', present: 220, absent: 28 },
  { day: 'Sat', present: 215, absent: 33 },
  { day: 'Sun', present: 238, absent: 10 },
];

export default function CompanyAdminDashboard() {
  const [activeModal, setActiveModal] = useState<'NONE' | 'ADD_EMP' | 'CREATE_TASK' | 'APPLY_LEAVE' | 'VIEW_REPORTS'>('NONE');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setActiveModal('NONE');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Quick form states
  const [empName, setEmpName] = useState('');
  const [empDept, setEmpDept] = useState('Engineering');
  const [taskName, setTaskName] = useState('');
  const [leaveDays, setLeaveDays] = useState(2);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black">Welcome Back, Admin! 👋</h1>
          <p className="text-blue-100 text-sm mt-1">Here&apos;s what&apos;s happening with your team today at WorkForce 360 Ltd.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/employees"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-md transition-colors"
          >
            Manage Workforce
          </Link>
          <Link
            href="/admin/payroll"
            className="px-4 py-2 bg-[#16A389] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
          >
            Review Payroll
          </Link>
        </div>
      </div>

      {/* Mobile App Registration Access Requests Alert */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 border border-amber-300 dark:border-amber-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Mobile App Access Requests Pending</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              New employee registration requests received from Android Mobile App v2.0.0 awaiting HR approval.
            </p>
          </div>
        </div>
        <Link
          href="/admin/access-requests"
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
        >
          <span>Review & Approve Requests</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards (Matches Image 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <Link
          href="/admin/employees"
          className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-[#3758D8] transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Total Employees</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">↑ +12%</span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">248</h3>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#3758D8] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Link>

        {/* Present Today */}
        <Link
          href="/admin/attendance"
          className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Present Today</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">↑ +8%</span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">230</h3>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Link>

        {/* On Leave */}
        <Link
          href="/admin/leave"
          className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-amber-500 transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">On Leave</span>
            <span className="text-xs font-bold text-rose-600 flex items-center">↓ -2%</span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">12</h3>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Link>

        {/* Pending Tasks */}
        <Link
          href="/admin/tasks"
          className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-purple-500 transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Pending Tasks</span>
            <span className="text-xs font-bold text-purple-600 flex items-center">↑ +5%</span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">45</h3>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Link>
      </div>

      {/* Main Grid: Attendance Week Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Overview Line Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Attendance Overview</h2>
              <p className="text-xs text-slate-500">Weekly present vs absent distribution at Banani HQ</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3758D8]" /> Present</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" /> Absent</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceWeekData}>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="present" stroke="#3758D8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="absent" stroke="#94A3B8" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Performance Gauge */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Quick Actions</h2>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setActiveModal('ADD_EMP')}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between text-xs font-bold"
              >
                <span className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-[#3758D8]" /> Add Employee
                </span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('CREATE_TASK')}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between text-xs font-bold"
              >
                <span className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-emerald-600" /> Create Task
                </span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('APPLY_LEAVE')}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between text-xs font-bold"
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-purple-600" /> Apply Leave
                </span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('VIEW_REPORTS')}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between text-xs font-bold"
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-600" /> View Reports
                </span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Team Performance Gauge */}
          <Link
            href="/admin/performance"
            className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center block hover:border-emerald-500 transition-all"
          >
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Team Performance</h2>
            <div className="my-4">
              <span className="text-4xl font-black text-emerald-600">92%</span>
              <p className="text-xs font-semibold text-slate-500 mt-1">Overall Performance</p>
              <span className="text-xs font-bold text-emerald-600">↑ +2% this week</span>
            </div>
            <p className="text-[11px] text-[#3758D8] font-bold hover:underline">View Appraisals & Leaderboard →</p>
          </Link>
        </div>
      </div>

      {/* Modals for Company Admin Actions */}
      {activeModal === 'ADD_EMP' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Add New Employee</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast(`Employee ${empName || 'New Employee'} registered to ${empDept}!`);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asif Mahmud"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Department</label>
                <select
                  value={empDept}
                  onChange={(e) => setEmpDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                >
                  <option>Engineering</option>
                  <option>Human Resources</option>
                  <option>Marketing & Sales</option>
                  <option>Finance</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 shadow-md"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'CREATE_TASK' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Create New Task</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast(`Task "${taskName || 'Assignment'}" created and dispatched!`);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prepare BEFTN payroll export"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md"
                >
                  Confirm Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'APPLY_LEAVE' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Apply for Leave</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast(`Leave request for ${leaveDays} days submitted for approval!`);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Duration (Days)</label>
                <input
                  type="number"
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'VIEW_REPORTS' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Export Company Reports</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <Link
                href="/admin/reports"
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-left font-bold flex items-center justify-between transition-colors block"
              >
                <span>View All 6 Generated Reports</span>
                <Download className="w-4 h-4 text-amber-600" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

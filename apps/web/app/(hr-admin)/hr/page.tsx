'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users2,
  UserPlus,
  Briefcase,
  CalendarCheck,
  Clock,
  HeartHandshake,
  Cake,
  Award,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Calendar,
  ChevronRight,
  FileText,
  Mail,
  Search,
  Filter,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useSidebar } from '@/lib/sidebar-context';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const recruitmentFunnel = [
  { stage: 'Applied', count: 45, color: '#3758D8' },
  { stage: 'Screened', count: 28, color: '#06B6D4' },
  { stage: 'Interview', count: 12, color: '#8B5CF6' },
  { stage: 'Offered', count: 4, color: '#F59E0B' },
  { stage: 'Hired', count: 2, color: '#10B981' },
];

const employmentTypes = [
  { name: 'Full-Time Permanent', value: 82, color: '#16A389' },
  { name: 'Fixed-Term Contract', value: 12, color: '#3758D8' },
  { name: 'Probationary Trainee', value: 6, color: '#F59E0B' },
];

const onboardingQueue = [
  { id: 'ob-1', name: 'Farhan Kabir', role: 'DevOps Engineer', dept: 'Engineering', start: '01 May 2025', progress: 80 },
  { id: 'ob-2', name: 'Nusrat Jahan', role: 'UI/UX Designer', dept: 'Product', start: '05 May 2025', progress: 50 },
  { id: 'ob-3', name: 'Mahir Faisal', role: 'Sales Executive', dept: 'Sales', start: '08 May 2025', progress: 30 },
];

const upcomingInterviews = [
  { id: 'int-1', candidate: 'Nasir Uddin', role: 'Senior React Developer', time: 'Today, 02:30 PM', round: 'Technical Review' },
  { id: 'int-2', candidate: 'Sumaiya Akter', role: 'HR Specialist', time: 'Tomorrow, 11:00 AM', round: 'Cultural Fit' },
  { id: 'int-3', candidate: 'Tariqul Islam', role: 'QA Automation Lead', time: '28 Apr, 03:00 PM', round: 'Architecture' },
];

export default function HRAdminDashboard() {
  const { hideDashboardOptions, toggleDashboardOptions } = useSidebar();
  const [activeModal, setActiveModal] = useState<'NONE' | 'POST_JOB' | 'ONBOARD_EMP' | 'SCHEDULE_INT' | 'APPROVE_LEAVE'>('NONE');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [accessRequests, setAccessRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/access-requests');
      if (res.ok) {
        const json = await res.json();
        setAccessRequests(json.requests || []);
      }
    } catch (e) {}
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const pendingRequests = accessRequests.filter((r) => r.status === 'PENDING');

  const handleApprove = async (id: string, name: string) => {
    try {
      const res = await fetch('/api/access-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'APPROVE', reviewedBy: 'HR Admin' }),
      });
      if (res.ok) {
        triggerToast(`Access approved for ${name}! Account is now active.`);
        fetchRequests();
      }
    } catch (e) {}
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch('/api/access-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'REJECT', reviewedBy: 'HR Admin' }),
      });
      if (res.ok) {
        triggerToast('Registration request rejected.');
        fetchRequests();
      }
    } catch (e) {}
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setActiveModal('NONE');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Form states
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Engineering');
  const [candidateName, setCandidateName] = useState('');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-teal-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0C1E28] via-[#0E3B3E] to-[#16A389] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-300 bg-white/10 px-3 py-1 rounded-full w-fit mb-2 backdrop-blur-md">
            <HeartHandshake className="w-3.5 h-3.5 text-teal-300" /> People & Culture Management Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-black">People Operations & Talent Ecosystem</h1>
          <p className="text-teal-100 text-sm mt-1">
            Oversee recruitment pipelines, onboarding workflows, leave allocations & employee lifecycle satisfaction.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleDashboardOptions}
            className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 border border-white/20 shadow-xs"
            title="Toggle extra options"
          >
            {hideDashboardOptions ? (
              <>
                <Eye className="w-3.5 h-3.5 text-teal-200" />
                <span>Show Options</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-teal-200" />
                <span>Hide Options</span>
              </>
            )}
          </button>
          <button
            onClick={() => setActiveModal('POST_JOB')}
            className="px-4 py-2.5 rounded-xl bg-white text-teal-900 text-xs font-bold hover:bg-teal-50 transition-colors flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4 text-[#16A389]" /> Post Job Vacancy
          </button>
          <button
            onClick={() => setActiveModal('ONBOARD_EMP')}
            className="px-4 py-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white text-xs font-bold transition-colors border border-teal-600/50 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Onboard Staff
          </button>
        </div>
      </div>

      {/* Mobile App Access Requests & Approvals */}
      {pendingRequests.length > 0 && (
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-amber-300 dark:border-amber-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Pending Mobile App Access Requests ({pendingRequests.length})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700">
                Needs HR Approval
              </span>
              <Link
                href="/hr/access-requests"
                className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>Manage All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <span>{req.fullName}</span>
                    <span className="text-[10px] text-teal-600 font-semibold font-mono">({req.email})</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{req.designation} • {req.department}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{req.requestedAt}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleApprove(req.id, req.fullName)}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12 HR-SPECIFIC KPI METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500">Total Workforce</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">248</h3>
          <span className="text-[10px] text-teal-600 font-bold">242 Active Staff</span>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500">New Hires</span>
          <h3 className="text-2xl font-black text-teal-600 mt-1">14</h3>
          <span className="text-[10px] text-emerald-600 font-bold">This Month</span>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500">Present Today</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">230</h3>
          <span className="text-[10px] text-slate-400 font-semibold">92.7% Presence</span>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500">On Leave Today</span>
          <h3 className="text-2xl font-black text-purple-600 mt-1">12</h3>
          <span className="text-[10px] text-purple-600 font-bold">4 Pending Reviews</span>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500">Pending Onboarding</span>
          <h3 className="text-2xl font-black text-amber-500 mt-1">5</h3>
          <span className="text-[10px] text-amber-600 font-bold">Checklists Open</span>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500">Open Vacancies</span>
          <h3 className="text-2xl font-black text-[#3758D8] mt-1">4</h3>
          <span className="text-[10px] text-blue-500 font-bold">45 Applicants</span>
        </div>
      </div>

      {/* Main Visuals Grid: Recruitment Pipeline & Employment Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recruitment Pipeline Funnel */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Recruitment Pipeline</h2>
              <p className="text-xs text-slate-500">Hiring velocity from applicant registration to signed contract</p>
            </div>
            <button
              onClick={() => setActiveModal('SCHEDULE_INT')}
              className="text-xs font-bold text-[#16A389] hover:underline"
            >
              + Schedule Interview
            </button>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recruitmentFunnel}>
                <XAxis dataKey="stage" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val} Candidates`, 'Pipeline Count']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {recruitmentFunnel.map((entry, index) => (
                    <Cell key={`funnel-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employment Type Distribution Donut */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Workforce Distribution</h2>
              <p className="text-xs text-slate-500">Employment contract classifications</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
              97.8% Retention
            </span>
          </div>

          <div className="relative h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={employmentTypes} innerRadius={50} outerRadius={70} dataKey="value">
                  {employmentTypes.map((entry, index) => (
                    <Cell key={`type-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white">82%</span>
              <span className="text-[10px] font-bold text-teal-600 uppercase">Permanent</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {employmentTypes.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  {t.name}
                </span>
                <span className="font-bold">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Onboarding Queue & Candidate Interviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Onboarding Tracker */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#16A389]" /> Pending Onboarding Checklists
            </h2>
            <Link href="/hr/onboarding" className="text-xs font-bold text-[#16A389] hover:underline">
              View All (5) →
            </Link>
          </div>

          <div className="space-y-3">
            {onboardingQueue.map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">{item.role} • {item.dept}</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#16A389]">Starts {item.start}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-[#16A389] rounded-full" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Interviews Today */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#3758D8]" /> Upcoming Candidate Interviews
            </h2>
            <button
              onClick={() => setActiveModal('SCHEDULE_INT')}
              className="text-xs font-bold text-[#3758D8] hover:underline"
            >
              + Add Candidate
            </button>
          </div>

          <div className="space-y-3">
            {upcomingInterviews.map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 dark:text-white">{item.candidate}</h4>
                  <p className="text-[11px] text-slate-500">{item.role}</p>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700">
                    {item.round}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">{item.time}</span>
                  <button
                    onClick={() => triggerToast(`Interview room link sent to ${item.candidate}!`)}
                    className="mt-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#16A389] font-bold text-[10px] hover:bg-teal-100 transition-colors"
                  >
                    Send Zoom Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Celebrations & Lifecycle Alerts (Birthdays & Anniversaries) */}
      {!hideDashboardOptions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Cake className="w-5 h-5" />
              <span>Upcoming Employee Birthdays</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 dark:text-white">Ahmed Rahman</strong>
                  <p className="text-[11px] text-slate-400">Engineering • 28 April</p>
                </div>
                <button
                  onClick={() => triggerToast('Birthday greeting message scheduled!')}
                  className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-[10px]"
                >
                  Send Wish
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 space-y-3">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
              <Award className="w-5 h-5" />
              <span>Work Anniversaries (Milestones)</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200/50 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 dark:text-white">Tanvir Hasan (3 Years)</strong>
                  <p className="text-[11px] text-slate-400">Engineering Team Lead • 30 April</p>
                </div>
                <button
                  onClick={() => triggerToast('Recognition certificate sent to Tanvir Hasan!')}
                  className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-bold text-[10px]"
                >
                  Send Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals for HR Actions */}
      {activeModal === 'POST_JOB' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Create Job Vacancy Notice</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast(`Job vacancy "${jobTitle}" posted to career portal and job boards!`);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Flutter Mobile Architect"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Department</label>
                <select
                  value={jobDept}
                  onChange={(e) => setJobDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                >
                  <option>Engineering</option>
                  <option>Human Resources</option>
                  <option>Product & Design</option>
                  <option>Sales & Marketing</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#16A389] text-white font-bold hover:bg-teal-700 shadow-md"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'SCHEDULE_INT' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Schedule Candidate Interview</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast(`Interview scheduled with ${candidateName || 'Candidate'}!`);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asaduzzaman Nur"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 shadow-md"
                >
                  Send Calendar Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'ONBOARD_EMP' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Start Employee Onboarding</h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-500">
              This initiates the onboarding checklist, hardware provisioning, and sends account activation email.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => triggerToast('Onboarding package and NDA forms dispatched to candidate!')}
                className="px-4 py-2 rounded-xl bg-[#16A389] text-white font-bold hover:bg-teal-700 shadow-md"
              >
                Initiate Onboarding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

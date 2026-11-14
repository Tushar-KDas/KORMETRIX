'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Fingerprint,
  Calendar,
  CheckSquare,
  Briefcase,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Download,
  AlertCircle,
  Plus,
  X,
  FileText,
  DollarSign,
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';
import { useCurrentUser } from '@/lib/use-current-user';

interface EmployeeTask {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  due: string;
  done: boolean;
}

const initialTasks: EmployeeTask[] = [
  { id: '1', title: 'Complete UI Design for Mobile App V2', priority: 'High', due: 'Today, 5:00 PM', done: false },
  { id: '2', title: 'Fix Login Auth Token Persistence', priority: 'High', due: 'Today, 3:00 PM', done: false },
  { id: '3', title: 'Prepare Weekly Sprint Status Report', priority: 'Low', due: 'Tomorrow, 10:00 AM', done: true },
  { id: '4', title: 'Review PR #42 for Geofence Boundary Check', priority: 'Medium', due: '15 Nov', done: true },
];

export default function EmployeePortalDashboard() {
  const { user: currentUser } = useCurrentUser();
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [punchMessage, setPunchMessage] = useState<string | null>(null);
  const [tasks, setTasks] = useState<EmployeeTask[]>(initialTasks);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);

  // Leave Form State
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [leaveDays, setLeaveDays] = useState('2');
  const [leaveReason, setLeaveReason] = useState('');

  const completedCount = tasks.filter((t) => t.done).length;

  const handlePunch = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isCheckedIn) {
      setIsCheckedIn(false);
      setPunchMessage(`Checked out at ${timeStr}. Have a great evening!`);
    } else {
      setIsCheckedIn(true);
      setPunchMessage(`Checked in at ${timeStr} inside Banani HQ GPS Geofence (23.7937° N, 90.4066° E)!`);
    }
    setTimeout(() => setPunchMessage(null), 4000);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLeaveModal(false);
    setPunchMessage(`Leave request (${leaveType}, ${leaveDays} Days) submitted to your manager!`);
    setTimeout(() => setPunchMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Greeting Banner (Matches Mobile Mockup Image 3) */}
      <div className="bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black">Hello, {currentUser.name}! 👋</h1>
          <p className="text-blue-100 text-sm mt-1">{currentUser.designation} • {currentUser.department} ({currentUser.employeeCode})</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 border ${
              isCheckedIn
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              Today&apos;s Status: {isCheckedIn ? 'Present (Checked In)' : 'Checked Out'}
            </span>
            <span className="text-xs text-blue-200">09:15 AM, Banani HQ Geofence</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowLeaveModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-blue-300" /> Apply Leave
          </button>
          <button
            onClick={handlePunch}
            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg flex items-center gap-2 ${
              isCheckedIn
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30'
            }`}
          >
            <Fingerprint className="w-5 h-5" />
            {isCheckedIn ? 'Punch Out' : 'Punch In (GPS Geofence)'}
          </button>
        </div>
      </div>

      {punchMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" /> {punchMessage}
        </div>
      )}

      {/* Quick Overview (Matches Mobile Mockup Image 3) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs text-center">
          <span className="text-3xl font-black text-slate-900 dark:text-white">22</span>
          <p className="text-xs font-bold text-slate-500 mt-1">Working Days</p>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs text-center">
          <span className="text-3xl font-black text-purple-600">2</span>
          <p className="text-xs font-bold text-slate-500 mt-1">Leaves Taken</p>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs text-center">
          <span className="text-3xl font-black text-emerald-600">{completedCount}</span>
          <p className="text-xs font-bold text-slate-500 mt-1">Tasks Completed</p>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs text-center">
          <span className="text-3xl font-black text-[#3758D8]">92%</span>
          <p className="text-xs font-bold text-slate-500 mt-1">Your Performance</p>
        </div>
      </div>

      {/* Main Grid: My Tasks & Payslip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* My Tasks (Interactive Checklist) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">My Assigned Tasks</h2>
              <p className="text-xs text-slate-400 mt-0.5">Check off items to instantly update your sprint progress</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#3758D8] text-xs font-bold font-mono">
              {completedCount} / {tasks.length} Done
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  task.done
                    ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800 opacity-70'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-[#3758D8]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 accent-[#3758D8] rounded cursor-pointer"
                  />
                  <div>
                    <h4 className={`text-sm font-bold ${task.done ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {task.priority} Priority
                      </span>
                      <span className="text-xs text-slate-400">{task.due}</span>
                    </div>
                  </div>
                </div>

                <span className={`text-xs font-bold ${task.done ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {task.done ? 'Completed' : 'In Progress'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Salary & Payslip Quick Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Payslip (April 2025)</h2>
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
              <p className="text-xs text-slate-500 font-semibold">Net Disbursed Salary</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {formatBDT(67750)}
              </h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">✓ Credited to BRAC Bank A/C ...6002</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Basic Salary (50%)</span>
                <span className="font-mono font-bold">{formatBDT(37500)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>House Rent (25%)</span>
                <span className="font-mono font-bold">{formatBDT(18750)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Medical & Conveyance</span>
                <span className="font-mono font-bold">{formatBDT(18750)}</span>
              </div>
              <div className="flex justify-between text-rose-600 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Statutory Tax & Provident Fund</span>
                <span className="font-mono font-bold">-{formatBDT(7250)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowSlipModal(true)}
                className="flex-1 py-2.5 rounded-xl bg-[#3758D8] text-white font-bold text-xs hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" /> View / Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Apply for Leave</h3>
              <button onClick={() => setShowLeaveModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs"
                >
                  <option>Casual Leave (11 Days Remaining)</option>
                  <option>Sick Leave (14 Days Remaining)</option>
                  <option>Annual Vacation (18 Days Remaining)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Number of Days</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Start Date</label>
                  <input type="date" required className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Reason</label>
                <textarea
                  rows={2}
                  placeholder="State your reason for leave..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowLeaveModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#3758D8] text-white text-xs font-bold shadow-md shadow-blue-500/20">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Official Salary Payslip - April 2025</h3>
                <p className="text-xs text-slate-400">WorkForce 360 Ltd • Corporate HQ, Dhaka</p>
              </div>
              <button onClick={() => setShowSlipModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Employee Name:</span><span className="font-bold">Ahmed Rahman (ENG-042)</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Gross Salary:</span><span className="font-mono font-bold">{formatBDT(75000)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tax Deductions (TIN):</span><span className="font-mono text-rose-600 font-bold">-{formatBDT(5250)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Provident Fund (PF):</span><span className="font-mono text-rose-600 font-bold">-{formatBDT(2000)}</span></div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                <span>Net Payable:</span>
                <span className="text-[#3758D8] font-mono">{formatBDT(67750)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  showAppToast('PDF Payslip downloaded to local device!');
                  setShowSlipModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#3758D8] text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PDF File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

interface LeaveApplication {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  appliedAt: string;
}

const mockApplications: LeaveApplication[] = [
  { id: 'LV-101', type: 'Casual Leave', startDate: '20 Nov, 2026', endDate: '21 Nov, 2026', days: 2, reason: 'Family urgent matter in Chittagong', status: 'Pending', appliedAt: 'Yesterday' },
  { id: 'LV-102', type: 'Sick Leave', startDate: '04 Oct, 2026', endDate: '04 Oct, 2026', days: 1, reason: 'Doctor checkup', status: 'Approved', appliedAt: '03 Oct, 2026' },
  { id: 'LV-103', type: 'Casual Leave', startDate: '15 Sep, 2026', endDate: '15 Sep, 2026', days: 1, reason: 'Personal errand', status: 'Approved', appliedAt: '12 Sep, 2026' },
];

export default function EmployeeLeavePage() {
  const [apps, setApps] = useState(mockApplications);
  const [showModal, setShowModal] = useState(false);
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp: LeaveApplication = {
      id: `LV-${100 + apps.length + 1}`,
      type: leaveType,
      startDate: 'Next Monday',
      endDate: 'Next Tuesday',
      days: Number(days),
      reason: reason || 'Personal reasons',
      status: 'Pending',
      appliedAt: 'Just now',
    };
    setApps([newApp, ...apps]);
    setShowModal(false);
    setToast('Leave application submitted to your manager!');
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-blue-200 dark:border-blue-800">
            Time Off Portal
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Leave Balance & Requests</h1>
          <p className="text-slate-500 text-xs mt-1">Check remaining leave quota balances and track approval status from management.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#3758D8] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {toast}
        </div>
      )}

      {/* Leave Balances Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Casual Leave</span>
            <span className="text-xs font-bold text-blue-600">Total: 10 Days</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">8 Available</h3>
          <p className="text-xs text-slate-500">2 Days used this year</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Sick Leave</span>
            <span className="text-xs font-bold text-emerald-600">Total: 14 Days</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">13 Available</h3>
          <p className="text-xs text-slate-500">1 Day used this year</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Annual Vacation</span>
            <span className="text-xs font-bold text-purple-600">Total: 18 Days</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">18 Available</h3>
          <p className="text-xs text-slate-500">Full allowance intact</p>
        </div>
      </div>

      {/* History */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">My Application History</h2>

        <div className="space-y-3">
          {apps.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{app.type}</span>
                  <span className="text-xs text-slate-400 font-mono">({app.days} {app.days === 1 ? 'Day' : 'Days'})</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  Dates: <b className="text-slate-900 dark:text-white">{app.startDate}</b> to <b className="text-slate-900 dark:text-white">{app.endDate}</b>
                </p>
                <p className="text-xs text-slate-500 italic mt-0.5">&quot;{app.reason}&quot;</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400">Applied {app.appliedAt}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : app.status === 'Pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Apply for Leave</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs"
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Annual Vacation</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Days</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
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
                  placeholder="Enter detailed reason..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#3758D8] text-white text-xs font-bold shadow-md shadow-blue-500/20">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

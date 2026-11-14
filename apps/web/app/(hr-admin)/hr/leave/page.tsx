'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  Check,
  X,
  Clock,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  leaveType: string;
  duration: string;
  dates: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LV-301',
    employeeName: 'Ahmed Rahman',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    duration: '2 Days',
    dates: '20 Nov - 21 Nov, 2026',
    reason: 'Family event out of town (Chittagong)',
    status: 'Pending',
    appliedOn: 'Yesterday, 4:15 PM',
  },
  {
    id: 'LV-302',
    employeeName: 'Sadia Islam',
    department: 'Design',
    leaveType: 'Sick Leave',
    duration: '1 Day',
    dates: 'Today (14 Nov, 2026)',
    reason: 'Sudden viral flu and fever doctor appointment',
    status: 'Pending',
    appliedOn: 'Today, 8:30 AM',
  },
  {
    id: 'LV-303',
    employeeName: 'Kamrul Ahsan',
    department: 'Finance',
    leaveType: 'Annual Vacation',
    duration: '5 Days',
    dates: '01 Dec - 05 Dec, 2026',
    reason: 'Annual family holiday in Cox’s Bazar',
    status: 'Approved',
    appliedOn: '10 Nov, 2026',
  },
];

export default function HRLeavePage() {
  const [requests, setRequests] = useState(mockLeaveRequests);
  const [notification, setNotification] = useState<string | null>(null);

  const handleAction = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    const item = requests.find((r) => r.id === id);
    setNotification(`Leave request for ${item?.employeeName} was marked ${newStatus}.`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-teal-200 dark:border-teal-800">
            Leave Management
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Leave Approvals & Quotas</h1>
          <p className="text-slate-500 text-xs mt-1">Review employee leave applications, monitor annual leave balances, and enforce company policies.</p>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          {notification}
        </div>
      )}

      {/* Quota Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Casual Leaves</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">10 Days / Yr</h3>
          <span className="text-[10px] text-teal-600 font-bold">Standard Entitlement</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Sick Leaves</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">14 Days / Yr</h3>
          <span className="text-[10px] text-teal-600 font-bold">Medical Certificate req &gt; 2 days</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Earned / Annual</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">18 Days / Yr</h3>
          <span className="text-[10px] text-teal-600 font-bold">Encashment eligible</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Pending Review</p>
          <h3 className="text-2xl font-black text-amber-500 mt-1">
            {requests.filter((r) => r.status === 'Pending').length} Requests
          </h3>
          <span className="text-[10px] text-amber-500 font-bold">Action required</span>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Pending Leave Requests</h2>

        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{req.employeeName}</span>
                  <span className="text-xs text-slate-400">• {req.department}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#3758D8]">
                    {req.leaveType}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Dates: <span className="font-bold text-slate-900 dark:text-white">{req.dates}</span> ({req.duration})
                </p>
                <p className="text-xs text-slate-500 italic">&quot;{req.reason}&quot;</p>
                <span className="text-[10px] text-slate-400 block">Submitted {req.appliedOn}</span>
              </div>

              <div className="flex items-center gap-2">
                {req.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(req.id, 'Approved')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A389] hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'Rejected')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors border border-rose-200"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

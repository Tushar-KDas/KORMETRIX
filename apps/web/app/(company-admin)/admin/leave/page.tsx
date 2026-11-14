'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  CalendarCheck,
  Check,
  X,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface LeaveRequestItem {
  id: string;
  name: string;
  code: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  stepOrder: number;
  submittedAt: string;
}

const initialLeaveRequests: LeaveRequestItem[] = [
  {
    id: 'lr-1',
    name: 'Sarah Khan',
    code: 'EMP-003',
    leaveType: 'Annual Leave',
    startDate: '28 Apr 2025',
    endDate: '30 Apr 2025',
    days: 3,
    reason: 'Family wedding event in Chittagong',
    status: 'PENDING',
    stepOrder: 1,
    submittedAt: '2 min ago',
  },
  {
    id: 'lr-2',
    name: 'Ahmed Rahman',
    code: 'EMP-002',
    leaveType: 'Sick Leave',
    startDate: '02 May 2025',
    endDate: '03 May 2025',
    days: 2,
    reason: 'Doctor prescribed rest after fever',
    status: 'PENDING',
    stepOrder: 1,
    submittedAt: '1 hour ago',
  },
];

export default function LeaveAdminPage() {
  const [requests, setRequests] = useState(initialLeaveRequests);

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          };
        }
        return r;
      })
    );
    showAppToast(`Leave request ${action === 'APPROVE' ? 'Approved' : 'Rejected'} and balance ledger updated!`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Leave Management & Approval Routing</h1>
          <p className="text-slate-500 text-sm">Two-stage approval routing, balance ledger deduction & holiday calendar.</p>
        </div>
      </div>

      {/* Leave Ledger Balances */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-3xl font-black text-[#3758D8]">18</span>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Annual Leave Days</p>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-3xl font-black text-purple-600">14</span>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Sick Leave Days</p>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-3xl font-black text-amber-600">10</span>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Casual Leave Days</p>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-3xl font-black text-rose-600">5</span>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">Special / Emergency</p>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Pending Approval Queue</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Requester</th>
                <th className="p-3">Type</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Days</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-xl">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">{r.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{r.code}</p>
                  </td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{r.leaveType}</td>
                  <td className="p-3 font-medium text-slate-600 dark:text-slate-300">
                    {r.startDate} to {r.endDate}
                  </td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{r.days} Days</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">{r.reason}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : r.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {r.status === 'PENDING' ? 'Stage 1 Review' : r.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {r.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAction(r.id, 'APPROVE')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(r.id, 'REJECT')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold transition-colors flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

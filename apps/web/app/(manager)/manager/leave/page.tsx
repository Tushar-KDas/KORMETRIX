'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  Check,
  X,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface SquadLeave {
  id: string;
  name: string;
  avatar: string;
  type: string;
  period: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const mockSquadLeaves: SquadLeave[] = [
  {
    id: 'L-1',
    name: 'Ahmed Rahman',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    type: 'Casual Leave',
    period: '20 Nov - 21 Nov, 2026',
    days: 2,
    reason: 'Family urgent matter in Chittagong',
    status: 'Pending',
  },
  {
    id: 'L-2',
    name: 'Tanvir Hossain',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    type: 'Sick Leave',
    period: 'Today (14 Nov)',
    days: 1,
    reason: 'Medical appointment',
    status: 'Approved',
  },
];

export default function ManagerLeavePage() {
  const [leaves, setLeaves] = useState(mockSquadLeaves);
  const [toast, setToast] = useState<string | null>(null);

  const handleDecision = (id: string, decision: 'Approved' | 'Rejected') => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: decision } : l))
    );
    const item = leaves.find((l) => l.id === id);
    setToast(`${item?.name}'s leave request was ${decision}!`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-purple-200 dark:border-purple-800">
            Manager Approvals
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Squad Leave Approvals</h1>
          <p className="text-slate-500 text-xs mt-1">Review leave applications from your direct reports with instant 1-click approvals.</p>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-purple-600" />
          {toast}
        </div>
      )}

      {/* Leave List */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Squad Requests</h2>

        <div className="space-y-3">
          {leaves.map((l) => (
            <div
              key={l.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img src={l.avatar} alt={l.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{l.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      {l.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                    {l.period} ({l.days} {l.days === 1 ? 'Day' : 'Days'})
                  </p>
                  <p className="text-xs text-slate-500 italic mt-0.5">&quot;{l.reason}&quot;</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {l.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleDecision(l.id, 'Approved')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleDecision(l.id, 'Rejected')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors border border-rose-200"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      l.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {l.status}
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

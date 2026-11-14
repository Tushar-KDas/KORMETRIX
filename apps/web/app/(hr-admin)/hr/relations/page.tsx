'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  MessageCircleQuestion,
  Smile,
  AlertTriangle,
  Send,
  Plus,
  CheckCircle,
  ThumbsUp,
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  type: 'Grievance' | 'Suggestion' | 'Survey';
  title: string;
  department: string;
  submittedAt: string;
  status: 'Open' | 'In Review' | 'Resolved';
  isAnonymous: boolean;
}

const mockFeedback: FeedbackItem[] = [
  { id: 'FB-01', type: 'Suggestion', title: 'Request for coffee machine upgrade in Level 4 cafeteria', department: 'Banani HQ', submittedAt: '12 Nov, 2026', status: 'In Review', isAnonymous: true },
  { id: 'FB-02', type: 'Grievance', title: 'Overtime compensation delay for October release cycle', department: 'Engineering', submittedAt: '08 Nov, 2026', status: 'Open', isAnonymous: false },
  { id: 'FB-03', type: 'Survey', title: 'Q3 Workplace Wellbeing & Culture Survey (eNPS Score: +52)', department: 'All Company', submittedAt: '30 Oct, 2026', status: 'Resolved', isAnonymous: true },
];

export default function HREmployeeRelationsPage() {
  const [items, setItems] = useState(mockFeedback);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-teal-200 dark:border-teal-800">
            Workforce Experience
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Employee Relations & Feedback</h1>
          <p className="text-slate-500 text-xs mt-1">Manage grievance tickets, employee pulse surveys, suggestions, and wellbeing initiatives.</p>
        </div>

        <button
          onClick={() => showAppToast('Launching new confidential company pulse survey...')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#16A389] hover:bg-[#12806B] text-white text-xs font-bold transition-all shadow-lg shadow-teal-500/20"
        >
          <Plus className="w-4 h-4" /> Launch Culture Pulse Survey
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-[#16A389] flex items-center justify-center">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Employee Happiness</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">88% Satisfaction</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">eNPS Score</span>
            <h3 className="text-2xl font-black text-blue-600">+52 (Excellent)</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Open Grievance Tickets</span>
            <h3 className="text-2xl font-black text-amber-600">1 Pending</h3>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Feedback & Suggestions</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    {item.type}
                  </span>
                  {item.isAnonymous && (
                    <span className="text-[10px] font-semibold text-slate-400">Anonymous Submission</span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.department} • {item.submittedAt}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-700'
                    : item.status === 'In Review'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

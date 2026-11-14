'use client';
import { showAppToast } from '@/components/common/toast';

import React from 'react';
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';

interface SquadProject {
  id: string;
  name: string;
  client: string;
  deadline: string;
  membersCount: number;
  progress: number;
  status: 'In Progress' | 'On Track' | 'Review';
}

const mockProjects: SquadProject[] = [
  { id: 'PRJ-1', name: 'WorkForce 360 Flutter Mobile Redesign', client: 'Internal Enterprise', deadline: '30 Nov, 2026', membersCount: 4, progress: 85, status: 'In Progress' },
  { id: 'PRJ-2', name: 'Supabase Realtime Geofence Sync Engine', client: 'Enterprise Infra', deadline: '15 Dec, 2026', membersCount: 3, progress: 60, status: 'On Track' },
  { id: 'PRJ-3', name: 'Payroll Auto-Disbursement BRAC Bank API', client: 'Finance Core', deadline: '22 Dec, 2026', membersCount: 2, progress: 40, status: 'In Progress' },
];

export default function ManagerProjectsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-purple-200 dark:border-purple-800">
            Project Delivery
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Engineering Squad Projects</h1>
          <p className="text-slate-500 text-xs mt-1">Track key deliverables, squad allocations, sprint milestones, and deadlines.</p>
        </div>

        <button
          onClick={() => showAppToast('New squad sprint project initiative created!')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#8B5CF6] hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
        >
          <Plus className="w-4 h-4" /> New Initiative
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockProjects.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  {p.status}
                </span>
                <span className="text-sm font-black font-mono text-purple-600">{p.progress}%</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2">{p.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{p.client}</p>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-[#8B5CF6] rounded-full transition-all" style={{ width: `${p.progress}%` }} />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-purple-500" /> {p.membersCount} Engineers</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {p.deadline}</span>
            </div>

            <button
              onClick={() => showAppToast(`Opening sprint burndown board for ${p.name}`)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              View Milestone Board
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

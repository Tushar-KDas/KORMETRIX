'use client';
import { showAppToast } from '@/components/common/toast';

import React from 'react';
import {
  TrendingUp,
  Award,
  Target,
  Star,
  Users,
  Download,
  CheckCircle,
} from 'lucide-react';
import { mockManagerTeam } from '@/lib/mock-data';

export default function ManagerPerformancePage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-purple-200 dark:border-purple-800">
            OKR & Appraisal
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Squad OKRs & Performance</h1>
          <p className="text-slate-500 text-xs mt-1">Review quarterly Key Results, 360 peer feedback, and engineering velocity scores.</p>
        </div>

        <button
          onClick={() => showAppToast('Starting quarterly squad appraisal cycle...')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#8B5CF6] hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
        >
          <Award className="w-4 h-4" /> Start Appraisal Cycle
        </button>
      </div>

      {/* OKR Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-purple-600 uppercase">Q4 Objective 1</span>
            <span className="text-xs font-black text-emerald-600">92% Met</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Ship Multi-Role Enterprise Dashboards</h3>
          <p className="text-xs text-slate-500">Deliver 5 purpose-built dashboards for Super Admin, Company Admin, HR, Manager, and Employee.</p>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-purple-600 uppercase">Q4 Objective 2</span>
            <span className="text-xs font-black text-purple-600">80% Met</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Mobile Offline-Sync & Geofence</h3>
          <p className="text-xs text-slate-500">Maintain sub-second biometric attendance sync with zero punch drops.</p>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: '80%' }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-purple-600 uppercase">Q4 Objective 3</span>
            <span className="text-xs font-black text-blue-600">88% Met</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Maintain 99.9% Test Coverage</h3>
          <p className="text-xs text-slate-500">Zero regression across payroll engine, tax tiers, and RBAC matrix.</p>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '88%' }} />
          </div>
        </div>
      </div>

      {/* Member Appraisal Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Member Scorecard</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Engineer</th>
                <th className="p-3">Role</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Attendance</th>
                <th className="p-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {mockManagerTeam.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                    <span>{m.name}</span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{m.role}</td>
                  <td className="p-3">
                    <span className="flex items-center gap-1 font-bold text-amber-500 font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> 4.8 / 5.0
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-600">{m.attendanceRate}%</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => showAppToast(`Submitting performance appraisal notes for ${m.name}`)}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold"
                    >
                      Scorecard
                    </button>
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

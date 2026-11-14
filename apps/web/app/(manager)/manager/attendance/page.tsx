'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  UserX,
  MapPin,
  Download,
} from 'lucide-react';
import { mockManagerTeam } from '@/lib/mock-data';

export default function ManagerAttendancePage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-purple-200 dark:border-purple-800">
            Team Monitoring
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Team Attendance & Shifts</h1>
          <p className="text-slate-500 text-xs mt-1">Real-time check-in status, late arrival flags, and shift schedule for your 8 direct reports.</p>
        </div>

        <button
          onClick={() => showAppToast('Exporting squad timesheet to CSV...')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
        >
          <Download className="w-4 h-4 text-purple-600" /> Export Squad Timesheet
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Present Today</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">7 / 8</h3>
          <span className="text-[10px] text-emerald-600 font-bold">87.5% Available</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">On Planned Leave</p>
          <h3 className="text-2xl font-black text-purple-600 mt-1">1 Member</h3>
          <span className="text-[10px] text-purple-600 font-bold">Sadia Islam (Design)</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Average Punch Time</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">09:12 AM</h3>
          <span className="text-[10px] text-slate-500 font-bold">Well within flexi-window</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Overtime Logged</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">14.5 Hrs</h3>
          <span className="text-[10px] text-blue-600 font-bold">This sprint cycle</span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Squad Check-in Status (Today)</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Team Member</th>
                <th className="p-3">Shift</th>
                <th className="p-3">Clock-In</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
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
                  <td className="p-3 text-slate-600 dark:text-slate-300">General (9:00 - 18:00)</td>
                  <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {m.status === 'Present' ? '09:12 AM' : '--'}
                  </td>
                  <td className="p-3 text-slate-500">Banani HQ Geofence</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => showAppToast(`Attendance history loaded for ${m.name}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      View Log
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

'use client';

import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Fingerprint,
} from 'lucide-react';

interface AttendanceLog {
  id: string;
  date: string;
  inTime: string;
  outTime: string;
  duration: string;
  status: 'Present' | 'Late' | 'Leave' | 'Weekend';
  location: string;
}

const mockLogs: AttendanceLog[] = [
  { id: '1', date: 'Today (14 Nov, 2026)', inTime: '09:15 AM', outTime: '--', duration: 'Ongoing', status: 'Present', location: 'Banani HQ Geofence' },
  { id: '2', date: '13 Nov, 2026', inTime: '09:05 AM', outTime: '06:15 PM', duration: '9h 10m', status: 'Present', location: 'Banani HQ Geofence' },
  { id: '3', date: '12 Nov, 2026', inTime: '09:42 AM', outTime: '06:30 PM', duration: '8h 48m', status: 'Late', location: 'Banani HQ Geofence' },
  { id: '4', date: '11 Nov, 2026', inTime: '09:10 AM', outTime: '06:05 PM', duration: '8h 55m', status: 'Present', location: 'Banani HQ Geofence' },
  { id: '5', date: '10 Nov, 2026', inTime: '--', outTime: '--', duration: '--', status: 'Leave', location: 'Casual Leave' },
];

export default function EmployeeAttendancePage() {
  const [logs, setLogs] = useState(mockLogs);
  const [showRegModal, setShowRegModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-blue-200 dark:border-blue-800">
            Self-Service Attendance
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">My Attendance & Shifts</h1>
          <p className="text-slate-500 text-xs mt-1">Review your monthly attendance logs, biometric sync, and submit regularization requests.</p>
        </div>

        <button
          onClick={() => setShowRegModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#3758D8] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Request Regularization
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {toast}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Present Days</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">22 Days</h3>
          <span className="text-[10px] text-emerald-600 font-bold">This Month</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Late Arrivals</p>
          <h3 className="text-2xl font-black text-amber-500 mt-1">1 Day</h3>
          <span className="text-[10px] text-slate-400 font-bold">Grace period applied</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Avg. Work Hours</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">8h 45m</h3>
          <span className="text-[10px] text-blue-600 font-bold">Compliant with policy</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Attendance Rate</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">95.4%</h3>
          <span className="text-[10px] text-emerald-600 font-bold">Top 10% in Squad</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Attendance Records</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Date</th>
                <th className="p-3">Clock-In</th>
                <th className="p-3">Clock-Out</th>
                <th className="p-3">Effective Hours</th>
                <th className="p-3">Location Mode</th>
                <th className="p-3 text-right rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{log.date}</td>
                  <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">{log.inTime}</td>
                  <td className="p-3 font-mono text-slate-500">{log.outTime}</td>
                  <td className="p-3 font-mono text-blue-600 font-bold">{log.duration}</td>
                  <td className="p-3 text-slate-500">{log.location}</td>
                  <td className="p-3 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-700'
                          : log.status === 'Late'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regularization Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Attendance Regularization</h3>
              <button onClick={() => setShowRegModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Missed Date</label>
                <input type="date" className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Actual Check-In</label>
                  <input type="time" defaultValue="09:00" className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Actual Check-Out</label>
                  <input type="time" defaultValue="18:00" className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Reason</label>
                <textarea rows={2} placeholder="e.g. Geofence GPS network timeout at entrance" className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowRegModal(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
              <button
                onClick={() => {
                  setToast('Regularization request submitted to your manager Tanvir Hasan!');
                  setShowRegModal(false);
                  setTimeout(() => setToast(null), 3500);
                }}
                className="flex-1 py-2 rounded-xl bg-[#3758D8] text-white text-xs font-bold shadow-md shadow-blue-500/20"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

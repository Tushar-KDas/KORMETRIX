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
  Filter,
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  name: string;
  department: string;
  branch: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'On Leave' | 'Absent';
  method: 'Geofence App' | 'Biometric' | 'Web Portal';
}

const mockAttendance: AttendanceRecord[] = [
  { id: '1', name: 'Tanvir Hasan', department: 'Engineering', branch: 'Banani HQ', checkIn: '09:02 AM', checkOut: '06:15 PM', status: 'Present', method: 'Geofence App' },
  { id: '2', name: 'Nusrat Jahan', department: 'HR', branch: 'Banani HQ', checkIn: '09:48 AM', checkOut: '--', status: 'Late', method: 'Biometric' },
  { id: '3', name: 'Ahmed Rahman', department: 'Engineering', branch: 'Banani HQ', checkIn: '09:15 AM', checkOut: '--', status: 'Present', method: 'Geofence App' },
  { id: '4', name: 'Sadia Islam', department: 'Design', branch: 'Gulshan Hub', checkIn: '--', checkOut: '--', status: 'On Leave', method: 'Web Portal' },
  { id: '5', name: 'Kamrul Ahsan', department: 'Finance', branch: 'CTG Branch', checkIn: '08:55 AM', checkOut: '05:30 PM', status: 'Present', method: 'Biometric' },
  { id: '6', name: 'Farhan Kabir', department: 'Marketing', branch: 'Banani HQ', checkIn: '--', checkOut: '--', status: 'Absent', method: 'Geofence App' },
];

export default function HRAttendancePage() {
  const [filter, setFilter] = useState('All');
  const [records, setRecords] = useState(mockAttendance);

  const filtered = records.filter((r) => (filter === 'All' ? true : r.status === filter));

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-teal-200 dark:border-teal-800">
            Workforce Attendance
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Attendance & Roster</h1>
          <p className="text-slate-500 text-xs mt-1">Real-time shift clock-ins, biometric synchronization, geofence logs, and regularization.</p>
        </div>

        <button
          onClick={() => showAppToast('Exporting live daily attendance report...')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
        >
          <Download className="w-4 h-4 text-teal-600" /> Export Timesheet
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Present Today</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">228</h3>
          <span className="text-[10px] text-emerald-600 font-bold">92% Attendance Rate</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Late Check-ins</p>
          <h3 className="text-2xl font-black text-amber-500 mt-1">12</h3>
          <span className="text-[10px] text-amber-500 font-bold">&gt; 15 mins grace period</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">On Approved Leave</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">6</h3>
          <span className="text-[10px] text-blue-600 font-bold">Casual & Sick Leaves</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Unexcused Absences</p>
          <h3 className="text-2xl font-black text-rose-600 mt-1">2</h3>
          <span className="text-[10px] text-rose-600 font-bold">Pending Regularization</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2">
        {['All', 'Present', 'Late', 'On Leave', 'Absent'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-[#16A389] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Employee</th>
                <th className="p-3">Department & Branch</th>
                <th className="p-3">In-Time</th>
                <th className="p-3">Out-Time</th>
                <th className="p-3">Method</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{item.department} • {item.branch}</td>
                  <td className="p-3 font-mono text-slate-800 dark:text-slate-200 font-bold">{item.checkIn}</td>
                  <td className="p-3 font-mono text-slate-500">{item.checkOut}</td>
                  <td className="p-3 text-slate-500">{item.method}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-700'
                          : item.status === 'Late'
                          ? 'bg-amber-100 text-amber-700'
                          : item.status === 'On Leave'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => showAppToast(`View GPS geofence coordinate verification for ${item.name}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
                    >
                      Verify
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

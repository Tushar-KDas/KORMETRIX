'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  Clock,
  Fingerprint,
  MapPin,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
} from 'lucide-react';

interface AttendanceRow {
  id: string;
  name: string;
  code: string;
  checkIn: string;
  checkOut?: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'ON_LEAVE';
  lateMinutes: number;
  method: string;
  isWithinGeofence: boolean;
  location: string;
}

const mockAttendanceList: AttendanceRow[] = [
  {
    id: 'att-1',
    name: 'Ahmed Rahman',
    code: 'EMP-002',
    checkIn: '09:15 AM',
    checkOut: '06:00 PM',
    status: 'PRESENT',
    lateMinutes: 0,
    method: 'GPS_GEOFENCE',
    isWithinGeofence: true,
    location: 'Head Office, Banani (23.7937, 90.4048)',
  },
  {
    id: 'att-2',
    name: 'Sarah Khan',
    code: 'EMP-003',
    checkIn: '09:05 AM',
    checkOut: '06:10 PM',
    status: 'PRESENT',
    lateMinutes: 0,
    method: 'QR_CODE',
    isWithinGeofence: true,
    location: 'Head Office, Banani',
  },
  {
    id: 'att-3',
    name: 'Tanvir Hasan',
    code: 'EMP-001',
    checkIn: '09:35 AM',
    status: 'LATE',
    lateMinutes: 20,
    method: 'GPS_GEOFENCE',
    isWithinGeofence: true,
    location: 'Head Office, Banani',
  },
  {
    id: 'att-4',
    name: 'Rafiq Ahmed',
    code: 'EMP-004',
    checkIn: '08:55 AM',
    status: 'PRESENT',
    lateMinutes: 0,
    method: 'GPS_GEOFENCE',
    isWithinGeofence: true,
    location: 'Dhanmondi Branch (23.7461, 90.3742)',
  },
];

export default function AttendanceAdminPage() {
  const [attendance, setAttendance] = useState(mockAttendanceList);
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Attendance Administration & Geofencing</h1>
          <p className="text-slate-500 text-sm">Real-time GPS validation, office perimeters, shifts & attendance correction reviews.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync Active
          </span>
        </div>
      </div>

      {/* Geofence Perimeter Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#3758D8] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Head Office Banani (HQ)</h4>
              <p className="text-xs text-slate-500">Radius: 200m • Lat: 23.7937, Lon: 90.4048</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Active</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Dhanmondi Branch</h4>
              <p className="text-xs text-slate-500">Radius: 150m • Lat: 23.7461, Lon: 90.3742</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Active</span>
        </div>
      </div>

      {/* Attendance Table Container */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search attendance logs..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3758D8]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Employee</th>
                <th className="p-3">Check-In</th>
                <th className="p-3">Check-Out</th>
                <th className="p-3">Status</th>
                <th className="p-3">Method</th>
                <th className="p-3">Geofence Verified</th>
                <th className="p-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attendance.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{row.code}</p>
                  </td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{row.checkIn}</td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{row.checkOut ?? '—'}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === 'PRESENT'
                          ? 'bg-emerald-100 text-emerald-700'
                          : row.status === 'LATE'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {row.status} {row.lateMinutes > 0 ? `(${row.lateMinutes}m)` : ''}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">{row.method}</td>
                  <td className="p-3">
                    {row.isWithinGeofence ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Inside Office
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Outside Perimeter
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => showAppToast(`Verified punch event for ${row.name}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold"
                    >
                      Audit
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

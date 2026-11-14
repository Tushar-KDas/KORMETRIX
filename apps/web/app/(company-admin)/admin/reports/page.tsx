'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  FileText,
  Clock,
  CreditCard,
  Users,
  Building,
  Printer,
  Sparkles,
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';

interface ReportTemplate {
  id: string;
  name: string;
  nameBn: string;
  category: 'ATTENDANCE' | 'PAYROLL' | 'LEAVE' | 'TAX_LEGAL';
  description: string;
  format: 'CSV' | 'PDF' | 'XLSX';
  lastGenerated: string;
  recordCount: number;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'rep-1',
    name: 'Monthly Attendance & Geofence Compliance Ledger',
    nameBn: 'মাসিক উপস্থিতি ও জিওফেন্স রিপোর্ট',
    category: 'ATTENDANCE',
    description: 'Detailed check-in/out timestamps, GPS lat/lng validation, late arrivals & overtime hours.',
    format: 'XLSX',
    lastGenerated: 'Today, 09:30 AM',
    recordCount: 248,
  },
  {
    id: 'rep-2',
    name: 'Bangladesh Bank BEFTN Payroll Transfer File',
    nameBn: 'বিইএফটিএন ব্যাংক স্যালারি ট্রান্সফার ফাইল',
    category: 'PAYROLL',
    description: 'Direct routing batch CSV for corporate bank salary auto-disbursement with 16-digit routing codes.',
    format: 'CSV',
    lastGenerated: 'Yesterday',
    recordCount: 248,
  },
  {
    id: 'rep-3',
    name: 'Comprehensive Salary & Provident Fund Ledger',
    nameBn: 'বেতন ও প্রভিডেন্ট ফান্ড লেজার',
    category: 'PAYROLL',
    description: 'Complete breakdown of Basic, House Rent, Medical, Conveyance, PF deduction & Tax in BDT (৳).',
    format: 'XLSX',
    lastGenerated: '22 Apr 2025',
    recordCount: 248,
  },
  {
    id: 'rep-4',
    name: 'Employee Leave Balance & Deduction Ledger',
    nameBn: 'ছুটির ব্যালেন্স ও সমন্বয় রিপোর্ট',
    category: 'LEAVE',
    description: 'Annual, Sick, Casual, and Emergency leave balances with carry-forward quota reconciliation.',
    format: 'PDF',
    lastGenerated: '20 Apr 2025',
    recordCount: 248,
  },
  {
    id: 'rep-5',
    name: 'NBR Income Tax (TDS) Withholding Statement',
    nameBn: 'এনবিআর উৎসে কর কর্তন বিবরণী',
    category: 'TAX_LEGAL',
    description: 'Statutory compliance certificate under Section 50 of the Income Tax Act 2023 for tax filing.',
    format: 'PDF',
    lastGenerated: '15 Apr 2025',
    recordCount: 248,
  },
  {
    id: 'rep-6',
    name: 'Overtime & Night Differential Audit Report',
    nameBn: 'ওভারটাইম ও অতিরিক্ত কাজের হিসাব',
    category: 'ATTENDANCE',
    description: 'Verified overtime hours computed at 1.5x & 2.0x standard hourly wage pursuant to labor regulations.',
    format: 'CSV',
    lastGenerated: '18 Apr 2025',
    recordCount: 86,
  },
];

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState('April 2025');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadReport = (rep: ReportTemplate) => {
    setDownloadingId(rep.id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccess(`Generated and downloaded ${rep.name} (${rep.format})!`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200 bg-white/10 px-3 py-1 rounded-full w-fit mb-2 backdrop-blur-md">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-300" /> Statutory & Operational Analytics Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Enterprise Reports & Data Export</h1>
          <p className="text-blue-100 text-sm mt-1">
            Generate audited Bangladesh payroll files, BEFTN bank batches, attendance ledgers & NBR tax statements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl flex items-center gap-2 text-xs font-semibold">
            <Calendar className="w-4 h-4 text-cyan-300" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-white border-none focus:ring-0 font-bold cursor-pointer"
            >
              <option className="text-slate-800">April 2025</option>
              <option className="text-slate-800">March 2025</option>
              <option className="text-slate-800">February 2025</option>
              <option className="text-slate-800">January 2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{downloadSuccess}</span>
          </div>
          <span className="text-[11px] underline cursor-pointer" onClick={() => setDownloadSuccess(null)}>
            Dismiss
          </span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Total Monthly Disbursement</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatBDT(245000)}</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-0.5">248 Payslips Ready</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Average Monthly Attendance</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">92.4%</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">84% On-Time Check-In</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Total Overtime Logged</span>
          <h3 className="text-2xl font-black text-[#3758D8] mt-1">428 Hours</h3>
          <p className="text-[11px] text-blue-500 font-bold mt-0.5">৳ 1,28,400 Premium Pay</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">TDS Tax Deducted & Deposited</span>
          <h3 className="text-2xl font-black text-purple-600 mt-1">{formatBDT(31500)}</h3>
          <p className="text-[11px] text-purple-500 font-bold mt-0.5">NBR Challan Matched</p>
        </div>
      </div>

      {/* Reports Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportTemplates.map((rep) => {
          const isBusy = downloadingId === rep.id;
          return (
            <div
              key={rep.id}
              className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#3758D8] flex items-center justify-center font-bold">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{rep.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">{rep.nameBn}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      rep.format === 'XLSX'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                        : rep.format === 'CSV'
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'
                    }`}
                  >
                    {rep.format}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {rep.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Last generated: <strong className="text-slate-700 dark:text-slate-300">{rep.lastGenerated}</strong> ({rep.recordCount} rows)
                </span>

                <button
                  onClick={() => handleDownloadReport(rep)}
                  disabled={isBusy}
                  className="px-4 py-2 rounded-xl bg-[#3758D8] hover:bg-blue-600 disabled:bg-slate-300 text-white font-bold transition-all flex items-center gap-2 shadow-sm"
                >
                  <Download className={`w-3.5 h-3.5 ${isBusy ? 'animate-spin' : ''}`} />
                  {isBusy ? 'Generating...' : `Export ${rep.format}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

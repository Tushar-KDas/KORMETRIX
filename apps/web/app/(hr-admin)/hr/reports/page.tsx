'use client';
import { showAppToast } from '@/components/common/toast';

import React from 'react';
import {
  BarChart3,
  Download,
  Users,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const turnoverData = [
  { month: 'Jun', joins: 12, exits: 2 },
  { month: 'Jul', joins: 14, exits: 3 },
  { month: 'Aug', joins: 18, exits: 1 },
  { month: 'Sep', joins: 15, exits: 4 },
  { month: 'Oct', joins: 22, exits: 2 },
  { month: 'Nov', joins: 9, exits: 1 },
];

const genderData = [
  { name: 'Male', value: 162, color: '#3758D8' },
  { name: 'Female', value: 86, color: '#16A389' },
];

export default function HRReportsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-teal-200 dark:border-teal-800">
            People Analytics
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">HR Reports & Workforce Analytics</h1>
          <p className="text-slate-500 text-xs mt-1">Headcount growth trends, voluntary turnover, tenure analytics, and demographic diversity.</p>
        </div>

        <button
          onClick={() => showAppToast('Generating complete executive HR PDF dossier...')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
        >
          <Download className="w-4 h-4 text-teal-600" /> Export Executive PDF
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Headcount</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">248</h3>
          <span className="text-[10px] text-teal-600 font-bold">↑ +14% YoY Growth</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Monthly Attrition</p>
          <h3 className="text-3xl font-black text-emerald-600 mt-1">1.2%</h3>
          <span className="text-[10px] text-emerald-600 font-bold">Well below tech benchmark (3.5%)</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Avg. Employee Tenure</p>
          <h3 className="text-3xl font-black text-blue-600 mt-1">2.4 Yrs</h3>
          <span className="text-[10px] text-blue-600 font-bold">High retention stability</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Cost Per Hire</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">৳ 24,500</h3>
          <span className="text-[10px] text-teal-600 font-bold">Avg. recruitment cost</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Joins vs Exits Bar Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Talent Inflow vs Attrition (Last 6 Months)</h2>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#16A389]" /> Joins</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Exits</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={turnoverData}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="joins" fill="#16A389" radius={[4, 4, 0, 0]} />
                <Bar dataKey="exits" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Diversity Ratio */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Gender Diversity Ratio</h2>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#3758D8]" /> Male</span>
              <span className="font-mono font-bold">162 (65.3%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#16A389]" /> Female</span>
              <span className="font-mono font-bold">86 (34.7%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
  Users,
  Target,
  BarChart2,
  Calendar,
  ChevronRight,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface Performer {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  department: string;
  role: string;
  attendanceScore: number;
  tasksCompleted: number;
  okrScore: number;
  rating: number;
  grade: 'A+' | 'A' | 'B+' | 'B';
}

const leaderboard: Performer[] = [
  {
    id: 'p-1',
    rank: 1,
    name: 'Ahmed Rahman',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    department: 'Engineering',
    role: 'Software Engineer',
    attendanceScore: 98,
    tasksCompleted: 42,
    okrScore: 96,
    rating: 4.9,
    grade: 'A+',
  },
  {
    id: 'p-2',
    rank: 2,
    name: 'Sarah Khan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    department: 'Human Resources',
    role: 'HR Executive',
    attendanceScore: 97,
    tasksCompleted: 38,
    okrScore: 94,
    rating: 4.8,
    grade: 'A+',
  },
  {
    id: 'p-3',
    rank: 3,
    name: 'Tanvir Hasan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    department: 'Engineering',
    role: 'Engineering Team Lead',
    attendanceScore: 95,
    tasksCompleted: 35,
    okrScore: 91,
    rating: 4.7,
    grade: 'A',
  },
  {
    id: 'p-4',
    rank: 4,
    name: 'Rafiq Ahmed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    department: 'Marketing',
    role: 'Marketing Specialist',
    attendanceScore: 92,
    tasksCompleted: 29,
    okrScore: 88,
    rating: 4.5,
    grade: 'B+',
  },
];

const tierDistribution = [
  { name: 'Top Tier (A+ / A)', value: 45, color: '#10B981' },
  { name: 'Expected (B+ / B)', value: 42, color: '#3758D8' },
  { name: 'Needs Coaching (C)', value: 13, color: '#F59E0B' },
];

const quarterlyTrends = [
  { quarter: 'Q1 2024', score: 84 },
  { quarter: 'Q2 2024', score: 87 },
  { quarter: 'Q3 2024', score: 89 },
  { quarter: 'Q4 2024', score: 90 },
  { quarter: 'Q1 2025', score: 92 },
];

export default function PerformancePage() {
  const [showModal, setShowModal] = useState(false);
  const [cycleName, setCycleName] = useState('Q2 2025 Annual Mid-Year Review');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200 bg-white/10 px-3 py-1 rounded-full w-fit mb-2 backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-cyan-300" /> 360-Degree Continuous Feedback & OKR Tracking
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Performance & Appraisals</h1>
          <p className="text-blue-100 text-sm mt-1">
            Measure employee KPI fulfillment, goal alignment, quarterly ratings & promotion readiness.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-[#3758D8] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Start Review Cycle
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Overall Team Index</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-emerald-600">92%</h3>
            <span className="text-xs font-bold text-emerald-600">↑ +2% this cycle</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Average OKR Completion</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-[#3758D8]">88.5%</h3>
            <span className="text-xs font-bold text-blue-500">High Velocity</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Reviews Completed</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-purple-600">228 / 248</h3>
            <span className="text-xs font-bold text-purple-600">92% Finished</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Top Rated Talents</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-amber-500">34</h3>
            <span className="text-xs font-bold text-amber-600">Grade A+</span>
          </div>
        </div>
      </div>

      {/* Charts Section: Velocity Trends & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Quarterly Performance Trend</h2>
              <p className="text-xs text-slate-500">Historical performance efficiency over past 5 quarters</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              Positive Trajectory
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyTrends}>
                <XAxis dataKey="quarter" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Team Rating']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="#3758D8" radius={[8, 8, 0, 0]}>
                  {quarterlyTrends.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === quarterlyTrends.length - 1 ? '#10B981' : '#3758D8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Performance Bell Curve</h2>
            <p className="text-xs text-slate-500">Tier distribution across company staff</p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tierDistribution} innerRadius={50} outerRadius={70} dataKey="value">
                  {tierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white">45%</span>
              <span className="text-[10px] font-bold text-emerald-600">A+ High Performers</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {tierDistribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-bold">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Top Performers Leaderboard</h2>
            <p className="text-xs text-slate-500">Ranked by combined attendance, task completion & manager appraisal</p>
          </div>
          <span className="text-xs font-semibold text-[#3758D8] cursor-pointer hover:underline">
            Export Appraisal Ledger →
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl w-14">Rank</th>
                <th className="p-3.5">Employee</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Attendance</th>
                <th className="p-3.5">Tasks Done</th>
                <th className="p-3.5">OKR Rating</th>
                <th className="p-3.5 rounded-r-xl text-right">Appraisal Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-black text-slate-900 dark:text-white">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        p.rank === 1
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60'
                          : p.rank === 2
                          ? 'bg-slate-200 text-slate-800 dark:bg-slate-700'
                          : p.rank === 3
                          ? 'bg-amber-600/20 text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      #{p.rank}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-600 dark:text-slate-300">{p.department}</td>
                  <td className="p-3.5 font-bold text-emerald-600">{p.attendanceScore}%</td>
                  <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{p.tasksCompleted} Tasks</td>
                  <td className="p-3.5 font-bold text-[#3758D8] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {p.rating} / 5.0
                  </td>
                  <td className="p-3.5 text-right">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 font-black text-xs border border-emerald-300 dark:border-emerald-800">
                      {p.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Cycle Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Initiate Appraisal Review Cycle</h3>
            <p className="text-xs text-slate-500">
              Triggers self-assessment forms to all 248 employees on mobile and web, followed by line-manager evaluation.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Cycle Title</label>
                <input
                  type="text"
                  value={cycleName}
                  onChange={(e) => setCycleName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Evaluation Window</label>
                <input
                  type="text"
                  defaultValue="01 May 2025 - 20 May 2025"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showAppToast('Appraisal cycle successfully dispatched to all active employees and managers!');
                  setShowModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 shadow-md"
              >
                Launch Cycle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

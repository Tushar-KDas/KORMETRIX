'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  project: string;
  priority: 'High' | 'Medium' | 'Low';
  due: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Complete UI Design for Mobile App V2', project: 'Flutter Mobile App', priority: 'High', due: 'Today, 5:00 PM', completed: false },
  { id: '2', title: 'Fix Login Auth Token Persistence', project: 'Core Auth Engine', priority: 'High', due: 'Today, 3:00 PM', completed: false },
  { id: '3', title: 'Prepare Weekly Sprint Status Report', project: 'Engineering Org', priority: 'Low', due: 'Tomorrow, 10:00 AM', completed: true },
  { id: '4', title: 'Review PR #42 for Geofence Boundary Check', project: 'Attendance API', priority: 'Medium', due: '15 Nov', completed: true },
  { id: '5', title: 'Setup Test Environment for Vercel Preview Deployments', project: 'DevOps & CI/CD', priority: 'Medium', due: '18 Nov', completed: false },
];

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filtered = tasks.filter((t) => {
    if (filter === 'Pending') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-blue-200 dark:border-blue-800">
            Sprint Workflows
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">My Tasks & Assignments</h1>
          <p className="text-slate-500 text-xs mt-1">Manage daily tasks, view deadlines, and check off completed items in real time.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['All', 'Pending', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-[#3758D8] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
        {filtered.map((t) => (
          <div
            key={t.id}
            onClick={() => toggleTask(t.id)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              t.completed
                ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800 opacity-60'
                : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-[#3758D8]'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => {}}
                className="mt-1 w-4 h-4 accent-[#3758D8] rounded cursor-pointer"
              />
              <div>
                <h4 className={`text-sm font-bold ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                  {t.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400">{t.project}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    t.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {t.priority}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{t.due}</span>
                </div>
              </div>
            </div>

            <span className={`text-xs font-bold ${t.completed ? 'text-emerald-600' : 'text-blue-600'}`}>
              {t.completed ? 'Done' : 'In Progress'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

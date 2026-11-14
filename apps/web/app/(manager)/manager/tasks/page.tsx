'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Filter,
  X,
} from 'lucide-react';

interface SquadTask {
  id: string;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  dueDate: string;
}

const mockTasks: SquadTask[] = [
  { id: 'TSK-101', title: 'Complete UI Design for Mobile Punch In', assignee: 'Ahmed Rahman', priority: 'High', status: 'In Progress', dueDate: 'Today, 5:00 PM' },
  { id: 'TSK-102', title: 'Fix Auth Session Refresh Token Bug', assignee: 'Tanvir Hossain', priority: 'High', status: 'In Progress', dueDate: 'Today, 3:00 PM' },
  { id: 'TSK-103', title: 'Draft Sprint 4 Velocity Report', assignee: 'Sadia Islam', priority: 'Low', status: 'Todo', dueDate: 'Tomorrow, 10:00 AM' },
  { id: 'TSK-104', title: 'Optimize Postgres Query for Attendance Log', assignee: 'Ahmed Rahman', priority: 'Medium', status: 'Done', dueDate: '12 Nov' },
];

export default function ManagerTasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('Ahmed Rahman');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const filtered = tasks.filter((t) => (filter === 'All' ? true : t.status === filter));

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;
    const newTask: SquadTask = {
      id: `TSK-${100 + tasks.length + 1}`,
      title: newTitle,
      assignee: newAssignee,
      priority: newPriority,
      status: 'Todo',
      dueDate: 'Due Tomorrow',
    };
    setTasks([newTask, ...tasks]);
    setShowModal(false);
    setNewTitle('');
  };

  const handleStatusChange = (id: string, newStatus: 'Todo' | 'In Progress' | 'Review' | 'Done') => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-purple-200 dark:border-purple-800">
            Sprint Board
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Squad Task Management</h1>
          <p className="text-slate-500 text-xs mt-1">Assign sprint deliverables, track progress, and review pull requests.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#8B5CF6] hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
        >
          <Plus className="w-4 h-4" /> Create Squad Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['All', 'Todo', 'In Progress', 'Review', 'Done'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-[#8B5CF6] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tasks Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Task</th>
                <th className="p-3">Assignee</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-purple-600" />
                    <span>{t.title}</span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{t.assignee}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'High'
                          ? 'bg-red-100 text-red-700'
                          : t.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{t.dueDate}</td>
                  <td className="p-3">
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t.id, e.target.value as any)}
                      className="text-xs font-bold px-2 py-1 rounded-lg border-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => showAppToast(`Opening details for ticket ${t.id}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Sprint Task</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Implement Webhooks for Geofence Alert"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Assign To</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs"
                >
                  <option>Ahmed Rahman</option>
                  <option>Tanvir Hossain</option>
                  <option>Sadia Islam</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
              <button
                onClick={handleCreateTask}
                className="flex-1 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold shadow-md shadow-purple-600/30"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

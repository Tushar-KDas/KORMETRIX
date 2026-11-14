'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Plus,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Filter,
  User,
  Briefcase,
  ChevronDown,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  projectCode: string;
  projectName: string;
  assigneeName: string;
  assigneeAvatar: string;
  department: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

const initialTasks: Task[] = [
  {
    id: 'tsk-1',
    title: 'Finalize Geofence GPS Accuracy Filter in Flutter App',
    projectCode: 'PRJ-101',
    projectName: 'WorkForce 360 Core Mobile & Web',
    assigneeName: 'Ahmed Rahman',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    department: 'Engineering',
    priority: 'URGENT',
    dueDate: 'Today, 05:00 PM',
    status: 'IN_PROGRESS',
  },
  {
    id: 'tsk-2',
    title: 'Configure BEFTN Bangladesh Bank Export Template',
    projectCode: 'PRJ-103',
    projectName: 'BEFTN Auto-Payroll Switch',
    assigneeName: 'Sarah Khan',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    department: 'HR & Finance',
    priority: 'HIGH',
    dueDate: '26 Apr 2025',
    status: 'PENDING',
  },
  {
    id: 'tsk-3',
    title: 'Deploy Biometric Fingerprint Terminals at Agrabad Port',
    projectCode: 'PRJ-102',
    projectName: 'Terminal Sync',
    assigneeName: 'Tanvir Hasan',
    assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    department: 'DevOps & Hardware',
    priority: 'MEDIUM',
    dueDate: '28 Apr 2025',
    status: 'IN_PROGRESS',
  },
  {
    id: 'tsk-4',
    title: 'Design Dark Mode Elevation Tokens for Admin Dashboard',
    projectCode: 'PRJ-101',
    projectName: 'WorkForce 360 Core Mobile & Web',
    assigneeName: 'Rafiq Ahmed',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    department: 'UI/UX Design',
    priority: 'LOW',
    dueDate: '30 Apr 2025',
    status: 'COMPLETED',
  },
  {
    id: 'tsk-5',
    title: 'Security Audit: Verify RLS Policies for Leave Requests',
    projectCode: 'PRJ-101',
    projectName: 'WorkForce 360 Core Mobile & Web',
    assigneeName: 'Tanvir Hasan',
    assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    department: 'Engineering',
    priority: 'HIGH',
    dueDate: '27 Apr 2025',
    status: 'IN_PROGRESS',
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('Ahmed Rahman');
  const [newPriority, setNewPriority] = useState<'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newProject, setNewProject] = useState('PRJ-101 - WorkForce 360');
  const [newDue, setNewDue] = useState('Tomorrow, 06:00 PM');

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      title: newTitle,
      projectCode: 'PRJ-101',
      projectName: newProject,
      assigneeName: newAssignee,
      assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      department: 'Engineering',
      priority: newPriority,
      dueDate: newDue,
      status: 'PENDING',
    };
    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setShowCreateModal(false);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assigneeName.toLowerCase().includes(search.toLowerCase()) ||
      t.projectCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingCount = tasks.filter((t) => t.status === 'PENDING').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200 bg-white/10 px-3 py-1 rounded-full w-fit mb-2 backdrop-blur-md">
            <CheckSquare className="w-3.5 h-3.5 text-cyan-300" /> Enterprise Task & Sprint Orchestrator
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Tasks & Work Orders</h1>
          <p className="text-blue-100 text-sm mt-1">Assign deliverables, monitor team execution, deadlines & sprint velocity.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-[#3758D8] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Total Work Orders</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{tasks.length}</h3>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-amber-500">Pending Assignment</span>
          <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</h3>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-blue-500">In Execution</span>
          <h3 className="text-2xl font-black text-[#3758D8] mt-1">{inProgressCount}</h3>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-emerald-500">Completed & Verified</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</h3>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, assignees or project codes..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#3758D8]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#3758D8] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl w-10">Done</th>
                <th className="p-3.5">Task Description</th>
                <th className="p-3.5">Project</th>
                <th className="p-3.5">Assignee</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTasks.map((t) => {
                const isDone = t.status === 'COMPLETED';
                return (
                  <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <button
                        onClick={() => toggleTaskStatus(t.id)}
                        className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-slate-300 dark:border-slate-600 hover:border-[#3758D8]'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <p className={`font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {t.title}
                      </p>
                      <span className="text-[10px] text-slate-400">{t.department}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-xs font-mono font-bold text-[#3758D8] bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                        {t.projectCode}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <img src={t.assigneeAvatar} alt={t.assigneeName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{t.assigneeName}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.priority === 'URGENT'
                            ? 'bg-red-50 text-red-600 dark:bg-red-950/40'
                            : t.priority === 'HIGH'
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                            : t.priority === 'MEDIUM'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {t.dueDate}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                            : t.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Task */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Create New Task Assignment</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement SQLite Offline Punch Queue"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Assignee</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option>Ahmed Rahman</option>
                    <option>Sarah Khan</option>
                    <option>Tanvir Hasan</option>
                    <option>Rafiq Ahmed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Project</label>
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option>PRJ-101 - WorkForce 360</option>
                    <option>PRJ-102 - Terminal Sync</option>
                    <option>PRJ-103 - BEFTN Payroll</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newDue}
                    onChange={(e) => setNewDue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 shadow-md"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

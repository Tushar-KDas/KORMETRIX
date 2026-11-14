'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Coins,
  ChevronRight,
  Filter,
  MoreVertical,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';

interface Project {
  id: string;
  code: string;
  title: string;
  client: string;
  budgetBDT: number;
  spentBDT: number;
  progressPercent: number;
  startDate: string;
  deadline: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'PLANNING';
  teamMembers: { name: string; avatar: string }[];
  category: string;
}

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    code: 'PRJ-101',
    title: 'WorkForce 360 Core Mobile & Web Portal',
    client: 'Internal Enterprise Product',
    budgetBDT: 2450000,
    spentBDT: 1820000,
    progressPercent: 92,
    startDate: '01 Jan 2025',
    deadline: '30 Apr 2025',
    status: 'IN_PROGRESS',
    category: 'Engineering',
    teamMembers: [
      { name: 'Ahmed Rahman', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      { name: 'Tanvir Hasan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
      { name: 'Sarah Khan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    ],
  },
  {
    id: 'proj-2',
    code: 'PRJ-102',
    title: 'Dhaka Airport Geofenced Terminal Sync',
    client: 'Civil Aviation Authority',
    budgetBDT: 1850000,
    spentBDT: 950000,
    progressPercent: 65,
    startDate: '15 Feb 2025',
    deadline: '15 Jun 2025',
    status: 'IN_PROGRESS',
    category: 'IoT & Hardware',
    teamMembers: [
      { name: 'Rafiq Ahmed', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { name: 'Tanvir Hasan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    ],
  },
  {
    id: 'proj-3',
    code: 'PRJ-103',
    title: 'BEFTN Bangladesh Bank Auto-Payroll Switch',
    client: 'Fintech Partners BD',
    budgetBDT: 1200000,
    spentBDT: 1200000,
    progressPercent: 100,
    startDate: '10 Nov 2024',
    deadline: '28 Feb 2025',
    status: 'COMPLETED',
    category: 'Fintech',
    teamMembers: [
      { name: 'Sarah Khan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
      { name: 'Ahmed Rahman', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    ],
  },
  {
    id: 'proj-4',
    code: 'PRJ-104',
    title: 'Chittagong Port Supply Chain ERP Connector',
    client: 'Eastern Logistics Group',
    budgetBDT: 3100000,
    spentBDT: 780000,
    progressPercent: 30,
    startDate: '01 Mar 2025',
    deadline: '30 Aug 2025',
    status: 'IN_PROGRESS',
    category: 'Integration',
    teamMembers: [
      { name: 'Rafiq Ahmed', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { name: 'Tanvir Hasan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    ],
  },
  {
    id: 'proj-5',
    code: 'PRJ-105',
    title: 'AI Smart Shift & Roster Scheduler v2',
    client: 'WorkForce 360 R&D',
    budgetBDT: 950000,
    spentBDT: 200000,
    progressPercent: 15,
    startDate: '01 Apr 2025',
    deadline: '30 Sep 2025',
    status: 'PLANNING',
    category: 'AI Research',
    teamMembers: [
      { name: 'Ahmed Rahman', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    ],
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New project state
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newBudget, setNewBudget] = useState(500000);
  const [newDeadline, setNewDeadline] = useState('31 Dec 2025');
  const [newCategory, setNewCategory] = useState('Engineering');

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const project: Project = {
      id: `proj-${Date.now()}`,
      code: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      client: newClient || 'WorkForce 360 Client',
      budgetBDT: Number(newBudget) || 500000,
      spentBDT: 0,
      progressPercent: 5,
      startDate: 'Today',
      deadline: newDeadline,
      status: 'IN_PROGRESS',
      category: newCategory,
      teamMembers: [
        { name: 'Ahmed Rahman', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      ],
    };
    setProjects([project, ...projects]);
    setNewTitle('');
    setNewClient('');
    setShowAddModal(false);
  };

  const totalBudget = projects.reduce((acc, p) => acc + p.budgetBDT, 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200 bg-white/10 px-3 py-1 rounded-full w-fit mb-2 backdrop-blur-md">
            <Briefcase className="w-3.5 h-3.5 text-cyan-300" /> Enterprise Delivery & Milestone Tracking
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Projects Portfolio & Milestones</h1>
          <p className="text-blue-100 text-sm mt-1">Track client contracts, team allocation, BDT financial budgets & progress.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-[#3758D8] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Active Projects</span>
            <span className="text-xs font-bold text-emerald-600">4 In Progress</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {projects.filter((p) => p.status === 'IN_PROGRESS').length}
          </h3>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Total Portfolio Value</span>
            <span className="text-xs font-bold text-blue-600">BDT (৳)</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {formatBDT(totalBudget)}
          </h3>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Completed Projects</span>
            <span className="text-xs font-bold text-purple-600">On Track</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {projects.filter((p) => p.status === 'COMPLETED').length}
          </h3>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Average Velocity</span>
            <span className="text-xs font-bold text-emerald-600">↑ 92%</span>
          </div>
          <h3 className="text-2xl font-black text-emerald-600">92%</h3>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, code or client..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#3758D8]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {['ALL', 'IN_PROGRESS', 'COMPLETED', 'PLANNING', 'ON_HOLD'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-[#3758D8] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#3758D8] bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-lg">
                    {proj.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {proj.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{proj.title}</h3>
                <p className="text-xs text-slate-500">Client: <strong className="text-slate-700 dark:text-slate-300">{proj.client}</strong></p>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  proj.status === 'COMPLETED'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-300 dark:border-emerald-800'
                    : proj.status === 'IN_PROGRESS'
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-300 dark:border-blue-800'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-300 dark:border-amber-800'
                }`}
              >
                {proj.status.replace('_', ' ')}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Completion Rate</span>
                <span className="font-bold text-slate-900 dark:text-white">{proj.progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    proj.progressPercent === 100 ? 'bg-emerald-500' : 'bg-[#3758D8]'
                  }`}
                  style={{ width: `${proj.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Budget & Timeline Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block font-medium">Contract Budget</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {formatBDT(proj.budgetBDT)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Target Deadline</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" /> {proj.deadline}
                </span>
              </div>
            </div>

            {/* Team Avatars */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Assigned Team:</span>
                <div className="flex -space-x-2">
                  {proj.teamMembers.map((m, idx) => (
                    <img
                      key={idx}
                      src={m.avatar}
                      alt={m.name}
                      title={m.name}
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                    />
                  ))}
                </div>
              </div>

              <span className="text-[#3758D8] font-bold hover:underline cursor-pointer flex items-center gap-1">
                View Tasks →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Create New Enterprise Project</h3>
            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangladesh Telecom Network Upgrade"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Client / Stakeholder</label>
                  <input
                    type="text"
                    placeholder="Grameenphone / Robi"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Budget in BDT (৳)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Target Deadline</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option>Engineering</option>
                    <option>IoT & Hardware</option>
                    <option>Fintech</option>
                    <option>Supply Chain</option>
                    <option>AI Research</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 shadow-md"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

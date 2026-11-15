'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useSidebar } from '@/lib/sidebar-context';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { mockManagerTeam } from '@/lib/mock-data';

const teamPerformanceData = [
  { week: 'W1', target: 80, actual: 82 },
  { week: 'W2', target: 82, actual: 85 },
  { week: 'W3', target: 85, actual: 86 },
  { week: 'W4', target: 88, actual: 88 },
];

interface PendingAction {
  id: string;
  type: 'Leave' | 'Overtime' | 'Expense';
  memberName: string;
  avatar: string;
  details: string;
  date: string;
}

const initialActions: PendingAction[] = [
  {
    id: 'ACT-01',
    type: 'Leave',
    memberName: 'Ahmed Rahman',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    details: 'Casual Leave request for 2 days (Nov 20 - 21)',
    date: 'Submitted 2h ago',
  },
  {
    id: 'ACT-02',
    type: 'Overtime',
    memberName: 'Farhan Kabir',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    details: '4.5 hours weekend release overtime claim',
    date: 'Submitted yesterday',
  },
];

export default function ManagerPortalPage() {
  const { hideDashboardOptions, toggleDashboardOptions } = useSidebar();
  const [team, setTeam] = useState(mockManagerTeam);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>(initialActions);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Present' | 'On Leave'>('All');

  const handleAction = (id: string, actionType: 'Approved' | 'Rejected') => {
    const item = pendingActions.find((a) => a.id === id);
    setPendingActions((prev) => prev.filter((a) => a.id !== id));
    setToastMessage(`${item?.type} request by ${item?.memberName} was ${actionType}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredTeam = team.filter((m) => {
    if (filterStatus === 'All') return true;
    return m.status === filterStatus;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Banner (Purple Theme) */}
      <div className="bg-gradient-to-r from-[#1E1B4B] via-[#0F172A] to-[#312E81] text-white p-6 md:p-8 rounded-3xl border border-purple-900/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 bg-purple-900/60 px-3 py-1 rounded-full w-fit mb-2 border border-purple-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Engineering Department Scope
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Manager Control Portal</h1>
          <p className="text-purple-200 text-sm mt-1">Direct team supervision, sprint velocity, attendance reviews, and 1-click approvals.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleDashboardOptions}
            className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 border border-white/20 shadow-xs"
            title="Toggle extra options"
          >
            {hideDashboardOptions ? (
              <>
                <Eye className="w-3.5 h-3.5 text-purple-200" />
                <span>Show Options</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-purple-200" />
                <span>Hide Options</span>
              </>
            )}
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#8B5CF6] hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
          >
            <Plus className="w-4 h-4" /> Assign Team Task
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-purple-600" />
          {toastMessage}
        </div>
      )}

      {/* Pending Approvals Queue */}
      {pendingActions.length > 0 && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-purple-200/60 dark:border-purple-900/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Requires Your Approval ({pendingActions.length})</h2>
            </div>
            <span className="text-xs text-purple-600 font-semibold">Fast 1-Click Decisions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingActions.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt={item.memberName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{item.memberName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{item.details}</p>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(item.id, 'Approved')}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                    title="Approve"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction(item.id, 'Rejected')}
                    className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                    title="Reject"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Overview & Velocity Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Team Overview Card */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Engineering Squad</h2>
            <div className="mt-4">
              <h3 className="text-4xl font-black text-slate-900 dark:text-white">8 Engineers</h3>
              <p className="text-xs font-bold text-purple-600 mt-1">7 Present • 1 On Leave Today</p>
            </div>
          </div>

          <div className="pt-6">
            <div className="flex items-center -space-x-2">
              {team.map((m) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.name}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
              <span>Sprint Velocity</span>
              <span className="font-bold font-mono text-purple-600">42 Story Points / wk</span>
            </div>
          </div>
        </div>

        {/* Team Performance Curve */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Sprint Velocity & Performance</h2>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-1">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Target</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Actual Output</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-emerald-600">88%</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Efficiency Rate</p>
            </div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={teamPerformanceData}>
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[70, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="target" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* My Team Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Direct Reports ({team.length})</h2>

          <div className="flex items-center gap-2">
            {(['All', 'Present', 'On Leave'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === tab
                    ? 'bg-[#8B5CF6] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Attendance Rate</th>
                <th className="p-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredTeam.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-bold text-slate-900 dark:text-white">{member.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">{member.role}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        member.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold font-mono text-slate-900 dark:text-white">
                    {member.attendanceRate}%
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Review Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img src={selectedMember.avatar} alt={selectedMember.name} className="w-12 h-12 rounded-full object-cover border-2 border-purple-500" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedMember.name}</h3>
                  <p className="text-xs text-purple-600 font-semibold">{selectedMember.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-100 text-xs space-y-2">
              <div className="flex justify-between"><span>Attendance Score:</span><span className="font-bold text-emerald-600">{selectedMember.attendanceRate}%</span></div>
              <div className="flex justify-between"><span>Current Status:</span><span className="font-bold">{selectedMember.status}</span></div>
              <div className="flex justify-between"><span>Tasks In-Progress:</span><span className="font-bold font-mono">3 Tickets</span></div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  showAppToast(`1-on-1 feedback session scheduled with ${selectedMember.name}`);
                  setSelectedMember(null);
                }}
                className="flex-1 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold"
              >
                Schedule 1-on-1
              </button>
              <button
                onClick={() => setSelectedMember(null)}
                className="flex-1 py-2 rounded-xl bg-[#8B5CF6] hover:bg-purple-600 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Assign Task to Team Member</h3>
              <button onClick={() => setShowAssignModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Task Title</label>
                <input type="text" placeholder="e.g. Implement Supabase Realtime Hook" className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs" />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Assign To</label>
                <select className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs">
                  {team.map((m) => (
                    <option key={m.id} value={m.name}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Priority</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Due Date</label>
                  <input type="date" className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAssignModal(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
              <button
                onClick={() => {
                  showAppToast('Task successfully assigned to team member!');
                  setShowAssignModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold shadow-md shadow-purple-600/30"
              >
                Dispatch Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

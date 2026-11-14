'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  MoreVertical,
  Plus,
  X,
  MessageSquare,
} from 'lucide-react';
import { mockManagerTeam } from '@/lib/mock-data';

export default function ManagerTeamPage() {
  const [team, setTeam] = useState(mockManagerTeam);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  const filtered = team.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-purple-200 dark:border-purple-800">
            Team Management
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Engineering Squad Directory</h1>
          <p className="text-slate-500 text-xs mt-1">Direct reports, skills profile, contact info, and 1-on-1 performance notes.</p>
        </div>

        <button
          onClick={() => showAppToast('New member requisition request sent to HR!')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#8B5CF6] hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
        >
          <Plus className="w-4 h-4" /> Request Team Headcount
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search team member by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500" />
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    member.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {member.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-3">{member.name}</h3>
              <p className="text-xs text-purple-600 font-semibold">{member.role}</p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Attendance:</span>
                <span className="font-bold font-mono text-emerald-600">{member.attendanceRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Banani HQ</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setSelectedMember(member)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
              >
                Profile & OKRs
              </button>
              <button
                onClick={() => showAppToast(`Direct message channel opened with ${member.name}`)}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors"
                title="Message"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Member Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={selectedMember.avatar} alt={selectedMember.name} className="w-12 h-12 rounded-full object-cover border-2 border-purple-500" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedMember.name}</h3>
                  <p className="text-xs text-purple-600">{selectedMember.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-100 text-xs space-y-2">
              <div className="flex justify-between"><span>Sprint Completion Rate:</span><span className="font-bold text-emerald-600">95%</span></div>
              <div className="flex justify-between"><span>Code Review Velocity:</span><span className="font-bold">2.1 hrs / PR</span></div>
              <div className="flex justify-between"><span>Annual Leaves Remaining:</span><span className="font-bold font-mono">11 Days</span></div>
            </div>
            <button
              onClick={() => setSelectedMember(null)}
              className="w-full py-2.5 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

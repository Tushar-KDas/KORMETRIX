'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  UserPlus,
  CheckCircle2,
  Clock,
  Laptop,
  FileCheck,
  Building,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';

interface OnboardingCandidate {
  id: string;
  name: string;
  role: string;
  department: string;
  startDate: string;
  progress: number;
  tasks: { name: string; completed: boolean }[];
}

const mockOnboardees: OnboardingCandidate[] = [
  {
    id: 'ONB-01',
    name: 'Tanvir Hossain',
    role: 'Backend Golang Engineer',
    department: 'Engineering',
    startDate: '18 Nov, 2026',
    progress: 75,
    tasks: [
      { name: 'NID & Police Clearance Verified', completed: true },
      { name: 'Official Laptop Dispatched (MacBook Pro 16)', completed: true },
      { name: 'WorkForce 360 & Slack Accounts Provisioned', completed: true },
      { name: 'Direct Deposit Bank Info Submitted', completed: false },
    ],
  },
  {
    id: 'ONB-02',
    name: 'Farhana Yeasmin',
    role: 'Product Operations Analyst',
    department: 'Product',
    startDate: '20 Nov, 2026',
    progress: 50,
    tasks: [
      { name: 'Signed Offer Letter & NDA Received', completed: true },
      { name: 'Hardware Setup & Work Email Created', completed: true },
      { name: 'Buddy / Mentor Assigned', completed: false },
      { name: 'HR Induction Session Scheduled', completed: false },
    ],
  },
  {
    id: 'ONB-03',
    name: 'Imtiaz Ahmed',
    role: 'QA Automation Engineer',
    department: 'Engineering',
    startDate: '25 Nov, 2026',
    progress: 25,
    tasks: [
      { name: 'Offer Accepted & Documents Uploaded', completed: true },
      { name: 'Asset Provisioning Ticket Created', completed: false },
      { name: 'Workstation Allocation in Banani HQ', completed: false },
      { name: 'Compliance Training Enrolled', completed: false },
    ],
  },
];

export default function HROnboardingPage() {
  const [candidates, setCandidates] = useState(mockOnboardees);
  const [selectedOnboardee, setSelectedOnboardee] = useState<OnboardingCandidate | null>(null);

  const toggleTask = (candidateId: string, taskIdx: number) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        const newTasks = [...c.tasks];
        newTasks[taskIdx].completed = !newTasks[taskIdx].completed;
        const completedCount = newTasks.filter((t) => t.completed).length;
        const newProgress = Math.round((completedCount / newTasks.length) * 100);
        return { ...c, tasks: newTasks, progress: newProgress };
      })
    );
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-teal-200 dark:border-teal-800">
            People Operations
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Onboarding & New Hires</h1>
          <p className="text-slate-500 text-xs mt-1">Track pre-boarding workflows, asset provisioning, document verification, and orientation checklists.</p>
        </div>

        <button
          onClick={() => showAppToast('New hire onboarding wizard initiated!')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#16A389] hover:bg-[#12806B] text-white text-xs font-bold transition-all shadow-lg shadow-teal-500/20"
        >
          <UserPlus className="w-4 h-4" /> Start Onboarding Wizard
        </button>
      </div>

      {/* Grid of Onboarding Candidates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {candidates.map((cand) => (
          <div
            key={cand.id}
            className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                  Starts {cand.startDate}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2">{cand.name}</h3>
                <p className="text-xs text-teal-600 font-semibold">{cand.role}</p>
                <p className="text-[10px] text-slate-400">{cand.department} Department</p>
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white">{cand.progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-[#16A389] rounded-full transition-all duration-300"
                style={{ width: `${cand.progress}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Steps</p>
              {cand.tasks.map((task, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleTask(cand.id, idx)}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="w-4 h-4 accent-[#16A389] rounded cursor-pointer"
                  />
                  <span className={`text-xs ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                    {task.name}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOnboardee(cand)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
            >
              Manage Onboarding Dossier
            </button>
          </div>
        ))}
      </div>

      {/* Dossier Modal */}
      {selectedOnboardee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedOnboardee.name}</h3>
                <p className="text-xs text-teal-600 font-medium">{selectedOnboardee.role}</p>
              </div>
              <button onClick={() => setSelectedOnboardee(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 text-xs space-y-1">
              <p className="font-bold text-teal-800 dark:text-teal-300">Onboarding Status: {selectedOnboardee.progress}% Completed</p>
              <p className="text-slate-500">Scheduled Welcome Breakfast: {selectedOnboardee.startDate} at 10:00 AM</p>
            </div>
            <button
              onClick={() => {
                showAppToast(`Onboarding completion certificate dispatched for ${selectedOnboardee.name}`);
                setSelectedOnboardee(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#16A389] text-white font-bold text-xs"
            >
              Mark Complete & Issue Employee Badge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

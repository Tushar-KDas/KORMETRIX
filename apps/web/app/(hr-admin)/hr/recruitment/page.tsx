'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  ChevronRight,
  X,
  Mail,
  Phone,
  FileText,
  Star,
  Check,
  Award,
  Filter,
  ArrowRight,
  UserCheck,
  UserX,
} from 'lucide-react';
import { showAppToast } from '@/components/common/toast';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  candidates: number;
  status: 'Active' | 'Reviewing' | 'Closed';
}

interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  skills: string[];
  matchScore: number;
  stage: 'Applied' | 'Screening' | 'Technical' | 'HR Interview' | 'Offered' | 'Hired' | 'Rejected';
  appliedDate: string;
  avatar: string;
}

const mockJobs: JobPosting[] = [
  { id: 'JOB-101', title: 'Senior Full Stack Engineer', department: 'Engineering', type: 'Full-time', location: 'Banani HQ (Hybrid)', candidates: 28, status: 'Active' },
  { id: 'JOB-102', title: 'HR People Operations Lead', department: 'HR', type: 'Full-time', location: 'Banani HQ', candidates: 14, status: 'Active' },
  { id: 'JOB-103', title: 'UI/UX Product Designer', department: 'Design', type: 'Full-time', location: 'Banani HQ', candidates: 19, status: 'Reviewing' },
  { id: 'JOB-104', title: 'Financial Analyst', department: 'Finance', type: 'Full-time', location: 'Banani HQ', candidates: 8, status: 'Active' },
];

const initialCandidates: Candidate[] = [
  {
    id: 'CAN-101',
    jobId: 'JOB-101',
    name: 'Tanvir Ahmed',
    email: 'tanvir.ahmed@example.com',
    phone: '+880 1711-223344',
    experience: '5.5 Years',
    skills: ['Next.js', 'Node.js', 'PostgreSQL', 'Flutter'],
    matchScore: 96,
    stage: 'Technical',
    appliedDate: '12 Nov 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  },
  {
    id: 'CAN-102',
    jobId: 'JOB-101',
    name: 'Nasir Uddin',
    email: 'nasir.u@example.com',
    phone: '+880 1722-334455',
    experience: '6 Years',
    skills: ['React', 'NestJS', 'Docker', 'Microservices'],
    matchScore: 92,
    stage: 'Applied',
    appliedDate: '13 Nov 2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: 'CAN-103',
    jobId: 'JOB-101',
    name: 'Shamim Reza',
    email: 'shamim.reza@example.com',
    phone: '+880 1733-445566',
    experience: '4 Years',
    skills: ['Go', 'TypeScript', 'Kubernetes', 'Redis'],
    matchScore: 88,
    stage: 'Screening',
    appliedDate: '11 Nov 2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
  {
    id: 'CAN-104',
    jobId: 'JOB-101',
    name: 'Sabrina Yasmin',
    email: 'sabrina.y@example.com',
    phone: '+880 1744-556677',
    experience: '5 Years',
    skills: ['React', 'Python', 'AWS', 'GraphQL'],
    matchScore: 95,
    stage: 'Offered',
    appliedDate: '09 Nov 2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: 'CAN-105',
    jobId: 'JOB-102',
    name: 'Mehnaz Chowdhury',
    email: 'mehnaz.c@example.com',
    phone: '+880 1755-667788',
    experience: '6.5 Years',
    skills: ['HR Operations', 'Bangladesh Labor Law', 'Talent Acquisition', 'Payroll'],
    matchScore: 94,
    stage: 'HR Interview',
    appliedDate: '10 Nov 2026',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
  },
  {
    id: 'CAN-106',
    jobId: 'JOB-102',
    name: 'Farhana Noor',
    email: 'farhana.n@example.com',
    phone: '+880 1766-778899',
    experience: '4 Years',
    skills: ['Employee Relations', 'Onboarding', 'KPI Audits'],
    matchScore: 89,
    stage: 'Applied',
    appliedDate: '12 Nov 2026',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
  },
  {
    id: 'CAN-107',
    jobId: 'JOB-103',
    name: 'Rafiqul Islam',
    email: 'rafiqul.design@example.com',
    phone: '+880 1777-889900',
    experience: '5 Years',
    skills: ['Figma', 'Design Systems', 'Micro-interactions', 'User Testing'],
    matchScore: 97,
    stage: 'Technical',
    appliedDate: '08 Nov 2026',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100',
  },
  {
    id: 'CAN-108',
    jobId: 'JOB-103',
    name: 'Sumaiya Jahan',
    email: 'sumaiya.ux@example.com',
    phone: '+880 1788-990011',
    experience: '3.5 Years',
    skills: ['Mobile App UX', 'Wireframing', 'Prototyping', 'User Flows'],
    matchScore: 91,
    stage: 'Screening',
    appliedDate: '11 Nov 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  },
  {
    id: 'CAN-109',
    jobId: 'JOB-104',
    name: 'Kamrul Hasan',
    email: 'kamrul.finance@example.com',
    phone: '+880 1799-001122',
    experience: '4.5 Years',
    skills: ['Financial Modeling', 'BDT Tax Compliance', 'Budgeting', 'Excel / PowerBI'],
    matchScore: 90,
    stage: 'Applied',
    appliedDate: '13 Nov 2026',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
  },
];

export default function HRRecruitmentPage() {
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [candidateFilterStage, setCandidateFilterStage] = useState<string>('ALL');

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newType, setNewType] = useState('Full-time');
  const [newLocation, setNewLocation] = useState('Banani HQ (Hybrid)');

  const handleCreateJob = () => {
    if (!newTitle.trim()) {
      showAppToast('Please enter a job title');
      return;
    }
    const newJob: JobPosting = {
      id: `JOB-${100 + jobs.length + 1}`,
      title: newTitle.trim(),
      department: newDept,
      type: newType,
      location: newLocation,
      candidates: 0,
      status: 'Active',
    };
    setJobs([newJob, ...jobs]);
    setShowPostModal(false);
    setNewTitle('');
    showAppToast(`Job vacancy "${newJob.title}" posted successfully!`);
  };

  const handleUpdateCandidateStage = (candidateId: string, newStage: Candidate['stage']) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
    showAppToast(`Candidate stage updated to "${newStage}"`);
  };

  const filteredCandidates = selectedJob
    ? candidates.filter(
        (c) =>
          c.jobId === selectedJob.id &&
          (candidateFilterStage === 'ALL' || c.stage === candidateFilterStage)
      )
    : [];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-teal-200 dark:border-teal-800">
            Talent Acquisition & Headhunting
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Recruitment & Vacancies</h1>
          <p className="text-slate-500 text-xs mt-1">Manage open vacancies, candidate tracking pipeline, and interview schedules.</p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#16A389] hover:bg-[#12806B] text-white text-xs font-bold transition-all shadow-lg shadow-teal-500/20"
        >
          <Plus className="w-4 h-4" /> Post New Job Opening
        </button>
      </div>

      {/* Pipeline Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Active Openings</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{jobs.filter((j) => j.status === 'Active').length}</h3>
          <span className="text-[10px] text-teal-600 font-bold">In 4 Departments</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Applicants</p>
          <h3 className="text-2xl font-black text-teal-600 mt-1">
            {jobs.reduce((acc, j) => acc + j.candidates, 0)}
          </h3>
          <span className="text-[10px] text-teal-600 font-bold">+18 this week</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Interviews Scheduled</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">
            {candidates.filter((c) => c.stage === 'Technical' || c.stage === 'HR Interview').length}
          </h3>
          <span className="text-[10px] text-slate-500 font-bold">Next 48 Hours</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Offers Extended</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">
            {candidates.filter((c) => c.stage === 'Offered' || c.stage === 'Hired').length}
          </h3>
          <span className="text-[10px] text-emerald-600 font-bold">1 Accepted</span>
        </div>
      </div>

      {/* Job Openings Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Vacancies ({jobs.length})</h2>
          <span className="text-xs text-slate-500 font-semibold">Live on Career Portal</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Job Title</th>
                <th className="p-3">Department</th>
                <th className="p-3">Location & Type</th>
                <th className="p-3 text-center">Applicants</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-teal-600" />
                    <span>{job.title}</span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 font-semibold">{job.department}</td>
                  <td className="p-3 text-slate-500">{job.location} • {job.type}</td>
                  <td className="p-3 text-center font-bold text-teal-600 font-mono">{job.candidates}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      job.status === 'Active'
                        ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setCandidateFilterStage('ALL');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold transition-all shadow-xs cursor-pointer"
                    >
                      View Candidates ({candidates.filter((c) => c.jobId === job.id).length})
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Review Drawer / Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                    {selectedJob.id}
                  </span>
                  <span className="text-xs text-slate-400">{selectedJob.department} • {selectedJob.location}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  Candidate Pipeline: {selectedJob.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Stage:
              </span>
              {['ALL', 'Applied', 'Screening', 'Technical', 'HR Interview', 'Offered', 'Hired'].map((stg) => (
                <button
                  key={stg}
                  onClick={() => setCandidateFilterStage(stg)}
                  className={`px-3 py-1 rounded-xl font-bold transition-all whitespace-nowrap ${
                    candidateFilterStage === stg
                      ? 'bg-[#16A389] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {stg}
                </button>
              ))}
            </div>

            {/* Candidates List */}
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No applicants found in this stage</p>
                <p className="text-xs text-slate-400 mt-1">Select &apos;ALL&apos; or promote applicants through the recruitment pipeline.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-500/20"
                        />
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                            {candidate.name}
                            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-teal-500 text-teal-500" /> {candidate.matchScore}% Match
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500">{candidate.experience} experience • Applied {candidate.appliedDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{candidate.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{candidate.phone}</span>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {candidate.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Current Stage Pill & Actions */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        candidate.stage === 'Hired'
                          ? 'bg-emerald-100 text-emerald-700'
                          : candidate.stage === 'Offered'
                          ? 'bg-blue-100 text-blue-700'
                          : candidate.stage === 'Rejected'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-teal-100 text-teal-700'
                      }`}>
                        Stage: {candidate.stage}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {candidate.stage !== 'Technical' && candidate.stage !== 'Hired' && (
                          <button
                            onClick={() => handleUpdateCandidateStage(candidate.id, 'Technical')}
                            className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold transition-colors"
                          >
                            Technical Round
                          </button>
                        )}
                        {candidate.stage !== 'Offered' && candidate.stage !== 'Hired' && (
                          <button
                            onClick={() => handleUpdateCandidateStage(candidate.id, 'Offered')}
                            className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold transition-colors"
                          >
                            Extend Offer
                          </button>
                        )}
                        {candidate.stage !== 'Hired' && (
                          <button
                            onClick={() => handleUpdateCandidateStage(candidate.id, 'Hired')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-colors flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" /> Hire
                          </button>
                        )}
                        {candidate.stage !== 'Rejected' && (
                          <button
                            onClick={() => handleUpdateCandidateStage(candidate.id, 'Rejected')}
                            className="px-2 py-1 rounded-lg hover:bg-rose-50 text-rose-600 text-[10px] font-bold transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200"
              >
                Close Pipeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Post New Job Vacancy</h3>
              <button onClick={() => setShowPostModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Mobile App Developer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <option>Engineering</option>
                  <option>HR</option>
                  <option>Finance</option>
                  <option>Design</option>
                  <option>Sales & Marketing</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Location & Work Mode</label>
                <input
                  type="text"
                  placeholder="e.g. Banani HQ (Hybrid)"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Employment Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contractual</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowPostModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateJob}
                className="flex-1 py-2.5 rounded-xl bg-[#16A389] hover:bg-[#12806B] text-white text-xs font-bold shadow-md shadow-teal-500/20"
              >
                Publish Vacancy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

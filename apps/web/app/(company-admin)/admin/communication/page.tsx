'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Bell,
  Smartphone,
  Mail,
  AlertTriangle,
  Pin,
  CheckCircle2,
  Users,
  Eye,
  Calendar,
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  targetAudience: string;
  priority: 'EMERGENCY' | 'URGENT' | 'GENERAL' | 'HOLIDAY';
  channels: ('PUSH' | 'SMS' | 'EMAIL' | 'IN_APP')[];
  date: string;
  readCount: number;
  totalRecipients: number;
  isPinned: boolean;
}

const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Eid-ul-Fitr Corporate Holiday & Salary Advance Notice',
    content:
      'We are delighted to announce that all WorkForce 360 offices will remain closed from 29 April to 04 May 2025 for Eid-ul-Fitr. All employee salaries for April along with festival allowances have been disbursed.',
    author: 'Sarah Khan',
    authorRole: 'Head of People & Culture',
    targetAudience: 'All Employees (248)',
    priority: 'HOLIDAY',
    channels: ['PUSH', 'EMAIL', 'IN_APP'],
    date: '24 Apr 2025',
    readCount: 236,
    totalRecipients: 248,
    isPinned: true,
  },
  {
    id: 'ann-2',
    title: 'Banani HQ Geofence Perimeter Maintenance Window Tonight',
    content:
      'Scheduled maintenance on Banani office Wi-Fi routers and biometric terminal sync will occur tonight between 11:00 PM and 01:00 AM. Mobile GPS check-ins will operate on cellular network backup without disruption.',
    author: 'Tanvir Hasan',
    authorRole: 'Infrastructure Lead',
    targetAudience: 'Head Office Staff (142)',
    priority: 'URGENT',
    channels: ['PUSH', 'IN_APP'],
    date: '23 Apr 2025',
    readCount: 138,
    totalRecipients: 142,
    isPinned: false,
  },
  {
    id: 'ann-3',
    title: 'Quarterly Town Hall & Recognition Ceremony Announcement',
    content:
      'Join us this Thursday at 03:30 PM for our Q1 2025 Town Hall in the 8th floor amphitheater and online via Zoom. We will announce the Top Performers and Employee of the Quarter awards.',
    author: 'Tanvir Hasan',
    authorRole: 'Executive Director',
    targetAudience: 'All Employees (248)',
    priority: 'GENERAL',
    channels: ['PUSH', 'EMAIL', 'IN_APP'],
    date: '20 Apr 2025',
    readCount: 245,
    totalRecipients: 248,
    isPinned: false,
  },
];

export default function CommunicationPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Announcement['priority']>('GENERAL');
  const [target, setTarget] = useState('All Employees (248)');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    const newA: Announcement = {
      id: `ann-${Date.now()}`,
      title: title,
      content: content,
      author: 'Super Admin',
      authorRole: 'Platform Administrator',
      targetAudience: target,
      priority: priority,
      channels: ['PUSH', 'IN_APP', 'EMAIL'],
      date: 'Just now',
      readCount: 1,
      totalRecipients: 248,
      isPinned: false,
    };
    setAnnouncements([newA, ...announcements]);
    setTitle('');
    setContent('');
    setShowModal(false);
  };

  const togglePin = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200 bg-white/10 px-3 py-1 rounded-full w-fit mb-2 backdrop-blur-md">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-300" /> Multi-Channel Broadcast & Push Notification Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Broadcasts & Announcements</h1>
          <p className="text-blue-100 text-sm mt-1">
            Publish critical company alerts, emergency bulletins & push notifications directly to employee phones.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-[#3758D8] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md"
        >
          <Send className="w-4 h-4" /> Broadcast Notice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Total Broadcasts</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{announcements.length} Published</h3>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">FCM Push Delivery Rate</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">99.8%</h3>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Average Read Through</span>
          <h3 className="text-2xl font-black text-[#3758D8] mt-1">96.2%</h3>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">SMS Gateway Balance</span>
          <h3 className="text-2xl font-black text-purple-600 mt-1">8,450 SMS</h3>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#3758D8]"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">{filtered.length} notices found</span>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl bg-white dark:bg-[#1E293B] border transition-all ${
              item.isPinned
                ? 'border-[#3758D8] ring-2 ring-blue-500/10 shadow-md'
                : 'border-slate-200/80 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.isPinned && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#3758D8] dark:bg-blue-950/60 flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-current" /> Pinned Bulletin
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.priority === 'EMERGENCY'
                        ? 'bg-red-50 text-red-600 dark:bg-red-950/40'
                        : item.priority === 'URGENT'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                        : item.priority === 'HOLIDAY'
                        ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40'
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                    }`}
                  >
                    {item.priority}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">• {item.targetAudience}</span>
                  <span className="text-xs text-slate-400 font-medium">• {item.date}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {item.content}
                </p>
              </div>

              <button
                onClick={() => togglePin(item.id)}
                className={`p-2 rounded-xl text-slate-400 hover:text-[#3758D8] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  item.isPinned ? 'text-[#3758D8]' : ''
                }`}
                title="Pin announcement"
              >
                <Pin className="w-4 h-4" />
              </button>
            </div>

            {/* Footer: Read Receipts & Author */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.author} ({item.authorRole})
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Smartphone className="w-3.5 h-3.5 text-blue-500" /> Push
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-emerald-500" /> Email
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                <Eye className="w-4 h-4" />
                <span>
                  {item.readCount} / {item.totalRecipients} Read (
                  {Math.round((item.readCount / item.totalRecipients) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Broadcast */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Broadcast New Notice</h3>
            <form onSubmit={handleBroadcast} className="space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangladesh Independence Day Holiday Notice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="GENERAL">General Notice</option>
                    <option value="URGENT">Urgent Notice</option>
                    <option value="EMERGENCY">Emergency Alert</option>
                    <option value="HOLIDAY">Holiday Bulletin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Target Audience</label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option>All Employees (248)</option>
                    <option>Head Office Staff (142)</option>
                    <option>Engineering Team (86)</option>
                    <option>Branch Managers (18)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Message Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type official notification body..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

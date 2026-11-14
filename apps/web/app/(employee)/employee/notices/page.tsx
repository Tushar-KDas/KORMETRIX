'use client';

import React from 'react';
import {
  Bell,
  Calendar,
  AlertCircle,
  Megaphone,
  CheckCircle,
} from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  date: string;
  category: 'Company' | 'Policy' | 'Holiday';
  content: string;
  important?: boolean;
}

const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Upcoming Victory Day (16 December) Holiday Schedule',
    date: '12 Nov, 2026',
    category: 'Holiday',
    content: 'All branches of WorkForce 360 Ltd will remain closed on Wednesday, 16 December in observance of National Victory Day. Support emergency hotline will remain on call.',
    important: true,
  },
  {
    id: '2',
    title: 'WorkForce 360 Version 2.0 Mobile App Live on Play Store',
    date: '08 Nov, 2026',
    category: 'Company',
    content: 'All team members are advised to update their mobile apps to Version 2.0.0 featuring enhanced geofencing and offline attendance sync.',
    important: false,
  },
  {
    id: '3',
    title: 'Health & Medical Insurance Coverage Renewal 2026',
    date: '25 Oct, 2026',
    category: 'Policy',
    content: 'Please submit updated dependent documentation to HR before 30 November to ensure uninterrupted health card coverage with Green Delta Insurance.',
    important: false,
  },
];

const bangladeshHolidays = [
  { name: 'Victory Day (বিজয় দিবস)', date: '16 Dec, 2026', day: 'Wednesday', type: 'Public Holiday' },
  { name: 'Christmas Day (বড়দিন)', date: '25 Dec, 2026', day: 'Friday', type: 'Public Holiday' },
  { name: 'New Year Day', date: '01 Jan, 2027', day: 'Friday', type: 'Bank Holiday' },
  { name: 'Shaheed Day & International Mother Language Day', date: '21 Feb, 2027', day: 'Sunday', type: 'National Holiday' },
];

export default function EmployeeNoticesPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-blue-200 dark:border-blue-800">
            Internal Communications
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Notice Board & Holidays</h1>
          <p className="text-slate-500 text-xs mt-1">Official circulars, company announcements, and upcoming Bangladesh national holidays.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Notices */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Company Announcements</h2>
          <div className="space-y-4">
            {mockNotices.map((notice) => (
              <div
                key={notice.id}
                className={`p-6 rounded-3xl border transition-all ${
                  notice.important
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
                    : 'bg-white dark:bg-[#1E293B] border-slate-200/80 dark:border-slate-800'
                } shadow-xs space-y-2`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      notice.category === 'Holiday'
                        ? 'bg-emerald-100 text-emerald-700'
                        : notice.category === 'Policy'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {notice.category}
                  </span>
                  <span className="text-xs text-slate-400">{notice.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{notice.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{notice.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bangladesh Holiday Calendar */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#3758D8]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Govt & National Holidays (Bangladesh)</h2>
          </div>

          <div className="space-y-3">
            {bangladeshHolidays.map((h, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{h.name}</h4>
                  <p className="text-[11px] text-slate-400">{h.day} • {h.type}</p>
                </div>
                <span className="font-mono font-bold text-[#3758D8] bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">
                  {h.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

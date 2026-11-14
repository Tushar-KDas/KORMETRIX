'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import { Building2, Plus, Search, ShieldCheck, MoreVertical, ExternalLink } from 'lucide-react';
import { mockOrganizationsList } from '@/lib/mock-data';

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState(mockOrganizationsList);
  const [search, setSearch] = useState('');

  const filtered = orgs.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Multi-Tenant Organizations</h1>
          <p className="text-slate-500 text-sm">Manage tenant workspaces, isolated data boundaries & quotas.</p>
        </div>
        <button
          onClick={() => showAppToast('New Organization modal opened!')}
          className="px-4 py-2.5 rounded-xl bg-[#3758D8] text-white text-xs font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Provision New Tenant
        </button>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter organizations..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3758D8]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Organization</th>
                <th className="p-3">Tenant Code</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Employees</th>
                <th className="p-3">Status</th>
                <th className="p-3">Onboarded</th>
                <th className="p-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-[#3758D8] font-bold flex items-center justify-center">
                        {org.code.slice(0, 2)}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{org.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-600 dark:text-slate-300">{org.code}</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-200">{org.plan}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{org.employeesCount}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        org.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {org.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{org.joinedDate}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

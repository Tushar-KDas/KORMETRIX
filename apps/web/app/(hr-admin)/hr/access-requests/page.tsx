'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Smartphone,
  Search,
  Filter,
  UserCheck,
  UserX,
  RefreshCw,
  Mail,
  Phone,
  Building,
  Check,
  X,
  HeartHandshake,
  UserPlus,
} from 'lucide-react';
import { showAppToast } from '@/components/common/toast';

interface AccessRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  requestedRole: 'employee' | 'manager';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export default function HRAccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/access-requests');
      const data = await res.json();
      if (data.success && data.requests) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error('Failed to load access requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    try {
      setIsProcessing(id);
      const res = await fetch('/api/access-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          action,
          reviewedBy: 'HR Manager / People Operations',
        }),
      });

      const data = await res.json();
      if (data.success) {
        showAppToast(
          action === 'APPROVE'
            ? 'Account approved! User can now sign in to Mobile App and Web Portal.'
            : 'Access request has been rejected.'
        );
        // Refresh local state
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
                  reviewedAt: new Date().toLocaleTimeString(),
                  reviewedBy: 'HR Manager',
                }
              : r
          )
        );
      } else {
        showAppToast(data.error || 'Failed to update access request');
      }
    } catch (err) {
      showAppToast('Error communicating with server');
    } finally {
      setIsProcessing(null);
    }
  };

  const filtered = requests.filter((r) => {
    const matchesFilter = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0C1E28] via-[#0E3B3E] to-[#16A389] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-300 bg-white/10 px-3 py-1 rounded-full w-fit mb-2 backdrop-blur-md">
            <HeartHandshake className="w-3.5 h-3.5 text-teal-300" /> HR People Operations & Gatekeeper
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Staff Onboarding & Access Requests</h1>
          <p className="text-teal-100 text-sm mt-1">
            Review and approve registration requests submitted from the WorkForce 360 Android APK & Career Portal.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-900 text-xs font-bold hover:bg-teal-50 transition-colors shadow-md cursor-pointer w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Requests
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Requests</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{requests.length}</h3>
          <span className="text-[10px] text-slate-500 font-semibold">Across Mobile & Web</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" /> Pending HR Review
          </p>
          <h3 className="text-2xl font-black text-amber-500 mt-1">{pendingCount}</h3>
          <span className="text-[10px] text-amber-600 font-bold">Needs HR Approval</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-teal-600 uppercase">Approved & Active</p>
          <h3 className="text-2xl font-black text-teal-600 mt-1">{approvedCount}</h3>
          <span className="text-[10px] text-teal-600 font-bold">Can Login Now</span>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-rose-500 uppercase">Rejected</p>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{rejectedCount}</h3>
          <span className="text-[10px] text-slate-400 font-semibold">Access Blocked</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((stg) => (
              <button
                key={stg}
                onClick={() => setFilterStatus(stg)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterStatus === stg
                    ? 'bg-[#16A389] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {stg === 'ALL' ? 'All Requests' : stg}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#16A389]"
            />
          </div>
        </div>

        {/* Requests Table */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#16A389]" />
            Loading access requests...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No requests matching criteria</p>
            <p className="text-xs text-slate-400 mt-1">When users request access via the Mobile App, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Requester</th>
                  <th className="p-3.5">Department & Role</th>
                  <th className="p-3.5">Contact Details</th>
                  <th className="p-3.5">Requested At</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950/60 text-[#16A389] flex items-center justify-center font-bold text-xs uppercase">
                          {r.fullName.slice(0, 2)}
                        </div>
                        <div>
                          <p>{r.fullName}</p>
                          <span className="text-[10px] text-slate-400 font-normal">{r.notes}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{r.designation}</p>
                      <p className="text-[11px] text-slate-500">{r.department} • ({r.requestedRole})</p>
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{r.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{r.phone}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                      {r.requestedAt}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        r.status === 'APPROVED'
                          ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400'
                          : r.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 animate-pulse'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {r.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAction(r.id, 'APPROVE')}
                            disabled={isProcessing === r.id}
                            className="px-3 py-1.5 rounded-xl bg-[#16A389] hover:bg-[#12806B] text-white font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Approve & Activate
                          </button>
                          <button
                            onClick={() => handleAction(r.id, 'REJECT')}
                            disabled={isProcessing === r.id}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <UserX className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Reviewed by {r.reviewedBy || 'HR Operations'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

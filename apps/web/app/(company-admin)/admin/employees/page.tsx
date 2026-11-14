'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  CreditCard,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  Copy,
  Printer,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  Layers,
  ChevronRight,
  ExternalLink,
  UserCheck,
  Clock,
  Check,
  X,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { FullEmployee } from '@/lib/employees-100';
import { useEmployeeStore } from '@/lib/employee-store';
import { EmployeeIdCardModal } from '@/components/id-card/employee-id-card-modal';
import { RoleGuard } from '@/components/auth/role-guard';

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
  notes?: string;
}

export default function AdminEmployeesDirectoryPage() {
  const { employees, teams, addEmployee, updateEmployee, deleteEmployee, isLoading } = useEmployeeStore();

  const [activeTab, setActiveTab] = useState<'all' | 'teams' | 'credentials' | 'idcards' | 'approvals'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedEmployeeForCard, setSelectedEmployeeForCard] = useState<FullEmployee | null>(null);
  const [showPassMap, setShowPassMap] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Employee Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+880 1711-');
  const [newTeam, setNewTeam] = useState('Engineering Squad (Tech & Core Systems)');
  const [newDesignation, setNewDesignation] = useState('Software Engineer');
  const [newBloodGroup, setNewBloodGroup] = useState('O+');
  const [newBranch, setNewBranch] = useState('Banani HQ, Dhaka');
  const [newSalary, setNewSalary] = useState('65000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Employee State
  const [editingEmployee, setEditingEmployee] = useState<FullEmployee | null>(null);

  // Access Requests State
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const fetchAccessRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await fetch('/api/access-requests');
      if (res.ok) {
        const json = await res.json();
        setAccessRequests(json.requests || []);
      }
    } catch (e) {
      console.warn('Failed to fetch access requests:', e);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchAccessRequests();
  }, []);

  const pendingCount = accessRequests.filter((r) => r.status === 'PENDING').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === 'all' || emp.teamId === selectedTeam || emp.team.includes(selectedTeam);
    const matchesBranch = selectedBranch === 'all' || emp.branch.includes(selectedBranch);
    return matchesSearch && matchesTeam && matchesBranch;
  });

  const togglePasswordReveal = (id: string) => {
    setShowPassMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const handleExportCSV = () => {
    const header = 'Employee ID,Name,Email,Phone,Team,Designation,Branch,Blood Group,Joining Date,Login Username,Default Password\n';
    const rows = employees
      .map(
        (e) =>
          `"${e.employeeId}","${e.name}","${e.email}","${e.phone}","${e.team}","${e.designation}","${e.branch}","${e.bloodGroup}","${e.joiningDate}","${e.loginDetails.username}","${e.loginDetails.defaultPassword}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WorkForce360_Employees_Roster.csv`;
    a.click();
  };

  const handleCreateEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast('Please provide employee name and email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await addEmployee({
        name: newName.trim(),
        email: newEmail.trim().toLowerCase(),
        phone: newPhone.trim(),
        team: newTeam,
        teamId: newTeam.includes('Engineering')
          ? 'team-engineering'
          : newTeam.includes('Human Resources')
          ? 'team-hr'
          : newTeam.includes('Marketing')
          ? 'team-marketing'
          : newTeam.includes('Product')
          ? 'team-product'
          : 'team-finance',
        designation: newDesignation.trim(),
        bloodGroup: newBloodGroup,
        branch: newBranch,
      });

      setShowAddModal(false);
      setNewName('');
      setNewEmail('');
      setNewPhone('+880 1711-');
      showToast(`Employee "${created.name}" added successfully to WorkForce 360 & Supabase!`);
    } catch (err: any) {
      showToast(`Error adding employee: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveRequest = async (reqItem: AccessRequest) => {
    try {
      const res = await fetch('/api/access-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reqItem.id,
          action: 'APPROVE',
          reviewedBy: 'Company Admin',
        }),
      });

      if (res.ok) {
        // Also add directly to local store
        await addEmployee({
          name: reqItem.fullName,
          email: reqItem.email,
          phone: reqItem.phone,
          designation: reqItem.designation,
          team: reqItem.department,
        });

        fetchAccessRequests();
        showToast(`Account approved for ${reqItem.fullName}! They can now log in to Web & Mobile.`);
      }
    } catch (e: any) {
      showToast(`Approval failed: ${e.message}`);
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      const res = await fetch('/api/access-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          action: 'REJECT',
          reviewedBy: 'Company Admin',
        }),
      });
      if (res.ok) {
        fetchAccessRequests();
        showToast('Registration request rejected.');
      }
    } catch (e: any) {
      showToast(`Rejection failed: ${e.message}`);
    }
  };

  const handleDelete = async (emp: FullEmployee) => {
    if (confirm(`Are you sure you want to remove ${emp.name} (${emp.employeeId}) from the active roster?`)) {
      await deleteEmployee(emp.id);
      showToast(`Employee ${emp.name} removed.`);
    }
  };

  return (
    <RoleGuard allowedRoles={['super_admin', 'company_admin']} requiredRoleLabel="Super Admin or Company Admin">
      <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> WorkForce 360 Ltd • Live Personnel Management
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              Workforce Directory ({employees.length} Personnel)
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Add new staff, manage approval requests from mobile apps, view credentials, and print standard ID badges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-blue-600" /> Export Roster (CSV)
            </button>

            {/* Prominent Add Employee Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-black transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add New Employee (কর্মী যোগ)
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-between shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Pending Access Requests Callout Banner */}
        {pendingCount > 0 && (
          <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-black">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100">
                  {pendingCount} New Account Requests Waiting for Approval
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Users requested access via mobile app. They cannot log in until approved by HR Admin or Company Admin.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('approvals')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/30 transition-all flex items-center gap-1.5 w-fit"
            >
              <span>Review Requests</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 5 Teams Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {teams.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                setSelectedTeam(selectedTeam === t.id ? 'all' : t.id);
                setActiveTab('all');
              }}
              className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                selectedTeam === t.id
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-[#3758D8] shadow-md'
                  : 'bg-white dark:bg-[#1E293B] border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Team Squad</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-blue-100 text-[#3758D8]">
                  {employees.filter((e) => e.teamId === t.id || e.team.includes(t.name.split(' ')[0])).length || t.memberCount} Staff
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 leading-tight">{t.name}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Lead: <span className="font-semibold text-slate-700 dark:text-slate-300">{t.leadName}</span></p>
            </div>
          ))}
        </div>

        {/* Main Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-[#17243B] text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" /> All Employees ({employees.length})
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'approvals'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Access Approvals ({pendingCount})
            </button>

            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'credentials'
                  ? 'bg-[#3758D8] text-white shadow-md shadow-blue-500/20'
                  : 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100'
              }`}
            >
              <Key className="w-4 h-4" /> Login Credentials & Passwords
            </button>

            <button
              onClick={() => setActiveTab('idcards')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'idcards'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100'
              }`}
            >
              <Printer className="w-4 h-4" /> Double-Sided ID Cards
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, ID, email, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3758D8]"
            />
          </div>
        </div>

        {/* TAB 1: ALL EMPLOYEES DIRECTORY */}
        {activeTab === 'all' && (
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
              {selectedTeam !== 'all' && (
                <button
                  onClick={() => setSelectedTeam('all')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-xl">Employee</th>
                    <th className="p-3">Designation & Team</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Branch</th>
                    <th className="p-3">Blood Group</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredEmployees.slice(0, 50).map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">{emp.name}</p>
                            <span className="font-mono text-[10px] text-blue-600 font-semibold">{emp.employeeId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{emp.designation}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{emp.team.split('(')[0]}</p>
                      </td>
                      <td className="p-3 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{emp.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{emp.phone}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{emp.branch.split(',')[0]}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200">
                          {emp.bloodGroup}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedEmployeeForCard(emp)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                            title="Print 3D ID Card"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ACCESS REQUESTS & APPROVAL CENTER */}
        {activeTab === 'approvals' && (
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Mobile & Web Account Access Approvals
                </h3>
                <p className="text-xs text-slate-500">
                  When new staff request an account through the mobile app, they appear here. Approve to grant instant access.
                </p>
              </div>
              <button
                onClick={fetchAccessRequests}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Refresh List
              </button>
            </div>

            {accessRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No access requests currently registered.
              </div>
            ) : (
              <div className="space-y-3">
                {accessRequests.map((reqItem) => (
                  <div
                    key={reqItem.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 font-black flex items-center justify-center">
                        {reqItem.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{reqItem.fullName}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              reqItem.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-700'
                                : reqItem.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {reqItem.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {reqItem.designation} • {reqItem.department}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">
                          {reqItem.email} • {reqItem.phone} • {reqItem.requestedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {reqItem.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleApproveRequest(reqItem)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
                          >
                            <Check className="w-4 h-4 stroke-[3]" /> Approve & Activate (অনুমোদন)
                          </button>
                          <button
                            onClick={() => handleRejectRequest(reqItem.id)}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs transition-colors"
                          >
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">
                          {reqItem.status === 'APPROVED' ? 'Activated & Active in Roster' : 'Request Closed'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: LOGIN CREDENTIALS */}
        {activeTab === 'credentials' && (
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Employee Login Credentials & Passwords
                </h3>
                <p className="text-xs text-slate-500">
                  Super Admin and Company Admin can view login details to assist employees with first-time onboarding.
                </p>
              </div>
              <button
                onClick={() => handleCopy(employees.map((e) => `${e.name}: ${e.email} / ${e.loginDetails.defaultPassword}`).join('\n'), 'All Credentials')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Roster Passwords
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-xl">Staff</th>
                    <th className="p-3">Login Username (Email)</th>
                    <th className="p-3">Password</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredEmployees.slice(0, 50).map((emp) => {
                    const isRevealed = showPassMap[emp.id];
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          {emp.name} ({emp.employeeId})
                        </td>
                        <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                          {emp.email}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {isRevealed ? emp.loginDetails.defaultPassword : '••••••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordReveal(emp.id)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleCopy(emp.loginDetails.defaultPassword, 'Password')}
                              className="text-slate-400 hover:text-blue-600"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                            {(emp as any).loginDetails?.role || emp.designation || 'Employee'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => showToast(`Password reset link sent to ${emp.email}`)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                          >
                            Reset
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: DOUBLE-SIDED ID CARDS */}
        {activeTab === 'idcards' && (
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Corporate Double-Sided ID Badge Printing
                </h3>
                <p className="text-xs text-slate-500">
                  ISO/IEC 7810 ID-1 standard with magnetic stripe, barcode & emergency contact.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredEmployees.slice(0, 16).map((emp) => (
                <div
                  key={emp.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-xl object-cover border border-blue-400" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{emp.name}</h4>
                      <p className="text-[11px] text-blue-600 font-semibold">{emp.designation}</p>
                      <span className="font-mono text-[9px] text-slate-400">{emp.employeeId} • {emp.bloodGroup}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEmployeeForCard(emp)}
                    className="w-full py-2 rounded-xl bg-[#3758D8] text-white font-bold text-xs hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Both Sides
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD EMPLOYEE MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                    <Plus className="w-5 h-5 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Add New Employee</h3>
                    <p className="text-xs text-slate-500">Directly adds personnel to WorkForce 360 & Supabase</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleCreateEmployeeSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shakib Al Hasan"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="shakib@workforce360.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Department / Squad</label>
                    <select
                      value={newTeam}
                      onChange={(e) => setNewTeam(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    >
                      <option>Engineering Squad (Tech & Core Systems)</option>
                      <option>Human Resources Squad (People & Talent)</option>
                      <option>Sales & Growth Squad</option>
                      <option>Product & UI/UX Squad</option>
                      <option>Finance & Operations Squad</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Designation</label>
                    <input
                      type="text"
                      value={newDesignation}
                      onChange={(e) => setNewDesignation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Blood Group</label>
                    <select
                      value={newBloodGroup}
                      onChange={(e) => setNewBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    >
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>O+</option>
                      <option>O-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Branch</label>
                    <select
                      value={newBranch}
                      onChange={(e) => setNewBranch(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    >
                      <option>Banani HQ, Dhaka</option>
                      <option>Gulshan Hub, Dhaka</option>
                      <option>Dhanmondi Branch</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Monthly Salary (BDT)</label>
                    <input
                      type="number"
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[11px] text-blue-800 dark:text-blue-200">
                  Default login password will be set to: <span className="font-mono font-bold">password123</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Saving to Database...' : 'Save Employee (সংরক্ষণ)'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PRINT ID CARD MODAL */}
        <EmployeeIdCardModal
          employee={selectedEmployeeForCard}
          isOpen={!!selectedEmployeeForCard}
          onClose={() => setSelectedEmployeeForCard(null)}
        />
      </div>
    </RoleGuard>
  );
}

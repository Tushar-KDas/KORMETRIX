'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Check,
  X,
  FileText,
  Calendar,
  Coins,
  Filter,
  DollarSign,
  Download,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';

interface ExpenseClaim {
  id: string;
  claimCode: string;
  employeeName: string;
  employeeCode: string;
  category: 'Travel & Fuel' | 'Client Entertainment' | 'Office Supplies' | 'Internet & Phone' | 'Hardware';
  description: string;
  amountBDT: number;
  date: string;
  receiptUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
}

const initialExpenses: ExpenseClaim[] = [
  {
    id: 'exp-1',
    claimCode: 'EXP-901',
    employeeName: 'Rafiq Ahmed',
    employeeCode: 'EMP-004',
    category: 'Client Entertainment',
    description: 'Client lunch meeting with Grameenphone procurement team at Westin Dhaka',
    amountBDT: 8500,
    date: '24 Apr 2025',
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-9e4466b88738?w=400',
    status: 'PENDING',
  },
  {
    id: 'exp-2',
    claimCode: 'EXP-902',
    employeeName: 'Ahmed Rahman',
    employeeCode: 'EMP-002',
    category: 'Travel & Fuel',
    description: 'CNG & Uber transport for onsite geofence testing at Agrabad Chattogram',
    amountBDT: 4200,
    date: '23 Apr 2025',
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-9e4466b88738?w=400',
    status: 'PENDING',
  },
  {
    id: 'exp-3',
    claimCode: 'EXP-903',
    employeeName: 'Sarah Khan',
    employeeCode: 'EMP-003',
    category: 'Office Supplies',
    description: 'Stationery and employee onboarding kits for new April batch',
    amountBDT: 14500,
    date: '20 Apr 2025',
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-9e4466b88738?w=400',
    status: 'APPROVED',
  },
  {
    id: 'exp-4',
    claimCode: 'EXP-904',
    employeeName: 'Tanvir Hasan',
    employeeCode: 'EMP-001',
    category: 'Internet & Phone',
    description: 'Monthly 4G data stipend for high-availability production on-call',
    amountBDT: 2500,
    date: '18 Apr 2025',
    status: 'DISBURSED',
  },
  {
    id: 'exp-5',
    claimCode: 'EXP-905',
    employeeName: 'Ahmed Rahman',
    employeeCode: 'EMP-002',
    category: 'Hardware',
    description: 'USB-C HDMI hub for conference room presentation',
    amountBDT: 3200,
    date: '15 Apr 2025',
    status: 'APPROVED',
  },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseClaim[]>(initialExpenses);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ExpenseClaim | null>(null);

  // Form states
  const [empName, setEmpName] = useState('Ahmed Rahman');
  const [category, setCategory] = useState<ExpenseClaim['category']>('Travel & Fuel');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(2500);

  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: action } : e))
    );
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    const newClaim: ExpenseClaim = {
      id: `exp-${Date.now()}`,
      claimCode: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      employeeName: empName,
      employeeCode: 'EMP-002',
      category: category,
      description: description,
      amountBDT: Number(amount) || 1000,
      date: 'Today',
      status: 'PENDING',
    };
    setExpenses([newClaim, ...expenses]);
    setDescription('');
    setShowAddModal(false);
  };

  const filtered = expenses.filter((e) => {
    const matchesSearch =
      e.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      e.claimCode.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPendingBDT = expenses
    .filter((e) => e.status === 'PENDING')
    .reduce((acc, e) => acc + e.amountBDT, 0);

  const totalApprovedBDT = expenses
    .filter((e) => e.status === 'APPROVED' || e.status === 'DISBURSED')
    .reduce((acc, e) => acc + e.amountBDT, 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200 bg-white/10 px-3 py-1 rounded-full w-fit mb-2 backdrop-blur-md">
            <Receipt className="w-3.5 h-3.5 text-cyan-300" /> Corporate Expense Reimbursals
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Expense Claims & Vouchers</h1>
          <p className="text-blue-100 text-sm mt-1">
            Review employee field expenditures, fuel, client hospitality & approve digital payouts in BDT (৳).
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-[#3758D8] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> New Expense Claim
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Pending Review</span>
          <h3 className="text-2xl font-black text-amber-500 mt-1">{formatBDT(totalPendingBDT)}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {expenses.filter((e) => e.status === 'PENDING').length} claims awaiting action
          </p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Approved & Disbursed</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{formatBDT(totalApprovedBDT)}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Transferred to employee payroll</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Average Processing Time</span>
          <h3 className="text-2xl font-black text-[#3758D8] mt-1">4.2 Hours</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-0.5">↑ Fast Turnaround</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Audit Compliance</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">100%</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Vouchers & receipts attached</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee, voucher code or description..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#3758D8]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {['ALL', 'PENDING', 'APPROVED', 'DISBURSED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#3758D8] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Claim Code</th>
                <th className="p-3.5">Employee</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Purpose & Description</th>
                <th className="p-3.5">Amount (BDT)</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#3758D8]">{item.claimCode}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {item.employeeName}
                    <span className="block text-[10px] text-slate-400 font-normal">{item.employeeCode}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate font-medium">
                    {item.description}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatBDT(item.amountBDT)}
                  </td>
                  <td className="p-3.5 text-slate-500 font-medium">{item.date}</td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'APPROVED' || item.status === 'DISBURSED'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                          : item.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                          : 'bg-red-50 text-red-600 dark:bg-red-950/40'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                    {item.receiptUrl && (
                      <button
                        onClick={() => setSelectedReceipt(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#3758D8] hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Receipt"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {item.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleAction(item.id, 'APPROVED')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(item.id, 'REJECTED')}
                          className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-[11px] shadow-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Voucher Attachment: {selectedReceipt.claimCode}
              </h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={selectedReceipt.receiptUrl}
              alt="Receipt Preview"
              className="w-full h-64 object-cover rounded-2xl border dark:border-slate-700"
            />
            <div className="space-y-1">
              <p><strong>Employee:</strong> {selectedReceipt.employeeName}</p>
              <p><strong>Category:</strong> {selectedReceipt.category}</p>
              <p><strong>Amount:</strong> <span className="font-mono text-emerald-600 font-bold">{formatBDT(selectedReceipt.amountBDT)}</span></p>
              <p className="text-slate-500">{selectedReceipt.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">File Official Expense Claim</h3>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Employee Name</label>
                <select
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option>Ahmed Rahman</option>
                  <option>Sarah Khan</option>
                  <option>Tanvir Hasan</option>
                  <option>Rafiq Ahmed</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option>Travel & Fuel</option>
                    <option>Client Entertainment</option>
                    <option>Office Supplies</option>
                    <option>Internet & Phone</option>
                    <option>Hardware</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Amount in BDT (৳)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Purpose / Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the business necessity for this expense..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
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
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

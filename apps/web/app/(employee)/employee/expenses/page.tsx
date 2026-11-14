'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Upload,
  Receipt,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';

interface ExpenseClaim {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receiptName: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const mockClaims: ExpenseClaim[] = [
  { id: 'EXP-101', category: 'Client Lunch', description: 'Business meal with client technical team at Banani', amount: 3500, date: '11 Nov, 2026', receiptName: 'lunch_receipt.jpg', status: 'Pending' },
  { id: 'EXP-102', category: 'Office Hardware', description: 'Ergonomic mouse and USB-C multiport hub', amount: 4800, date: '28 Oct, 2026', receiptName: 'gadget_invoice.pdf', status: 'Approved' },
  { id: 'EXP-103', category: 'Travel / Uber', description: 'Transport to Chittagong branch office visit', amount: 2200, date: '15 Oct, 2026', receiptName: 'uber_receipt.pdf', status: 'Approved' },
];

export default function EmployeeExpensesPage() {
  const [claims, setClaims] = useState(mockClaims);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('Travel / Conveyance');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    const newClaim: ExpenseClaim = {
      id: `EXP-${100 + claims.length + 1}`,
      category,
      description: description || 'Reimbursement request',
      amount: Number(amount),
      date: 'Today',
      receiptName: 'attached_bill.pdf',
      status: 'Pending',
    };
    setClaims([newClaim, ...claims]);
    setShowModal(false);
    setToast('Expense claim submitted to finance department for reimbursement!');
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-blue-200 dark:border-blue-800">
            Reimbursement Desk
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Expense Claims & Bills</h1>
          <p className="text-slate-500 text-xs mt-1">Submit business expense vouchers, upload money receipts, and check disbursement status.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#3758D8] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Submit Expense Claim
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {toast}
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Claim History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Claim ID</th>
                <th className="p-3">Category & Notes</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Receipt</th>
                <th className="p-3 text-right rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {claims.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{c.id}</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">{c.category}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                  </td>
                  <td className="p-3 text-slate-500">{c.date}</td>
                  <td className="p-3 font-mono font-bold text-[#3758D8] text-sm">{formatBDT(c.amount)}</td>
                  <td className="p-3 text-slate-500 underline cursor-pointer" onClick={() => showAppToast(`Previewing receipt: ${c.receiptName}`)}>
                    {c.receiptName}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : c.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Submit Reimbursement</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs"
                >
                  <option>Travel / Conveyance</option>
                  <option>Client Meal / Entertainment</option>
                  <option>Office Stationery & Equipment</option>
                  <option>Training & Certification</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Amount (BDT ৳)</label>
                <input
                  type="number"
                  placeholder="e.g. 2500"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details of expense..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Upload Receipt / Invoice</label>
                <div className="mt-1 p-3 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 cursor-pointer hover:border-[#3758D8]">
                  <Upload className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                  <span className="text-[11px]">Click to upload bill image or PDF</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#3758D8] text-white text-xs font-bold shadow-md shadow-blue-500/20">Submit Voucher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

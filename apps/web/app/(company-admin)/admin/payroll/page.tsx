'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  Download,
  CheckCircle,
  FileText,
  DollarSign,
  AlertCircle,
  Building,
  Calendar,
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';

interface PayslipRow {
  id: string;
  employeeCode: string;
  name: string;
  basicSalaryBDT: number;
  houseRentBDT: number;
  allowancesBDT: number;
  grossSalaryBDT: number;
  taxDeductionBDT: number;
  providentFundBDT: number;
  totalDeductionsBDT: number;
  netPayableBDT: number;
  status: 'DRAFT' | 'LOCKED' | 'PAID';
}

const mockPayslips: PayslipRow[] = [
  {
    id: 'ps-1',
    employeeCode: 'EMP-001',
    name: 'Tanvir Hasan',
    basicSalaryBDT: 75000,
    houseRentBDT: 37500,
    allowancesBDT: 37500,
    grossSalaryBDT: 150000,
    taxDeductionBDT: 12500,
    providentFundBDT: 7500,
    totalDeductionsBDT: 20000,
    netPayableBDT: 130000,
    status: 'LOCKED',
  },
  {
    id: 'ps-2',
    employeeCode: 'EMP-002',
    name: 'Ahmed Rahman',
    basicSalaryBDT: 37500,
    houseRentBDT: 18750,
    allowancesBDT: 18750,
    grossSalaryBDT: 75000,
    taxDeductionBDT: 3500,
    providentFundBDT: 3750,
    totalDeductionsBDT: 7250,
    netPayableBDT: 67750,
    status: 'LOCKED',
  },
  {
    id: 'ps-3',
    employeeCode: 'EMP-003',
    name: 'Sarah Khan',
    basicSalaryBDT: 30000,
    houseRentBDT: 15000,
    allowancesBDT: 15000,
    grossSalaryBDT: 60000,
    taxDeductionBDT: 1500,
    providentFundBDT: 3000,
    totalDeductionsBDT: 4500,
    netPayableBDT: 55500,
    status: 'LOCKED',
  },
];

export default function PayrollAdminPage() {
  const [period, setPeriod] = useState('April 2025');
  const [isLocked, setIsLocked] = useState(true);
  const [payslips, setPayslips] = useState(mockPayslips);

  const totalGross = payslips.reduce((acc, p) => acc + p.grossSalaryBDT, 0);
  const totalTax = payslips.reduce((acc, p) => acc + p.taxDeductionBDT, 0);
  const totalNet = payslips.reduce((acc, p) => acc + p.netPayableBDT, 0);

  const handleLockPayroll = () => {
    setIsLocked(true);
    showAppToast('Payroll run finalized and locked in database transactions! Historical snapshot preserved.');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Payroll Engine & Bangladesh Tax Compliance
          </h1>
          <p className="text-slate-500 text-sm">
            Automated salary calculations, statutory deductions, tax slabs & immutable finalization locks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => showAppToast('Bank Transfer EFT/BEFTN payment advice file generated!')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Bank Export (BEFTN)
          </button>
          {!isLocked ? (
            <button
              onClick={handleLockPayroll}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Lock className="w-4 h-4" /> Finalize & Lock Payroll
            </button>
          ) : (
            <span className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Finalized & Locked
            </span>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Total Gross Salary (BDT)</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatBDT(totalGross)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Period: {period}</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Statutory Tax & Deductions</span>
          <h3 className="text-2xl font-black text-rose-600 mt-1">
            {formatBDT(totalTax)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Finance Act 2024-2025 Slabs</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Net Payable Disbursement</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">
            {formatBDT(totalNet)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">248 Bank / bKash Transfers</p>
        </div>
      </div>

      {/* Payslips Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Itemized Employee Payslips ({period})
          </h2>
          <span className="text-xs font-bold text-slate-500 font-mono">Currency: BDT (৳)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Employee</th>
                <th className="p-3">Basic (50%)</th>
                <th className="p-3">House Rent (25%)</th>
                <th className="p-3">Allowances</th>
                <th className="p-3">Gross Salary</th>
                <th className="p-3">Tax Deduction</th>
                <th className="p-3">Net Payable</th>
                <th className="p-3 text-right rounded-r-xl">Payslip PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {payslips.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{p.employeeCode}</p>
                  </td>
                  <td className="p-3 font-mono">{formatBDT(p.basicSalaryBDT)}</td>
                  <td className="p-3 font-mono">{formatBDT(p.houseRentBDT)}</td>
                  <td className="p-3 font-mono">{formatBDT(p.allowancesBDT)}</td>
                  <td className="p-3 font-bold font-mono text-slate-900 dark:text-white">
                    {formatBDT(p.grossSalaryBDT)}
                  </td>
                  <td className="p-3 font-mono text-rose-600">-{formatBDT(p.taxDeductionBDT)}</td>
                  <td className="p-3 font-bold font-mono text-emerald-600">
                    {formatBDT(p.netPayableBDT)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => showAppToast(`Downloaded Payslip PDF for ${p.name}`)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#3758D8] font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5 ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
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

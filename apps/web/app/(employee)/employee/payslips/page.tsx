'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  Receipt,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  CreditCard,
  X,
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';

interface Payslip {
  month: string;
  year: string;
  gross: number;
  deductions: number;
  net: number;
  disbursedOn: string;
  bankRef: string;
}

const mockPayslips: Payslip[] = [
  { month: 'April', year: '2025', gross: 75000, deductions: 7250, net: 67750, disbursedOn: '30 Apr, 2025', bankRef: 'BRAC-6002-TRX9921' },
  { month: 'March', year: '2025', gross: 75000, deductions: 7250, net: 67750, disbursedOn: '31 Mar, 2025', bankRef: 'BRAC-6002-TRX8812' },
  { month: 'February', year: '2025', gross: 75000, deductions: 7250, net: 67750, disbursedOn: '28 Feb, 2025', bankRef: 'BRAC-6002-TRX7745' },
  { month: 'January', year: '2025', gross: 75000, deductions: 7250, net: 67750, disbursedOn: '31 Jan, 2025', bankRef: 'BRAC-6002-TRX6609' },
];

export default function EmployeePayslipsPage() {
  const [selectedSlip, setSelectedSlip] = useState<Payslip | null>(null);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-blue-200 dark:border-blue-800">
            Compensation & Payroll
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">My Payslips & Tax Deductions</h1>
          <p className="text-slate-500 text-xs mt-1">Download official monthly payslips, view salary breakdowns, and review income tax deductions.</p>
        </div>

        <button
          onClick={() => showAppToast('Downloading official Annual Tax Statement (FY 2024-25)...')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
        >
          <Download className="w-4 h-4 text-[#3758D8]" /> Download Tax Certificate
        </button>
      </div>

      {/* Payslips Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Disbursed Salary History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Salary Period</th>
                <th className="p-3">Gross Earnings</th>
                <th className="p-3">Total Deductions</th>
                <th className="p-3">Net Disbursed</th>
                <th className="p-3">Disbursed Date</th>
                <th className="p-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {mockPayslips.map((slip, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#3758D8]" />
                    <span>{slip.month} {slip.year}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-200">{formatBDT(slip.gross)}</td>
                  <td className="p-3 font-mono text-rose-600 font-bold">-{formatBDT(slip.deductions)}</td>
                  <td className="p-3 font-mono text-emerald-600 font-bold text-sm">{formatBDT(slip.net)}</td>
                  <td className="p-3 text-slate-500">{slip.disbursedOn}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedSlip(slip)}
                        className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-[#3758D8] font-bold text-xs"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => showAppToast(`Downloaded official ${slip.month} ${slip.year} PDF Payslip!`)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Payslip: {selectedSlip.month} {selectedSlip.year}
                </h3>
                <p className="text-xs text-slate-400">WorkForce 360 Ltd • Bank Ref: {selectedSlip.bankRef}</p>
              </div>
              <button onClick={() => setSelectedSlip(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs">
              <div className="flex justify-between"><span>Basic Pay (50%):</span><span className="font-mono font-bold">{formatBDT(37500)}</span></div>
              <div className="flex justify-between"><span>House Rent Allowance:</span><span className="font-mono font-bold">{formatBDT(18750)}</span></div>
              <div className="flex justify-between"><span>Medical & Travel Allowance:</span><span className="font-mono font-bold">{formatBDT(18750)}</span></div>
              <div className="flex justify-between text-rose-600 border-t border-slate-200 pt-2">
                <span>Tax Deducted at Source (TDS):</span><span className="font-mono font-bold">-{formatBDT(5250)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Provident Fund (PF):</span><span className="font-mono font-bold">-{formatBDT(2000)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                <span>Net Credited:</span>
                <span className="text-[#3758D8] font-mono">{formatBDT(selectedSlip.net)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                showAppToast(`Downloaded PDF for ${selectedSlip.month} ${selectedSlip.year}`);
                setSelectedSlip(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#3758D8] text-white text-xs font-bold"
            >
              Download PDF Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

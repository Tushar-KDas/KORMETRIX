'use client';

import React, { useState } from 'react';
import {
  Printer,
  Download,
  RotateCw,
  X,
  ShieldCheck,
  QrCode,
  Building,
  Phone,
  Mail,
  Heart,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { FullEmployee } from '@/lib/employees-100';

interface EmployeeIdCardModalProps {
  employee: FullEmployee | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeIdCardModal({ employee, isOpen, onClose }: EmployeeIdCardModalProps) {
  const [activeSide, setActiveSide] = useState<'both' | 'front' | 'back'>('both');

  if (!isOpen || !employee) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      {/* Screen container */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 max-w-4xl w-full border border-slate-700 shadow-2xl space-y-6 relative print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Controls - Hidden during print */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 print:hidden">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Official CR80 Smart ID Card</span>
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">
              {employee.name} — {employee.employeeId}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSide(activeSide === 'front' ? 'back' : activeSide === 'back' ? 'both' : 'front')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>View: {activeSide.toUpperCase()}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#3758D8] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/30"
            >
              <Printer className="w-4 h-4" />
              <span>Print Both Sides</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div id="printable-id-card-area" className="flex flex-col md:flex-row items-center justify-center gap-8 py-4 print:py-0 print:gap-4 print:flex-row">
          
          {/* FRONT SIDE (CR80 Standard: 3.375" x 2.125" aspect ratio ~ 1.58:1) */}
          {(activeSide === 'both' || activeSide === 'front') && (
            <div className="w-[320px] h-[480px] rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0B1120] text-white p-5 border-2 border-slate-700/80 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none print:shadow-none print:border-slate-800 print:text-white print:bg-[#1E293B]">
              {/* Top Accent Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#3758D8] via-[#06B6D4] to-[#16A389]" />

              {/* Header Branding */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#14243F] border border-blue-500/40 flex items-center justify-center font-black text-white text-sm">
                    K
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-tight leading-none text-white flex items-center gap-0.5">
                      KORMETRI<span className="text-[#19B89A]">X</span>
                    </h4>
                    <p className="text-[9px] text-teal-300 font-bold uppercase tracking-wider">WorkForce 360 Ltd</p>
                  </div>
                </div>

                {/* Smart Chip Graphic */}
                <div className="w-8 h-6 rounded-md bg-amber-400/90 border border-amber-300 flex items-center justify-center shadow-xs">
                  <div className="w-5 h-3 border border-amber-600/70 rounded-xs grid grid-cols-2 gap-0.5">
                    <span className="border-r border-amber-600/70" />
                    <span />
                  </div>
                </div>
              </div>

              {/* Employee Photo & Identification */}
              <div className="flex flex-col items-center text-center mt-2">
                <div className="relative">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-400 shadow-xl"
                  />
                  <span className="absolute -bottom-2 -right-1 px-2 py-0.5 bg-emerald-500 text-white font-black text-[10px] rounded-full shadow-md">
                    {employee.bloodGroup}
                  </span>
                </div>

                <h3 className="text-base font-black text-white mt-3 leading-tight">{employee.name}</h3>
                <p className="text-xs font-bold text-blue-400 mt-0.5">{employee.designation}</p>
                <span className="inline-block px-2.5 py-0.5 mt-1 rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300 border border-slate-700">
                  {employee.team}
                </span>
              </div>

              {/* Details Grid */}
              <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Employee ID:</span>
                  <span className="font-mono font-bold text-white text-xs">{employee.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Branch:</span>
                  <span className="font-semibold text-white">{employee.branch.split(',')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issued On:</span>
                  <span className="font-semibold text-white">{employee.joiningDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valid Thru:</span>
                  <span className="font-semibold text-emerald-400">31 Dec, 2028</span>
                </div>
              </div>

              {/* Bottom Hologram Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[9px] text-slate-400">
                <div className="flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>NFC SECURE VERIFIED</span>
                </div>
                <span className="font-black text-amber-400">AUTHORIZED CARD</span>
              </div>
            </div>
          )}

          {/* BACK SIDE */}
          {(activeSide === 'both' || activeSide === 'back') && (
            <div className="w-[320px] h-[480px] rounded-3xl bg-[#090D16] text-white p-5 border-2 border-slate-700/80 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none print:shadow-none print:border-slate-800 print:text-white print:bg-[#090D16]">
              {/* Magnetic Stripe */}
              <div className="absolute top-4 left-0 right-0 h-9 bg-slate-950 border-y border-slate-800 flex items-center px-4">
                <span className="text-[7px] text-slate-600 font-mono tracking-widest">
                  TRACK 1: %BWF360^{employee.employeeId}^{employee.name}?
                </span>
              </div>

              {/* Declarations (Below Magnetic Stripe) */}
              <div className="mt-12 text-[9px] text-slate-300 leading-relaxed space-y-2">
                <p className="font-bold text-white uppercase text-[10px] text-center border-b border-slate-800 pb-1">
                  Cardholder Declaration & Terms
                </p>
                <p>
                  1. This card is issued under <b>KORMETRIX Enterprise</b> for WorkForce 360 Ltd. and must be returned upon cessation of employment.
                </p>
                <p>
                  2. Misuse, transfer, or duplication is strictly prohibited and subject to legal action under the Bangladesh ICT Act.
                </p>
                <p>
                  3. If lost or found, please return to any KORMETRIX authorized office or drop in any Bangladesh Post mailbox.
                </p>
              </div>

              {/* Emergency Contacts & Headquarters */}
              <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-[9px] space-y-1">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <Building className="w-3 h-3 text-blue-400" />
                  <span>Headquarters: Banani Road 11, Dhaka-1213</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>24/7 Hotline: +880 2 9876543 / 16247</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Mail className="w-3 h-3 text-blue-400" />
                  <span>Emergency: {employee.emergencyContact.name} ({employee.emergencyContact.phone})</span>
                </div>
              </div>

              {/* Barcode & Authorized Signature */}
              <div className="pt-2 border-t border-slate-800 flex items-end justify-between">
                <div>
                  <div className="h-8 w-28 bg-white p-1 rounded flex items-center justify-center">
                    {/* Simulated High-density Code128 Barcode */}
                    <div className="h-full w-full flex items-center justify-between">
                      {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2].map((w, i) => (
                        <span key={i} className="bg-black h-full" style={{ width: `${w * 1.2}px` }} />
                      ))}
                    </div>
                  </div>
                  <span className="font-mono text-[8px] text-slate-400 block mt-0.5 text-center">{employee.employeeId}</span>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-blue-300 text-sm border-b border-slate-600 pb-0.5">
                    Nusrat Jahan
                  </div>
                  <span className="text-[8px] text-slate-400 block uppercase font-bold">Authorized Signatory</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Print instructions - Hidden during print */}
        <div className="text-center text-xs text-slate-400 print:hidden pt-2 border-t border-slate-800">
          <p>
            💡 <b>Tip:</b> Click <b>&quot;Print Both Sides&quot;</b> to generate ready-to-cut CR80 standard badges or send directly to a thermal PVC card printer.
          </p>
        </div>
      </div>
    </div>
  );
}

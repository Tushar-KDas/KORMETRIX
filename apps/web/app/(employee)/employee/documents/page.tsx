'use client';
import { showAppToast } from '@/components/common/toast';

import React from 'react';
import {
  FileText,
  Download,
  Upload,
  ShieldCheck,
  Eye,
} from 'lucide-react';

interface EmployeeDoc {
  id: string;
  name: string;
  category: 'Contract' | 'Identification' | 'Certificate';
  uploadedAt: string;
  size: string;
}

const mockDocs: EmployeeDoc[] = [
  { id: '1', name: 'Official Employment Contract (Signed)', category: 'Contract', uploadedAt: '15 Jan, 2023', size: '1.2 MB' },
  { id: '2', name: 'National ID Card (NID) Smart Copy', category: 'Identification', uploadedAt: '15 Jan, 2023', size: '450 KB' },
  { id: '3', name: 'Non-Disclosure Agreement (NDA)', category: 'Contract', uploadedAt: '15 Jan, 2023', size: '320 KB' },
  { id: '4', name: 'B.Sc. in Computer Science Certificate', category: 'Certificate', uploadedAt: '18 Jan, 2023', size: '2.8 MB' },
  { id: '5', name: 'AWS Certified Solutions Architect Badge', category: 'Certificate', uploadedAt: '10 Aug, 2024', size: '900 KB' },
];

export default function EmployeeDocumentsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-blue-200 dark:border-blue-800">
            Dossier & Credentials
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">My Official Documents</h1>
          <p className="text-slate-500 text-xs mt-1">Verified employee contracts, government identification, and educational certifications.</p>
        </div>

        <button
          onClick={() => showAppToast('Opening secure uploader for new document/certificate...')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#3758D8] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          <Upload className="w-4 h-4" /> Upload New Certificate
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#3758D8] flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {doc.category}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2">{doc.name}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Uploaded {doc.uploadedAt} • {doc.size}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> HR Verified
              </span>
              <button
                onClick={() => showAppToast(`Downloading verified copy of: ${doc.name}`)}
                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-[#3758D8] transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  FolderLock,
  FileText,
  Upload,
  Download,
  Search,
  Eye,
  Trash2,
  CheckCircle,
} from 'lucide-react';

interface HRDocument {
  id: string;
  title: string;
  category: 'Policy' | 'Contract' | 'Handbook' | 'Compliance';
  updatedAt: string;
  size: string;
  signedCount: string;
}

const mockDocuments: HRDocument[] = [
  { id: 'DOC-1', title: 'WorkForce 360 Employee Handbook 2026', category: 'Handbook', updatedAt: '01 Nov, 2026', size: '2.4 MB', signedCount: '248/248' },
  { id: 'DOC-2', title: 'Standard Employment Agreement Template', category: 'Contract', updatedAt: '15 Oct, 2026', size: '420 KB', signedCount: 'Template' },
  { id: 'DOC-3', title: 'Remote Work & Equipment Policy', category: 'Policy', updatedAt: '28 Sep, 2026', size: '850 KB', signedCount: '235/248' },
  { id: 'DOC-4', title: 'Non-Disclosure Agreement (NDA)', category: 'Compliance', updatedAt: '05 Aug, 2026', size: '310 KB', signedCount: '248/248' },
];

export default function HRDocumentsPage() {
  const [docs, setDocs] = useState(mockDocuments);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-teal-200 dark:border-teal-800">
            Document Repository
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">HR Contracts & Policies</h1>
          <p className="text-slate-500 text-xs mt-1">Enterprise document vault, compliance policy distribution, and digital signature tracking.</p>
        </div>

        <button
          onClick={() => showAppToast('Opening secure cloud file uploader...')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#16A389] hover:bg-[#12806B] text-white text-xs font-bold transition-all shadow-lg shadow-teal-500/20"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-[#16A389] flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {doc.category}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 line-clamp-2">{doc.title}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Updated {doc.updatedAt} • {doc.size}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Signed: <b className="text-teal-600 font-mono">{doc.signedCount}</b></span>
              <div className="flex gap-2">
                <button
                  onClick={() => showAppToast(`Downloading ${doc.title}...`)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  FolderLock,
  Search,
  Plus,
  FileText,
  Download,
  Upload,
  Lock,
  Globe,
  Trash2,
  CheckCircle,
  FileSpreadsheet,
  ShieldAlert,
} from 'lucide-react';

interface DocItem {
  id: string;
  title: string;
  category: 'Company Policies' | 'Labor Law & Legal' | 'Contracts & NDAs' | 'Tax & Financial';
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX';
  uploadDate: string;
  accessLevel: 'ALL_STAFF' | 'MANAGERS_ONLY' | 'ADMIN_ONLY';
  downloadCount: number;
}

const initialDocs: DocItem[] = [
  {
    id: 'doc-1',
    title: 'WorkForce 360 Employee Code of Conduct & Handbook 2025',
    category: 'Company Policies',
    fileSize: '3.4 MB',
    fileType: 'PDF',
    uploadDate: '01 Jan 2025',
    accessLevel: 'ALL_STAFF',
    downloadCount: 248,
  },
  {
    id: 'doc-2',
    title: 'Bangladesh Labor Act 2006 & Amendments 2013 Compliance Guide',
    category: 'Labor Law & Legal',
    fileSize: '5.1 MB',
    fileType: 'PDF',
    uploadDate: '15 Jan 2025',
    accessLevel: 'ALL_STAFF',
    downloadCount: 182,
  },
  {
    id: 'doc-3',
    title: 'Standard Non-Disclosure & Intellectual Property Assignment Agreement',
    category: 'Contracts & NDAs',
    fileSize: '1.2 MB',
    fileType: 'DOCX',
    uploadDate: '10 Feb 2025',
    accessLevel: 'MANAGERS_ONLY',
    downloadCount: 45,
  },
  {
    id: 'doc-4',
    title: 'National Board of Revenue (NBR) Withholding Tax Slabs 2024-2025',
    category: 'Tax & Financial',
    fileSize: '2.8 MB',
    fileType: 'PDF',
    uploadDate: '01 Mar 2025',
    accessLevel: 'ADMIN_ONLY',
    downloadCount: 12,
  },
  {
    id: 'doc-5',
    title: 'BEFTN Electronic Fund Transfer Authorization Mandate Form',
    category: 'Tax & Financial',
    fileSize: '850 KB',
    fileType: 'PDF',
    uploadDate: '18 Mar 2025',
    accessLevel: 'ALL_STAFF',
    downloadCount: 94,
  },
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocItem[]>(initialDocs);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState<DocItem['category']>('Company Policies');
  const [newAccess, setNewAccess] = useState<DocItem['accessLevel']>('ALL_STAFF');

  const filtered = docs.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === 'ALL' || d.category === catFilter;
    return matchesSearch && matchesCat;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newDoc: DocItem = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      category: newCat,
      fileSize: '1.8 MB',
      fileType: 'PDF',
      uploadDate: 'Today',
      accessLevel: newAccess,
      downloadCount: 0,
    };
    setDocs([newDoc, ...docs]);
    setNewTitle('');
    setShowUploadModal(false);
  };

  const handleDownload = (doc: DocItem) => {
    showAppToast(`Downloading "${doc.title}.${doc.fileType.toLowerCase()}" (${doc.fileSize}) from secure Supabase storage vault.`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200 bg-white/10 px-3 py-1 rounded-full w-fit mb-2 backdrop-blur-md">
            <FolderLock className="w-3.5 h-3.5 text-cyan-300" /> Enterprise Document Repository & Policy Vault
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Company Documents & Policies</h1>
          <p className="text-blue-100 text-sm mt-1">
            Centrally distribute employment contracts, NBR tax forms, policy guidelines & compliance docs.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-[#3758D8] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Total Active Documents</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{docs.length} Files</h3>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Storage Consumption</span>
          <h3 className="text-2xl font-black text-[#3758D8] mt-1">1.2 GB / 100 GB</h3>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Signed NDAs & Contracts</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">100% Signed</h3>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Security Encryption</span>
          <h3 className="text-2xl font-black text-purple-600 mt-1">AES-256 Vault</h3>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by title or category..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#3758D8]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {['ALL', 'Company Policies', 'Labor Law & Legal', 'Contracts & NDAs', 'Tax & Financial'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                catFilter === cat
                  ? 'bg-[#3758D8] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Document Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Format & Size</th>
                <th className="p-3.5">Access Scope</th>
                <th className="p-3.5">Uploaded</th>
                <th className="p-3.5">Downloads</th>
                <th className="p-3.5 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#3758D8] flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span>{d.title}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {d.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-500 font-medium">
                    {d.fileType} • {d.fileSize}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        d.accessLevel === 'ALL_STAFF'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                          : d.accessLevel === 'MANAGERS_ONLY'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                      }`}
                    >
                      {d.accessLevel.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 font-medium">{d.uploadDate}</td>
                  <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{d.downloadCount}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDownload(d)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-[#3758D8] text-[#3758D8] hover:text-white font-bold transition-all flex items-center gap-1.5 ml-auto shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Upload New Document to Vault</h3>
            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Health Insurance & Medical Benefit Guidelines 2025"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option>Company Policies</option>
                    <option>Labor Law & Legal</option>
                    <option>Contracts & NDAs</option>
                    <option>Tax & Financial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Access Level</label>
                  <select
                    value={newAccess}
                    onChange={(e) => setNewAccess(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="ALL_STAFF">All Staff</option>
                    <option value="MANAGERS_ONLY">Managers Only</option>
                    <option value="ADMIN_ONLY">Admin Only</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Select File (PDF, DOCX)</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-slate-500">Drag and drop file here, or click to browse</p>
                  <span className="text-[10px] text-slate-400">Supports PDF, DOCX up to 50MB</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 shadow-md"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

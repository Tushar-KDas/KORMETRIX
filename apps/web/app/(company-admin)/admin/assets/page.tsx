'use client';

import React, { useState } from 'react';
import {
  Monitor,
  Search,
  Plus,
  Laptop,
  Smartphone,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  Filter,
  DollarSign,
} from 'lucide-react';
import { formatBDT } from '@/lib/utils';

interface Asset {
  id: string;
  tagCode: string;
  name: string;
  category: 'Laptops & PCs' | 'Mobile Devices' | 'Biometric Terminals' | 'Office Hardware';
  serialNumber: string;
  assignedTo: string;
  department: string;
  purchaseDate: string;
  valueBDT: number;
  condition: 'EXCELLENT' | 'GOOD' | 'IN_REPAIR';
}

const initialAssets: Asset[] = [
  {
    id: 'ast-1',
    tagCode: 'AST-LPT-01',
    name: 'Apple MacBook Pro 16" M3 Max',
    category: 'Laptops & PCs',
    serialNumber: 'C02G89A4MD6R',
    assignedTo: 'Ahmed Rahman',
    department: 'Engineering',
    purchaseDate: '15 Jan 2024',
    valueBDT: 345000,
    condition: 'EXCELLENT',
  },
  {
    id: 'ast-2',
    tagCode: 'AST-LPT-02',
    name: 'Dell Precision 5570 Workstation',
    category: 'Laptops & PCs',
    serialNumber: 'DL-9820-K11',
    assignedTo: 'Tanvir Hasan',
    department: 'Engineering',
    purchaseDate: '20 Feb 2024',
    valueBDT: 260000,
    condition: 'EXCELLENT',
  },
  {
    id: 'ast-3',
    tagCode: 'AST-BIO-01',
    name: 'ZKTeco BioPro 5000 Geofence Biometric Terminal',
    category: 'Biometric Terminals',
    serialNumber: 'ZK-BIO-BANANI-01',
    assignedTo: 'Banani HQ Reception',
    department: 'Operations',
    purchaseDate: '01 Nov 2023',
    valueBDT: 85000,
    condition: 'GOOD',
  },
  {
    id: 'ast-4',
    tagCode: 'AST-LPT-03',
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    category: 'Laptops & PCs',
    serialNumber: 'LN-TP-X1-449',
    assignedTo: 'Sarah Khan',
    department: 'HRM',
    purchaseDate: '10 Mar 2024',
    valueBDT: 195000,
    condition: 'EXCELLENT',
  },
  {
    id: 'ast-5',
    tagCode: 'AST-PHN-01',
    name: 'Samsung Galaxy Tab S9 Enterprise Geofence Unit',
    category: 'Mobile Devices',
    serialNumber: 'SM-G-TAB-992',
    assignedTo: 'Rafiq Ahmed',
    department: 'Sales',
    purchaseDate: '05 May 2024',
    valueBDT: 95000,
    condition: 'GOOD',
  },
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<Asset['category']>('Laptops & PCs');
  const [newSerial, setNewSerial] = useState('');
  const [newAssignee, setNewAssignee] = useState('Ahmed Rahman');
  const [newValue, setNewValue] = useState(150000);

  const filtered = assets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.tagCode.toLowerCase().includes(search.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.assignedTo.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || a.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const newA: Asset = {
      id: `ast-${Date.now()}`,
      tagCode: `AST-GEN-${Math.floor(10 + Math.random() * 90)}`,
      name: newName,
      category: newCat,
      serialNumber: newSerial || `SN-${Date.now().toString().slice(-6)}`,
      assignedTo: newAssignee,
      department: 'Engineering',
      purchaseDate: 'Today',
      valueBDT: Number(newValue) || 100000,
      condition: 'EXCELLENT',
    };
    setAssets([newA, ...assets]);
    setNewName('');
    setNewSerial('');
    setShowAddModal(false);
  };

  const totalAssetValue = assets.reduce((acc, a) => acc + a.valueBDT, 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200 bg-white/10 px-3 py-1 rounded-full w-fit mb-2 backdrop-blur-md">
            <Monitor className="w-3.5 h-3.5 text-cyan-300" /> IT & Capital Infrastructure Inventory
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Corporate Assets & Devices</h1>
          <p className="text-blue-100 text-sm mt-1">
            Track hardware allocation, serial numbers, warranty lifecycles & employee handovers.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-[#3758D8] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Register New Asset
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Total Registered Assets</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{assets.length} Units</h3>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Total Capital Valuation</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{formatBDT(totalAssetValue)}</h3>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Assigned Ratio</span>
          <h3 className="text-2xl font-black text-[#3758D8] mt-1">100%</h3>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Warranty Active</span>
          <h3 className="text-2xl font-black text-purple-600 mt-1">100% Covered</h3>
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
            placeholder="Search asset tag, model or serial number..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#3758D8]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {['ALL', 'Laptops & PCs', 'Mobile Devices', 'Biometric Terminals'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-[#3758D8] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Asset Tag</th>
                <th className="p-3.5">Device Model / Name</th>
                <th className="p-3.5">Serial Number</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Assigned To</th>
                <th className="p-3.5">Valuation (BDT)</th>
                <th className="p-3.5 rounded-r-xl">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#3758D8]">{item.tagCode}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="p-3.5 font-mono text-slate-500">{item.serialNumber}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                    {item.assignedTo}
                    <span className="block text-[10px] text-slate-400 font-normal">{item.department}</span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatBDT(item.valueBDT)}
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                      {item.condition}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Register Corporate Asset</h3>
            <form onSubmit={handleAddAsset} className="space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Asset Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell UltraSharp 27 4K Monitor"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
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
                    <option>Laptops & PCs</option>
                    <option>Mobile Devices</option>
                    <option>Biometric Terminals</option>
                    <option>Office Hardware</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Serial Number</label>
                  <input
                    type="text"
                    placeholder="SN-10293847"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Assigned Employee</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option>Ahmed Rahman</option>
                    <option>Sarah Khan</option>
                    <option>Tanvir Hasan</option>
                    <option>Rafiq Ahmed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Valuation BDT (৳)</label>
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
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
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

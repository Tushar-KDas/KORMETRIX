'use client';

import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Users,
  Briefcase,
  Clock,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Radio,
  Search,
  Globe,
  Phone,
  Mail,
  Sliders,
  X,
  Compass,
  Check,
  Building,
} from 'lucide-react';
import { showAppToast } from '@/components/common/toast';

interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  employeeCount: number;
  biometricTerminals: number;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Department {
  id: string;
  name: string;
  code: string;
  leadName: string;
  employeeCount: number;
  budgetBDT: number;
}

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  workingHours: number;
  isNightShift: boolean;
}

const initialBranches: Branch[] = [
  {
    id: 'br-1',
    name: 'Head Office - Banani',
    code: 'HQ-BANANI',
    address: 'Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
    latitude: 23.7937,
    longitude: 90.4048,
    radiusMeters: 150,
    employeeCount: 142,
    biometricTerminals: 3,
    status: 'ACTIVE',
  },
  {
    id: 'br-2',
    name: 'Gulshan Innovation Hub',
    code: 'GLS-HUB',
    address: 'Gulshan Avenue, Gulshan 1, Dhaka-1212, Bangladesh',
    latitude: 23.7806,
    longitude: 90.4167,
    radiusMeters: 200,
    employeeCount: 68,
    biometricTerminals: 2,
    status: 'ACTIVE',
  },
  {
    id: 'br-3',
    name: 'Chattogram Port Branch',
    code: 'CTG-PORT',
    address: 'Agrabad Commercial Area, Chattogram-4100, Bangladesh',
    latitude: 22.3352,
    longitude: 91.8155,
    radiusMeters: 250,
    employeeCount: 26,
    biometricTerminals: 1,
    status: 'ACTIVE',
  },
  {
    id: 'br-4',
    name: 'Sylhet Regional Tech Unit',
    code: 'SYL-TECH',
    address: 'Zindabazar, Sylhet-3100, Bangladesh',
    latitude: 24.8949,
    longitude: 91.8687,
    radiusMeters: 180,
    employeeCount: 12,
    biometricTerminals: 1,
    status: 'ACTIVE',
  },
];

const initialDepartments: Department[] = [
  { id: 'dp-1', name: 'Engineering & Technology', code: 'ENG', leadName: 'Tanvir Hasan', employeeCount: 92, budgetBDT: 25000000 },
  { id: 'dp-2', name: 'Product, UI/UX & Design', code: 'DES', leadName: 'Sadia Islam', employeeCount: 24, budgetBDT: 15000000 },
  { id: 'dp-3', name: 'Human Resources & Talent', code: 'HR', leadName: 'Sarah Khan', employeeCount: 16, budgetBDT: 8000000 },
  { id: 'dp-4', name: 'Sales, Marketing & Growth', code: 'MKT', leadName: 'Kamrul Islam', employeeCount: 45, budgetBDT: 12000000 },
  { id: 'dp-5', name: 'Finance, Payroll & Accounts', code: 'FIN', leadName: 'Rafiqul Chowdhury', employeeCount: 18, budgetBDT: 18000000 },
];

const initialShifts: Shift[] = [
  { id: 'sh-1', name: 'Standard Corporate Shift', startTime: '09:00 AM', endTime: '06:00 PM', gracePeriodMinutes: 15, workingHours: 9, isNightShift: false },
  { id: 'sh-2', name: 'Early Morning Operations Shift', startTime: '07:00 AM', endTime: '04:00 PM', gracePeriodMinutes: 10, workingHours: 9, isNightShift: false },
  { id: 'sh-3', name: 'Support & Global Engineering Shift', startTime: '04:00 PM', endTime: '01:00 AM', gracePeriodMinutes: 20, workingHours: 9, isNightShift: true },
];

export default function OrganizationHierarchyPage() {
  const [activeTab, setActiveTab] = useState<'branches' | 'departments' | 'shifts' | 'profile'>('branches');
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);

  // Perimeter Modal State
  const [selectedBranchForPerimeter, setSelectedBranchForPerimeter] = useState<Branch | null>(null);
  const [tempRadius, setTempRadius] = useState<number>(150);
  const [tempLat, setTempLat] = useState<number>(23.7937);
  const [tempLng, setTempLng] = useState<number>(90.4048);

  // Add Branch State
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchRadius, setBranchRadius] = useState(150);

  // Add Dept State
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptLead, setDeptLead] = useState('');

  // Add Shift State
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [shiftName, setShiftName] = useState('');
  const [shiftStart, setShiftStart] = useState('09:00 AM');
  const [shiftEnd, setShiftEnd] = useState('06:00 PM');
  const [shiftGrace, setShiftGrace] = useState(15);

  const handleOpenPerimeter = (branch: Branch) => {
    setSelectedBranchForPerimeter(branch);
    setTempRadius(branch.radiusMeters);
    setTempLat(branch.latitude);
    setTempLng(branch.longitude);
  };

  const handleSavePerimeter = () => {
    if (!selectedBranchForPerimeter) return;
    setBranches((prev) =>
      prev.map((b) =>
        b.id === selectedBranchForPerimeter.id
          ? { ...b, radiusMeters: tempRadius, latitude: tempLat, longitude: tempLng }
          : b
      )
    );
    showAppToast(`Geofence perimeter for ${selectedBranchForPerimeter.name} updated to ${tempRadius}m!`);
    setSelectedBranchForPerimeter(null);
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) return;
    const newB: Branch = {
      id: `br-${branches.length + 1}`,
      name: branchName.trim(),
      code: branchCode.trim() || `BR-${branches.length + 1}`,
      address: branchAddress.trim() || 'Dhaka, Bangladesh',
      latitude: 23.7937,
      longitude: 90.4048,
      radiusMeters: branchRadius || 150,
      employeeCount: 0,
      biometricTerminals: 1,
      status: 'ACTIVE',
    };
    setBranches([...branches, newB]);
    setShowAddBranchModal(false);
    setBranchName('');
    setBranchCode('');
    setBranchAddress('');
    showAppToast(`Branch "${newB.name}" added successfully!`);
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) return;
    const newD: Department = {
      id: `dp-${departments.length + 1}`,
      name: deptName.trim(),
      code: deptCode.trim() || 'NEW',
      leadName: deptLead.trim() || 'Unassigned',
      employeeCount: 0,
      budgetBDT: 10000000,
    };
    setDepartments([...departments, newD]);
    setShowAddDeptModal(false);
    setDeptName('');
    setDeptCode('');
    setDeptLead('');
    showAppToast(`Department "${newD.name}" created successfully!`);
  };

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftName.trim()) return;
    const newS: Shift = {
      id: `sh-${shifts.length + 1}`,
      name: shiftName.trim(),
      startTime: shiftStart,
      endTime: shiftEnd,
      gracePeriodMinutes: Number(shiftGrace),
      workingHours: 9,
      isNightShift: false,
    };
    setShifts([...shifts, newS]);
    setShowAddShiftModal(false);
    setShiftName('');
    showAppToast(`Shift "${newS.name}" added successfully!`);
  };

  const toggleBranchStatus = (id: string) => {
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextStatus = b.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          showAppToast(`Branch status changed to ${nextStatus}`);
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200 bg-white/10 px-3 py-1 rounded-full w-fit mb-2 backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5 text-cyan-300" /> Enterprise Organization Setup
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Organization & Branch Hierarchy</h1>
          <p className="text-blue-100 text-sm mt-1">Configure physical branches, GPS geofencing perimeters, departments, and shifts.</p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'branches' && (
            <button
              onClick={() => setShowAddBranchModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-[#3758D8] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Office Branch
            </button>
          )}
          {activeTab === 'departments' && (
            <button
              onClick={() => setShowAddDeptModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-[#3758D8] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
          )}
          {activeTab === 'shifts' && (
            <button
              onClick={() => setShowAddShiftModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-[#3758D8] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Working Shift
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('branches')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'branches'
              ? 'bg-[#3758D8] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" /> Branches & Geofences ({branches.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'departments'
              ? 'bg-[#3758D8] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Departments ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab('shifts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'shifts'
              ? 'bg-[#3758D8] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" /> Working Shifts ({shifts.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#3758D8] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" /> Company Profile
        </button>
      </div>

      {/* TAB 1: Branches & Geofences */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {branches.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#3758D8] flex items-center justify-center font-bold">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{b.name}</h3>
                    <span className="text-xs font-mono font-semibold text-slate-400">{b.code}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleBranchStatus(b.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    b.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                  }`}
                >
                  {b.status}
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">{b.address}</p>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-blue-500" /> GPS Geofence Coordinates
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {b.latitude}° N, {b.longitude}° E
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Authorized Radius</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{b.radiusMeters} Meters</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Biometric Terminals Connected</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{b.biometricTerminals} Devices</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">
                  <strong className="text-slate-900 dark:text-white">{b.employeeCount}</strong> Employees Assigned
                </span>
                <button
                  onClick={() => handleOpenPerimeter(b)}
                  className="text-[#3758D8] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Configure Perimeter →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Departments */}
      {activeTab === 'departments' && (
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Department Name</th>
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">Department Head</th>
                  <th className="p-3.5">Staff Count</th>
                  <th className="p-3.5">Annual Budget</th>
                  <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#3758D8] flex items-center justify-center font-bold">
                        {dept.code}
                      </div>
                      {dept.name}
                    </td>
                    <td className="p-3.5 font-mono text-slate-500 font-semibold">{dept.code}</td>
                    <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">{dept.leadName}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{dept.employeeCount} Members</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ৳ {(dept.budgetBDT / 100000).toFixed(1)} Lakh
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => showAppToast(`Editing department: ${dept.name}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#3758D8] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Working Shifts */}
      {activeTab === 'shifts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {shifts.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#3758D8]">
                  {s.workingHours} Hours Duty
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Timing: <strong className="text-slate-700 dark:text-slate-200">{s.startTime} - {s.endTime}</strong>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Grace Buffer:</span>
                  <span className="font-bold text-amber-600">{s.gracePeriodMinutes} Minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Overnight Shift:</span>
                  <span className="font-bold">{s.isNightShift ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Company Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-[#1E293B] p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3758D8] to-[#06B6D4] text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-blue-500/20">
              W
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">WorkForce 360 Ltd</h2>
              <p className="text-xs text-slate-500 font-medium">Enterprise Tenant ID: ORG-WF360-2024-0001</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Corporate Tax Identification (TIN)</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">4829-1092-3847</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Business Identification Number (BIN)</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">002938472-0101</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">RJSC Company Reg</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">C-184920/2021</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Official Contact Phone</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">+880 2 988 4567</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Corporate Email</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">info@workforce360.com</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Primary Operating Currency</span>
              <p className="font-bold text-emerald-600 text-sm">BDT (৳) Bangladeshi Taka</p>
            </div>
          </div>
        </div>
      )}

      {/* Geofence Perimeter Configuration Modal */}
      {selectedBranchForPerimeter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  GPS Geofencing Settings
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedBranchForPerimeter.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBranchForPerimeter(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Radar / Perimeter Preview Simulation */}
            <div className="relative h-44 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center overflow-hidden border border-slate-800">
              <div className="absolute inset-0 bg-[radial-gradient(#3758D8_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
              {/* Concentric rings */}
              <div className="absolute w-36 h-36 rounded-full border border-emerald-500/20 animate-ping" />
              <div
                className="relative rounded-full border-2 border-emerald-400 bg-emerald-500/20 flex items-center justify-center transition-all duration-300"
                style={{ width: `${Math.min(180, Math.max(70, (tempRadius / 500) * 160))}px`, height: `${Math.min(180, Math.max(70, (tempRadius / 500) * 160))}px` }}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/80 animate-pulse" />
              </div>
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl">
                <span>Center: {tempLat}° N, {tempLng}° E</span>
                <span className="font-bold text-emerald-400">{tempRadius}m Zone Active</span>
              </div>
            </div>

            {/* Radius Slider & Controls */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Perimeter Radius Boundary: <span className="text-[#3758D8] font-black">{tempRadius} Meters</span>
                  </label>
                  <span className="text-[10px] text-slate-400">GPS Tolerance ±10m</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={tempRadius}
                  onChange={(e) => setTempRadius(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#3758D8]"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px] font-semibold">Presets:</span>
                {[50, 100, 150, 200, 300, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTempRadius(preset)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      tempRadius === preset
                        ? 'bg-[#3758D8] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {preset}m
                  </button>
                ))}
              </div>

              {/* Latitude and Longitude */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Center Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={tempLat}
                    onChange={(e) => setTempLat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Center Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={tempLng}
                    onChange={(e) => setTempLng(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedBranchForPerimeter(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePerimeter}
                className="px-5 py-2.5 rounded-xl bg-[#3758D8] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Save Geofence Perimeter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Branch */}
      {showAddBranchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Add New Office Branch</h3>
            <form onSubmit={handleAddBranch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uttara Tech Annex"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Branch Code</label>
                  <input
                    type="text"
                    placeholder="e.g. UTR-ANNEX"
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Geofence Radius (Meters)</label>
                  <input
                    type="number"
                    value={branchRadius}
                    onChange={(e) => setBranchRadius(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Full Physical Address</label>
                <input
                  type="text"
                  placeholder="Sector 3, Uttara, Dhaka-1230"
                  value={branchAddress}
                  onChange={(e) => setBranchAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddBranchModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 shadow-md cursor-pointer"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Department */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Add New Department</h3>
            <form onSubmit={handleAddDept} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Legal & Compliance"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Code</label>
                  <input
                    type="text"
                    placeholder="LGL"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Head of Department</label>
                  <input
                    type="text"
                    placeholder="Barrister Farhana"
                    value={deptLead}
                    onChange={(e) => setDeptLead(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 shadow-md cursor-pointer"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Shift */}
      {showAddShiftModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Add Working Shift</h3>
            <form onSubmit={handleAddShift} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Shift Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Support Shift"
                  value={shiftName}
                  onChange={(e) => setShiftName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={shiftStart}
                    onChange={(e) => setShiftStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">End Time</label>
                  <input
                    type="text"
                    value={shiftEnd}
                    onChange={(e) => setShiftEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Grace Period (Minutes)</label>
                <input
                  type="number"
                  value={shiftGrace}
                  onChange={(e) => setShiftGrace(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddShiftModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3758D8] text-white font-bold hover:bg-blue-600 shadow-md cursor-pointer"
                >
                  Save Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

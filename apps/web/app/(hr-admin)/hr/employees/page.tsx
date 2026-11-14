'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building,
  MapPin,
  Download,
  CreditCard,
  Printer,
  X,
  ShieldCheck,
} from 'lucide-react';
import { mock100Employees, mockTeamsList, FullEmployee } from '@/lib/employees-100';
import { EmployeeIdCardModal } from '@/components/id-card/employee-id-card-modal';

export default function HREmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<FullEmployee | null>(null);
  const [selectedEmployeeForCard, setSelectedEmployeeForCard] = useState<FullEmployee | null>(null);

  const filteredEmployees = mock100Employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || emp.teamId === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-3 py-1 rounded-full w-fit mb-2 border border-teal-200 dark:border-teal-800">
            People & Culture Operations
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Employee Directory (100 Staff across 5 Teams)
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Personnel dossiers, team allocation, and double-sided ID card generator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedEmployeeForCard(mock100Employees[0])}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#16A389] hover:bg-[#12806B] text-white text-xs font-bold transition-all shadow-lg shadow-teal-500/20"
          >
            <Printer className="w-4 h-4" /> Print ID Card
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID (e.g. WF-1042), or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border-none focus:ring-2 focus:ring-[#16A389] text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setDepartmentFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              departmentFilter === 'all'
                ? 'bg-[#16A389] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Teams ({mock100Employees.length})
          </button>

          {mockTeamsList.map((t) => (
            <button
              key={t.id}
              onClick={() => setDepartmentFilter(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                departmentFilter === t.id
                  ? 'bg-[#16A389] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {t.name.split(',')[0].split('&')[0]} ({t.memberCount})
            </button>
          ))}
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.slice(0, 30).map((emp) => (
          <div
            key={emp.id}
            className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500/20"
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{emp.name}</h3>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">{emp.designation}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{emp.employeeId} • {emp.bloodGroup}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {emp.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{emp.team}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedEmployee(emp)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={() => setSelectedEmployeeForCard(emp)}
                className="px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-600 transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Print Double-Sided ID Card"
              >
                <CreditCard className="w-4 h-4" />
                <span>ID Card</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length > 30 && (
        <div className="p-4 text-center text-xs font-semibold text-slate-500">
          Showing top 30 of {filteredEmployees.length} matching employees. Use search to locate any staff member.
        </div>
      )}

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedEmployee.name}</h3>
                  <p className="text-xs text-teal-600 font-semibold">{selectedEmployee.designation}</p>
                  <p className="text-[10px] text-slate-400">{selectedEmployee.team}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Employee ID:</span><span className="font-mono font-bold">{selectedEmployee.employeeId}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Work Email:</span><span className="font-semibold">{selectedEmployee.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="font-semibold">{selectedEmployee.phone}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Blood Group:</span><span className="font-bold text-rose-600">{selectedEmployee.bloodGroup}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Office Location:</span><span className="font-semibold">{selectedEmployee.branch}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Joined On:</span><span className="font-semibold">{selectedEmployee.joiningDate}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Emergency Contact:</span><span className="font-semibold">{selectedEmployee.emergencyContact.name} ({selectedEmployee.emergencyContact.phone})</span></div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const emp = selectedEmployee;
                  setSelectedEmployee(null);
                  setSelectedEmployeeForCard(emp);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#16A389] text-white font-bold text-xs hover:bg-teal-700 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print ID Card
              </button>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ID Card Modal */}
      <EmployeeIdCardModal
        employee={selectedEmployeeForCard}
        isOpen={!!selectedEmployeeForCard}
        onClose={() => setSelectedEmployeeForCard(null)}
      />
    </div>
  );
}

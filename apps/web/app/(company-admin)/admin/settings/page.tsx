'use client';

import React, { useState } from 'react';
import {
  Settings,
  Clock,
  Calendar,
  MapPin,
  ShieldCheck,
  CreditCard,
  Bell,
  Save,
  CheckCircle2,
  Sliders,
  Smartphone,
  Lock,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'attendance' | 'holidays' | 'leave' | 'payroll' | 'security'>('attendance');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings states
  const [standardCheckIn, setStandardCheckIn] = useState('09:00 AM');
  const [standardCheckOut, setStandardCheckOut] = useState('06:00 PM');
  const [gracePeriod, setGracePeriod] = useState(15);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');
  const [weekendRule, setWeekendRule] = useState('FRI_SAT');
  const [strictGeofence, setStrictGeofence] = useState(true);
  const [blockMockLocation, setBlockMockLocation] = useState(true);
  const [singleDeviceBinding, setSingleDeviceBinding] = useState(true);
  const [annualLeaveDays, setAnnualLeaveDays] = useState(18);
  const [sickLeaveDays, setSickLeaveDays] = useState(14);
  const [casualLeaveDays, setCasualLeaveDays] = useState(10);
  const [pfContributionPercent, setPfContributionPercent] = useState(5);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#17243B] via-[#1E3A8A] to-[#3758D8] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200 bg-white/10 px-3 py-1 rounded-full w-fit mb-2 backdrop-blur-md">
            <Settings className="w-3.5 h-3.5 text-cyan-300" /> Enterprise Policy & Remote Control Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-black">System & Policy Settings</h1>
          <p className="text-blue-100 text-sm mt-1">
            Configure working hours, Bangladesh labor compliance rules, GPS geofencing & payroll deductions.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-white text-[#3758D8] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Tenant configuration saved successfully and synced across all mobile devices & web portals!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'bg-[#3758D8] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" /> Working Hours & Geofence
        </button>
        <button
          onClick={() => setActiveTab('holidays')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'holidays'
              ? 'bg-[#3758D8] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> Weekends & Holidays
        </button>
        <button
          onClick={() => setActiveTab('leave')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'leave'
              ? 'bg-[#3758D8] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" /> Leave Quotas & Accrual
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'payroll'
              ? 'bg-[#3758D8] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Payroll & Tax Rules
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-[#3758D8] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Device Binding & Security
        </button>
      </div>

      {/* Tab 1: Attendance & Geofence */}
      {activeTab === 'attendance' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Office Hours & Grace Buffers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Standard Check-In Time</label>
                <input
                  type="text"
                  value={standardCheckIn}
                  onChange={(e) => setStandardCheckIn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Standard Check-Out Time</label>
                <input
                  type="text"
                  value={standardCheckOut}
                  onChange={(e) => setStandardCheckOut(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Late Grace Buffer (Minutes)</label>
                <input
                  type="number"
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">GPS Geofence Validation Policies</h3>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Strict Geofence Enforcement</p>
                  <p className="text-slate-500">Prohibit check-in punches when employee is outside authorized branch radius.</p>
                </div>
                <input
                  type="checkbox"
                  checked={strictGeofence}
                  onChange={(e) => setStrictGeofence(e.target.checked)}
                  className="w-5 h-5 accent-[#3758D8] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Block Mock GPS / Fake Location Apps</p>
                  <p className="text-slate-500">Detect and immediately reject location spoofing tools on Android & iOS.</p>
                </div>
                <input
                  type="checkbox"
                  checked={blockMockLocation}
                  onChange={(e) => setBlockMockLocation(e.target.checked)}
                  className="w-5 h-5 accent-[#3758D8] rounded"
                />
              </label>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Weekends & Holidays */}
      {activeTab === 'holidays' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Corporate Weekend Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <label
                onClick={() => setWeekendRule('FRI_SAT')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  weekendRule === 'FRI_SAT'
                    ? 'border-[#3758D8] bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">Friday & Saturday (2-Day Weekend)</span>
                  <input type="radio" checked={weekendRule === 'FRI_SAT'} readOnly className="accent-[#3758D8]" />
                </div>
                <p className="text-slate-500">Corporate offices, engineering and tech units in Bangladesh.</p>
              </label>

              <label
                onClick={() => setWeekendRule('FRI_ONLY')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  weekendRule === 'FRI_ONLY'
                    ? 'border-[#3758D8] bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">Friday Only (6-Day Work Week)</span>
                  <input type="radio" checked={weekendRule === 'FRI_ONLY'} readOnly className="accent-[#3758D8]" />
                </div>
                <p className="text-slate-500">Factories, logistics centers and retail branch outlets.</p>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Leave Quotas */}
      {activeTab === 'leave' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Annual Statutory Leave Entitlements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Annual Paid Leave (Days)</label>
              <input
                type="number"
                value={annualLeaveDays}
                onChange={(e) => setAnnualLeaveDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Medical / Sick Leave (Days)</label>
              <input
                type="number"
                value={sickLeaveDays}
                onChange={(e) => setSickLeaveDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Casual Leave (Days)</label>
              <input
                type="number"
                value={casualLeaveDays}
                onChange={(e) => setCasualLeaveDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Payroll & Tax */}
      {activeTab === 'payroll' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Bangladesh NBR Payroll Deductions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                Provident Fund Contribution (% of Basic)
              </label>
              <input
                type="number"
                value={pfContributionPercent}
                onChange={(e) => setPfContributionPercent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                Overtime Hourly Multiplier
              </label>
              <select
                value={overtimeMultiplier}
                onChange={(e) => setOvertimeMultiplier(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="1.5">1.5x Hourly Wage (Standard)</option>
                <option value="2.0">2.0x Hourly Wage (Holiday & Night)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Security & Device Binding */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Hardware Binding & Anti-Proxy Punches</h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Single Device Hardware Binding</p>
                <p className="text-slate-500">Bind employee account to single verified smartphone hardware UUID.</p>
              </div>
              <input
                type="checkbox"
                checked={singleDeviceBinding}
                onChange={(e) => setSingleDeviceBinding(e.target.checked)}
                className="w-5 h-5 accent-[#3758D8] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">SMS Late Punch Alerts to Managers</p>
                <p className="text-slate-500">Trigger instant automated SMS notification via Bangladesh gateway when employee is late.</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlertsEnabled}
                onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#3758D8] rounded"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

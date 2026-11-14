'use client';
import { showAppToast } from '@/components/common/toast';

import React, { useState } from 'react';
import {
  Smartphone,
  Lock,
  RotateCcw,
  RefreshCw,
  Trash2,
  Send,
  Shield,
  Wifi,
  BatteryCharging,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Radio,
  Layers,
} from 'lucide-react';
import { mockRemoteDevices } from '@/lib/mock-data';

export default function RemoteControlPage() {
  const [devices, setDevices] = useState(mockRemoteDevices);
  const [selectedDevice, setSelectedDevice] = useState(mockRemoteDevices[0]);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // System Control Toggles (Matches Image 4)
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [remoteLock, setRemoteLock] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState(false);

  // Feature Flags
  const [features, setFeatures] = useState({
    gpsGeofence: true,
    qrAttendance: true,
    leaveEngine: true,
    payrollBDT: true,
    taskBoard: true,
    mobileOfflineSync: true,
  });

  const handleDeviceAction = (deviceId: string, action: 'LOCK' | 'RESTART' | 'UPDATE' | 'WIPE') => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          if (action === 'LOCK') {
            return { ...d, status: d.status === 'Locked' ? 'Online' : 'Locked' };
          }
        }
        return d;
      })
    );
    showAppToast(`Remote Command [${action}] dispatched via Supabase Realtime to device ${deviceId}!`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
    setMessageText('');
  };

  const handleApplySystemControls = () => {
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E3A8A] text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full w-fit mb-2 border border-cyan-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Remote Management Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Remote Control & Configuration Engine</h1>
          <p className="text-slate-300 text-sm mt-1">Control Mobile Apps, Employee Devices & Global Feature Flags without store releases.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleApplySystemControls}
            className="px-5 py-2.5 rounded-xl bg-[#3758D8] text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Apply Changes
          </button>
        </div>
      </div>

      {appliedNotification && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4" /> Global Remote Configuration published and broadcasted to all mobile & web clients!
        </div>
      )}

      {/* Main Grid: Devices List & Live Preview & System Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Device List & Live Preview */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#3758D8]" /> Connected Registered Devices
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
              {devices.length} Devices Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Device / User</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Battery</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {devices.map((device) => (
                  <tr
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className={`cursor-pointer transition-colors ${
                      selectedDevice.id === device.id ? 'bg-blue-50/60 dark:bg-blue-950/40' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3">
                      <p className="font-bold text-slate-900 dark:text-white">{device.name}</p>
                      <p className="text-[11px] text-slate-400">{device.ownerName}</p>
                    </td>
                    <td className="p-3 font-medium text-slate-600 dark:text-slate-300">{device.model}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                        <BatteryCharging className="w-3.5 h-3.5" /> {device.batteryPercentage}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          device.status === 'Locked'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDeviceAction(device.id, 'LOCK')}
                          title="Lock / Unlock App"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeviceAction(device.id, 'RESTART')}
                          title="Restart App"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeviceAction(device.id, 'UPDATE')}
                          title="Force Update"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeviceAction(device.id, 'WIPE')}
                          title="Wipe Session"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Live Screen Preview & Broadcast Message Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Mock Live Screen Preview */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5 text-slate-300">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" /> Live Screen Preview
                </span>
                <span className="text-[10px] text-slate-400">{selectedDevice.model}</span>
              </div>

              <div className="w-48 h-64 mx-auto rounded-3xl bg-slate-950 border-4 border-slate-800 p-3 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between text-[9px] text-slate-400">
                  <span>09:41</span>
                  <span>5G 88%</span>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-blue-600/30 text-blue-400 font-bold mx-auto flex items-center justify-center text-xs">
                    W
                  </div>
                  <p className="text-[11px] font-bold text-white">WorkForce 360</p>
                  <p className="text-[9px] text-emerald-400">Status: {selectedDevice.status}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80 text-[10px] text-slate-300 text-center">
                  Banani HQ Geofence Active
                </div>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Push Direct Notification</h4>
                <p className="text-xs text-slate-500 mt-0.5">Send immediate broadcast message to {selectedDevice.ownerName}</p>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type administrative notice or urgent alert..."
                  rows={4}
                  className="w-full text-xs p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3758D8]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#3758D8] text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Message
                </button>
              </form>

              {messageSent && (
                <p className="text-xs text-emerald-600 font-semibold text-center animate-in fade-in">
                  ✓ Push message successfully queued!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Global System Controls & Feature Flags */}
        <div className="lg:col-span-4 space-y-6">
          {/* System Control Card (Matches Image 4) */}
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#3758D8]" /> System Control
            </h2>
            <p className="text-xs text-slate-500">Global kill-switches and maintenance triggers.</p>

            <div className="space-y-4 pt-2">
              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Maintenance Mode</h4>
                  <p className="text-[10px] text-slate-500">Puts all apps in maintenance lock</p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-5 h-5 accent-[#3758D8] rounded cursor-pointer"
                />
              </div>

              {/* Force Update */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Force Update</h4>
                  <p className="text-[10px] text-slate-500">Mandate upgrade to v2.0.0</p>
                </div>
                <input
                  type="checkbox"
                  checked={forceUpdate}
                  onChange={(e) => setForceUpdate(e.target.checked)}
                  className="w-5 h-5 accent-[#3758D8] rounded cursor-pointer"
                />
              </div>

              {/* Remote Lock */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Remote Lock</h4>
                  <p className="text-[10px] text-slate-500">Lock offline check-in bypasses</p>
                </div>
                <input
                  type="checkbox"
                  checked={remoteLock}
                  onChange={(e) => setRemoteLock(e.target.checked)}
                  className="w-5 h-5 accent-[#3758D8] rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleApplySystemControls}
              className="w-full py-2.5 rounded-xl bg-[#0F172A] text-white dark:bg-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
            >
              Apply System Changes
            </button>
          </div>

          {/* Dynamic Feature Flags */}
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" /> Dynamic Feature Flags
            </h2>
            <p className="text-xs text-slate-500">Enable or disable modules dynamically.</p>

            <div className="space-y-3 pt-2 text-xs font-medium">
              {Object.entries(features).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between py-1">
                  <span className="text-slate-700 dark:text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => setFeatures({ ...features, [key]: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

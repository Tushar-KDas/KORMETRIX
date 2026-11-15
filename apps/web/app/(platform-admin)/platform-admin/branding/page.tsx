'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Palette,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Upload,
  Eye,
  Save,
  Globe,
  Smartphone,
  Layers,
  History,
  FileCheck,
  Info,
  ExternalLink,
  Laptop,
  Check,
} from 'lucide-react';
import { showAppToast } from '@/components/common/toast';
import {
  DEFAULT_BRAND_CONFIG,
  BRAND_COLORS,
  PRODUCT_MODULES,
  BrandConfiguration,
} from '@/lib/brand-config';

interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  version: string;
  changes: string;
}

export default function PlatformAdminBrandingPage() {
  // Brand Configuration Form State
  const [config, setConfig] = useState<BrandConfiguration>(DEFAULT_BRAND_CONFIG);
  const [isSaved, setIsSaved] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'names' | 'logos' | 'icons' | 'colors' | 'publishing' | 'audit'>('overview');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      action: 'Global Rebranding to KORMETRIX',
      user: 'Super Admin (Tushar K. Das)',
      timestamp: 'Today, 01:25 PM',
      version: 'v2.1.0-KORMETRIX',
      changes: 'Updated official brand name to KORMETRIX, new geometric K monogram, midnight navy (#14243F) palette.',
    },
    {
      id: 'log-2',
      action: 'Mobile App Asset Synchronization',
      user: 'System Build Pipeline',
      timestamp: 'Today, 01:10 PM',
      version: 'v2.0.9',
      changes: 'Generated adaptive launcher mipmaps (xxxhdpi) and squircle mobile icons.',
    },
    {
      id: 'log-3',
      action: 'Initial Enterprise Configuration',
      user: 'System Root',
      timestamp: 'Yesterday, 10:00 AM',
      version: 'v2.0.0',
      changes: 'Initialized single tenant enterprise configuration for WorkForce 360 Ltd.',
    },
  ]);

  // Load configuration from localStorage on mount if saved
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kormetrix_remote_brand_config');
      if (stored) {
        setConfig(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse remote brand config:', e);
    }
  }, []);

  // Handle color change
  const handleColorChange = (key: keyof typeof config.colors, value: string) => {
    setConfig((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
    setIsSaved(false);
  };

  // Handle string field change
  const handleFieldChange = (key: keyof BrandConfiguration, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
    setIsSaved(false);
  };

  // Validate Configuration
  const handleValidate = () => {
    if (!config.name || !config.tagline || !config.colors.primary) {
      showAppToast('ব্র্যান্ড কনফিগারেশনে ত্রুটি: নাম, ট্যাগলাইন এবং প্রাইমারি রঙ খালি রাখা যাবে না।', 'error', 'ভ্যালিডেশন ব্যর্থ');
      return false;
    }
    showAppToast('KORMETRIX ব্র্যান্ড কনফিগারেশন সম্পূর্ণ ভ্যালিড ও সিঙ্কযোগ্য!', 'success', 'ভ্যালিডেশন সফল');
    return true;
  };

  // Publish Configuration
  const handlePublish = () => {
    if (!handleValidate()) return;

    try {
      localStorage.setItem('kormetrix_remote_brand_config', JSON.stringify(config));
      setIsSaved(true);

      const newLog: AuditLogEntry = {
        id: `log-${Date.now()}`,
        action: 'Remote Brand Configuration Published',
        user: 'Super Admin (Current Session)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        version: config.version,
        changes: `Published brand changes: ${config.name} (${config.tagline}).`,
      };

      setAuditLogs([newLog, ...auditLogs]);
      showAppToast(`সফলভাবে ${config.name} ব্র্যান্ড রিমোটলি পাবলিশ করা হয়েছে!`, 'success', 'পাবলিশ সম্পন্ন');
    } catch (e) {
      showAppToast('কনফিগারেশন সংরক্ষণ করা সম্ভব হয়নি।', 'error', 'ত্রুটি');
    }
  };

  // Rollback to Default KORMETRIX
  const handleRollback = () => {
    setConfig(DEFAULT_BRAND_CONFIG);
    localStorage.removeItem('kormetrix_remote_brand_config');
    setIsSaved(true);
    showAppToast('ডিফল্ট অফিসিয়াল KORMETRIX ব্র্যান্ড কনফিগারেশন রোলব্যাক করা হয়েছে।', 'info', 'রোলব্যাক সম্পন্ন');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Page Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#14243F] via-[#1E3A8A] to-[#3158D8] text-white p-6 md:p-8 rounded-3xl shadow-xl border border-blue-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Root Authority Configuration
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-[11px] font-mono font-bold">
                Version: {config.version}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              KORMETRIX Control • Global Brand Management
            </h1>
            <p className="text-blue-100/90 text-sm max-w-2xl font-medium">
              রিমোট ব্র্যান্ডিং ইঞ্জিন: ওয়েব পোর্টাল, ৫টি রোল ড্যাশবোর্ড, কালার প্যালেট, ও মোবাইল অ্যাপের সেন্ট্রালাইজড আইডেন্টিটি কন্ট্রোল।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleValidate}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-2 border border-white/20"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Validate</span>
            </button>
            <button
              onClick={handleRollback}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-2 border border-white/20"
            >
              <RotateCcw className="w-4 h-4 text-amber-300" />
              <span>Reset to Official</span>
            </button>
            <button
              onClick={handlePublish}
              className="px-5 py-2.5 rounded-xl bg-[#19B89A] hover:bg-teal-500 text-white font-black text-xs transition-all shadow-lg shadow-teal-500/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Publish Changes</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-[#19B89A]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#14243F] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-[#19B89A]" />
          <span>Section A: Brand Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('names')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'names'
              ? 'bg-[#14243F] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Section B: Identity & Names</span>
        </button>

        <button
          onClick={() => setActiveTab('logos')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'logos'
              ? 'bg-[#14243F] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Section C: Logo Assets</span>
        </button>

        <button
          onClick={() => setActiveTab('icons')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'icons'
              ? 'bg-[#14243F] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4 text-purple-400" />
          <span>Section D: App Icons</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'colors'
              ? 'bg-[#14243F] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4 text-emerald-400" />
          <span>Section E: Colors & Themes</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-[#14243F] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-4 h-4 text-rose-400" />
          <span>Section F: Audit Log & Versions</span>
        </button>
      </div>

      {/* TAB CONTENT: SECTION A - OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Platform Brand</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{config.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{config.tagline}</p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile App Identity</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#3158D8]">{config.appName}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                  Android APK
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Native Launcher: KORMETRIX</p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Color Swatch</span>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl shadow-inner border border-black/10"
                  style={{ backgroundColor: config.colors.primary }}
                />
                <div>
                  <span className="text-lg font-mono font-black text-slate-900 dark:text-white">
                    {config.colors.primary}
                  </span>
                  <p className="text-[10px] text-slate-400">Deep Midnight Navy</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accent Color Swatch</span>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl shadow-inner border border-black/10"
                  style={{ backgroundColor: config.colors.accent }}
                />
                <div>
                  <span className="text-lg font-mono font-black text-slate-900 dark:text-white">
                    {config.colors.accent}
                  </span>
                  <p className="text-[10px] text-slate-400">Vivid Cyan/Teal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Master Visual Asset Card */}
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#19B89A]" />
                  Active Master Visual Assets (Generated from Approved Reference)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vector geometric K monogram, upward human silhouette, orbital swooshes, and midnight squircle app icon.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Theme: {previewTheme === 'light' ? 'Light Preview' : 'Dark Preview'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Logo Preview */}
              <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 ${
                previewTheme === 'light' ? 'bg-[#F5F7FB] border-slate-200' : 'bg-[#101827] border-slate-800 text-white'
              }`}>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Primary Wordmark Logo</span>
                <img
                  src={previewTheme === 'light' ? '/logo.png' : '/logo-white.png'}
                  alt="KORMETRIX Logo"
                  className="h-14 object-contain max-w-[240px] drop-shadow-sm"
                />
                <span className="text-[10px] text-slate-400 font-mono">assets/branding/logo/kormetrix-logo.png</span>
              </div>

              {/* Monogram Symbol */}
              <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 ${
                previewTheme === 'light' ? 'bg-[#F5F7FB] border-slate-200' : 'bg-[#101827] border-slate-800 text-white'
              }`}>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Geometric K Monogram</span>
                <img
                  src="/kormetrix-symbol.png"
                  alt="KORMETRIX Symbol"
                  className="w-16 h-16 object-contain drop-shadow-md"
                />
                <span className="text-[10px] text-slate-400 font-mono">assets/branding/logo/kormetrix-symbol.png</span>
              </div>

              {/* Master App Icon */}
              <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 ${
                previewTheme === 'light' ? 'bg-[#F5F7FB] border-slate-200' : 'bg-[#101827] border-slate-800 text-white'
              }`}>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Squircle Mobile App Icon</span>
                <img
                  src="/icon.png"
                  alt="KORMETRIX App Icon"
                  className="w-16 h-16 rounded-2xl object-cover shadow-xl"
                />
                <span className="text-[10px] text-slate-400 font-mono">assets/branding/app-icon/app-icon-master.png</span>
              </div>
            </div>
          </div>

          {/* Product Module Breakdown */}
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Official KORMETRIX Product Family Modules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(PRODUCT_MODULES).map(([key, item]) => (
                <div key={key} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">{item.name}</span>
                    <span className="w-2 h-2 rounded-full bg-[#19B89A]" />
                  </div>
                  <p className="text-[11px] text-[#3158D8] font-bold">{item.role}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SECTION B - NAMES & IDENTITY */}
      {activeTab === 'names' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Section B: Brand Identity & Name Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure global brand names, taglines, and role-specific product suite labels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Primary Platform Brand Name
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#3158D8]"
                placeholder="KORMETRIX"
              />
              <p className="text-[10px] text-slate-400">Appears in header, title tags, emails, and platform breadcrumbs.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Brand Short Name
              </label>
              <input
                type="text"
                value={config.shortName}
                onChange={(e) => handleFieldChange('shortName', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#3158D8]"
                placeholder="KORMETRIX"
              />
              <p className="text-[10px] text-slate-400">Used in compact mobile headers and push notifications.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Official Tagline
              </label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => handleFieldChange('tagline', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#3158D8]"
                placeholder="People. Work. Performance."
              />
              <p className="text-[10px] text-slate-400">Appears under logo and in hero banners.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Mobile App Display Name (Flutter APK)
              </label>
              <input
                type="text"
                value={config.appName}
                onChange={(e) => handleFieldChange('appName', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#3158D8]"
                placeholder="Kormetrix Go"
              />
              <p className="text-[10px] text-slate-400">Label shown on Android home screen and app drawer.</p>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Product Description
              </label>
              <textarea
                rows={3}
                value={config.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#3158D8]"
                placeholder="Enterprise Workforce Management Platform."
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SECTION C - LOGO ASSETS */}
      {activeTab === 'logos' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Section C: Logo Assets Management & Remote URLs
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure URLs for primary vector/raster logos with automatic local fallback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Logo Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white">Primary Horizontal Logo</span>
                <span className="text-[10px] text-emerald-600 font-bold">Recommended: PNG / SVG</span>
              </div>
              <input
                type="text"
                value={config.assets.logo}
                onChange={(e) => {
                  setConfig((prev) => ({ ...prev, assets: { ...prev.assets, logo: e.target.value } }));
                  setIsSaved(false);
                }}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border text-xs font-mono"
              />
              <div className="h-20 bg-white dark:bg-slate-900 rounded-xl border flex items-center justify-center p-3">
                <img src={config.assets.logo} alt="Preview" className="max-h-12 object-contain" />
              </div>
            </div>

            {/* White / Dark Mode Logo Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white">White Logo for Dark Mode</span>
                <span className="text-[10px] text-blue-600 font-bold">Dark Headers</span>
              </div>
              <input
                type="text"
                value={config.assets.logoWhite}
                onChange={(e) => {
                  setConfig((prev) => ({ ...prev, assets: { ...prev.assets, logoWhite: e.target.value } }));
                  setIsSaved(false);
                }}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border text-xs font-mono"
              />
              <div className="h-20 bg-[#14243F] rounded-xl border border-slate-800 flex items-center justify-center p-3">
                <img src={config.assets.logoWhite} alt="Preview" className="max-h-12 object-contain" />
              </div>
            </div>

            {/* Symbol Monogram */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white">Geometric K Monogram</span>
                <span className="text-[10px] text-purple-600 font-bold">Favicon / Small UI</span>
              </div>
              <input
                type="text"
                value={config.assets.symbol}
                onChange={(e) => {
                  setConfig((prev) => ({ ...prev, assets: { ...prev.assets, symbol: e.target.value } }));
                  setIsSaved(false);
                }}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border text-xs font-mono"
              />
              <div className="h-20 bg-white dark:bg-slate-900 rounded-xl border flex items-center justify-center p-3">
                <img src={config.assets.symbol} alt="Preview" className="max-h-12 object-contain" />
              </div>
            </div>

            {/* Mobile Splash Logo */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white">Stacked Mobile Splash Logo</span>
                <span className="text-[10px] text-teal-600 font-bold">App Launch</span>
              </div>
              <input
                type="text"
                value="/splash-logo.png"
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border text-xs font-mono text-slate-400"
              />
              <div className="h-20 bg-[#14243F] rounded-xl border border-slate-800 flex items-center justify-center p-3">
                <img src="/splash-logo.png" alt="Preview" className="max-h-14 object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SECTION D - APP ICONS */}
      {activeTab === 'icons' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Section D: Application Icon & Launcher Management
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Master 1024×1024 high-resolution icon asset, adaptive mipmaps, and PWA manifest icons.
            </p>
          </div>

          {/* Important Native Build Notice Callout */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-amber-900 dark:text-amber-200">
                Native Binary & Mobile Launcher Icon Release Notice
              </p>
              <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                Operating systems (Android and iOS) compile the launcher icon into the native binary (<code className="font-mono font-bold">.apk</code> / <code className="font-mono font-bold">.ipa</code>). Remote brand configuration dynamically updates web favicons, PWA icons, and in-app brand headers immediately; however, the home screen launcher icon requires rebuilding the Flutter release APK using the updated mipmap densities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Master 1024×1024</span>
              <img src="/icon.png" alt="Master" className="w-20 h-20 rounded-3xl shadow-xl" />
              <span className="text-[10px] text-slate-400 font-mono">1024×1024 Master High-Res</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Android Adaptive Launcher</span>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#14243F] to-[#3158D8] p-3 shadow-xl flex items-center justify-center">
                <img src="/kormetrix-symbol.png" alt="Adaptive" className="w-12 h-12 object-contain" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">mipmap-xxxhdpi (192px)</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">PWA Manifest (512px)</span>
              <img src="/icons/icon-512.png" alt="PWA" className="w-20 h-20 rounded-2xl shadow-xl" />
              <span className="text-[10px] text-slate-400 font-mono">public/icons/icon-512.png</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Browser Favicon</span>
              <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-2xl border flex items-center justify-center shadow-xs">
                <img src="/favicon.svg" alt="Favicon" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">public/favicon.svg (48px)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SECTION E - COLORS & LIVE PREVIEW */}
      {activeTab === 'colors' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Section E: Color Management & Interactive Theme Swatches
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Modify HEX codes to customize the global theme. Changes reflect dynamically in the live preview below.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Primary Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary (#14243F)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={config.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Secondary (#3158D8)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={config.colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Accent (#19B89A)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.colors.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={config.colors.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Background Light */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Background Light</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.colors.backgroundLight}
                    onChange={(e) => handleColorChange('backgroundLight', e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={config.colors.backgroundLight}
                    onChange={(e) => handleColorChange('backgroundLight', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Background Dark */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Background Dark</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.colors.backgroundDark}
                    onChange={(e) => handleColorChange('backgroundDark', e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={config.colors.backgroundDark}
                    onChange={(e) => handleColorChange('backgroundDark', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Surface Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Surface Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.colors.surface}
                    onChange={(e) => handleColorChange('surface', e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={config.colors.surface}
                    onChange={(e) => handleColorChange('surface', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live UI Mockup Preview */}
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#3158D8]" />
                Live Interactive UI Preview (Simulation)
              </h3>
              <span className="text-xs text-slate-500 font-medium">Real-time theme rendering</span>
            </div>

            <div
              className="p-6 rounded-2xl border transition-all space-y-4"
              style={{ backgroundColor: config.colors.backgroundLight }}
            >
              {/* Header simulation */}
              <div
                className="p-4 rounded-xl flex items-center justify-between shadow-sm"
                style={{ backgroundColor: config.colors.surface }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black"
                    style={{ backgroundColor: config.colors.primary }}
                  >
                    K
                  </div>
                  <div>
                    <span className="font-black text-sm" style={{ color: config.colors.primary }}>
                      {config.name}
                    </span>
                    <p className="text-[10px] text-slate-400">{config.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                    style={{ backgroundColor: config.colors.secondary }}
                  >
                    Active Plan
                  </span>
                  <button
                    className="px-4 py-1.5 rounded-lg text-xs font-black text-white shadow-md"
                    style={{ backgroundColor: config.colors.accent }}
                  >
                    Punch In
                  </button>
                </div>
              </div>

              {/* Sample Card */}
              <div
                className="p-5 rounded-xl border shadow-xs space-y-2"
                style={{ backgroundColor: config.colors.surface }}
              >
                <h4 className="font-bold text-xs" style={{ color: config.colors.primary }}>
                  Employee Attendance Geofence Status
                </h4>
                <p className="text-xs text-slate-500">
                  Real-time geofence validation active for Banani HQ office perimeter (150m).
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white"
                    style={{ backgroundColor: config.colors.primary }}
                  >
                    {config.name} Desk
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white"
                    style={{ backgroundColor: config.colors.secondary }}
                  >
                    100% Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SECTION F - AUDIT LOGS & PUBLISHING */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Section F: Versioned Publishing & Audit History
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete audit trail of all brand identity updates, logo switches, and deployment history.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#3158D8] text-xs font-bold">
              Total Logs: {auditLogs.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Action & Title</th>
                  <th className="p-3">Triggered By</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Version</th>
                  <th className="p-3 rounded-r-xl">Changes Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{log.action}</span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">{log.user}</td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                    <td className="p-3 font-mono font-bold text-[#3158D8]">{log.version}</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{log.changes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Smartphone, Download, ExternalLink, CheckCircle2, QrCode, X } from 'lucide-react';

interface MobileAppDownloadButtonProps {
  variant?: 'header' | 'sidebar' | 'floating' | 'banner' | 'card';
  className?: string;
}

export function MobileAppDownloadButton({
  variant = 'header',
  className = '',
}: MobileAppDownloadButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const apkDirectUrl = '/Kormetrix-v2.1.0.apk';
  const gdriveUrl = 'https://drive.google.com/file/d/169QtVxLq1k56stvIEDHxGMs8f0vG42UZ/view?usp=drivesdk';

  if (variant === 'floating') {
    return (
      <>
        <div className={`fixed bottom-6 right-6 z-50 animate-bounce-subtle ${className}`}>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#17243B] to-[#3758D8] text-white font-extrabold text-xs shadow-2xl shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all border border-blue-400/30 group"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-emerald-300 uppercase tracking-wider font-mono">Mobile App Live</div>
              <div className="flex items-center gap-1.5">
                <span>Download Android APK</span>
                <Download className="w-3.5 h-3.5 text-blue-200 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {showModal && <DownloadModal onClose={() => setShowModal(false)} apkDirectUrl={apkDirectUrl} gdriveUrl={gdriveUrl} />}
      </>
    );
  }

  if (variant === 'sidebar') {
    return (
      <>
        <div className={`p-3 rounded-2xl bg-gradient-to-br from-blue-900/40 to-slate-900/60 border border-blue-500/20 text-white space-y-2.5 ${className}`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-black text-white">KORMETRIX Go</div>
              <div className="text-[9px] text-emerald-300 font-semibold">v2.0.0 (180.6 MB)</div>
            </div>
          </div>
          <p className="text-[10px] text-slate-300 leading-tight">
            Install on your Android device with live Supabase & 3D ID Cards.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download APK</span>
          </button>
        </div>

        {showModal && <DownloadModal onClose={() => setShowModal(false)} apkDirectUrl={apkDirectUrl} gdriveUrl={gdriveUrl} />}
      </>
    );
  }

  // Default: Header button
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-100 hover:shadow-md transition-all ${className}`}
        title="Download KORMETRIX Android APK"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="hidden sm:inline">Download App</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono">APK</span>
      </button>

      {showModal && <DownloadModal onClose={() => setShowModal(false)} apkDirectUrl={apkDirectUrl} gdriveUrl={gdriveUrl} />}
    </>
  );
}

function DownloadModal({
  onClose,
  apkDirectUrl,
  gdriveUrl,
}: {
  onClose: () => void;
  apkDirectUrl: string;
  gdriveUrl: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 md:p-8 space-y-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#06B6D4] text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Download Mobile App
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                KORMETRIX Go • v2.1.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Live Cloud Database Synchronized</span>
          </div>
          <p className="text-[11px] opacity-90 leading-relaxed">
            Connected to Supabase PostgreSQL with 5 independent role dashboards, 100 employees directory, and double-sided 3D ID Cards.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
            <span>Size: 180.6 MB</span>
            <span>•</span>
            <span>Target SDK: 36 (Android 8.0 - 15+)</span>
          </div>
        </div>

        {/* Download Options */}
        <div className="space-y-3">
          {/* Option 1: Direct APK Download */}
          <a
            href={apkDirectUrl}
            download="Kormetrix-v2.1.0.apk"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#10B981] hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-between shadow-lg shadow-emerald-600/25 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              <span>Direct APK Download (Local Fast)</span>
            </div>
            <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono">
              .APK
            </span>
          </a>

          {/* Option 2: Google Drive Cloud Link */}
          <a
            href={gdriveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-between border border-slate-200 dark:border-slate-700 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-blue-500" />
              <span>Open in Google Drive</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Cloud Storage
            </span>
          </a>
        </div>

        {/* Single Company Notice */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
            WorkForce 360 Ltd • Banani Corporate HQ, Dhaka
          </p>
        </div>
      </div>
    </div>
  );
}

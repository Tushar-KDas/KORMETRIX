'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export function showAppToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', title?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('wf360_toast', {
        detail: {
          id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          message,
          type,
          title,
          duration: 4000,
        },
      })
    );
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      if (customEvent.detail) {
        setToasts((prev) => [customEvent.detail, ...prev]);

        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== customEvent.detail.id));
        }, customEvent.detail.duration || 4000);
      }
    };

    window.addEventListener('wf360_toast', handler);
    return () => window.removeEventListener('wf360_toast', handler);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100';
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;

        if (toast.type === 'error') {
          bg = 'bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200';
          icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200';
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
        } else if (toast.type === 'info') {
          bg = 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200';
          icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 ${bg}`}
          >
            {icon}
            <div className="flex-1 text-xs">
              {toast.title && <p className="font-bold text-sm mb-0.5">{toast.title}</p>}
              <p className="font-semibold leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

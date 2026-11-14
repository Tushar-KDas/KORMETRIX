import type { Metadata } from 'next';
import './globals.css';
import { MobileAppDownloadButton } from '@/components/common/mobile-app-download-button';
import { ToastContainer } from '@/components/common/toast';

export const metadata: Metadata = {
  title: 'WorkForce 360 Ltd — Complete Enterprise HRMS Ecosystem',
  description: 'One Platform. Complete Workforce Control. WorkForce 360 Ltd, Banani HQ, Dhaka.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-[#F5F7FB] dark:bg-[#101827] text-slate-800 dark:text-slate-100 antialiased font-sans">
        {children}
        {/* Globally visible across all 5 panels and all pages */}
        <MobileAppDownloadButton variant="floating" />
        <ToastContainer />
      </body>
    </html>
  );
}

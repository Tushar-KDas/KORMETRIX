import type { Metadata } from 'next';
import './globals.css';
import { MobileAppDownloadButton } from '@/components/common/mobile-app-download-button';
import { ToastContainer } from '@/components/common/toast';

export const metadata: Metadata = {
  metadataBase: new URL('https://workforce360-eight.vercel.app'),
  title: 'KORMETRIX — Enterprise Workforce Management Platform',
  description: 'Manage employees, attendance, payroll, HR operations and team performance with KORMETRIX, an integrated workforce management platform.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'KORMETRIX — Enterprise Workforce Management Platform',
    description: 'People. Work. Performance. Manage employees, attendance, payroll and team performance from one unified enterprise platform.',
    siteName: 'KORMETRIX',
    images: [{ url: '/icon.png', width: 1024, height: 1024, alt: 'KORMETRIX' }],
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

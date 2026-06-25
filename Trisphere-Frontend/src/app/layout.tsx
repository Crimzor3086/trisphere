import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'TriSphere',
  description: 'Discover opportunities before they become obvious with AI-powered trend detection and verified insights.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        {children}
      </body>
    </html>
  );
}

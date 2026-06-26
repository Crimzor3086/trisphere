import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import WalletProvider from '@/components/WalletProvider';

export const metadata: Metadata = {
  title: 'TriSphere',
  description: 'Discover opportunities before they become obvious with AI-powered trend detection and verified insights.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-midnight text-foreground">
        <WalletProvider>
          <Navbar />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';
import WalletProvider from '@/components/WalletProvider';

export const metadata: Metadata = {
  title: 'TriSphere',
  description: 'Discover opportunities before they become obvious with AI-powered trend detection and verified insights.',
  icons: {
    icon: '/Favico.ico',
    shortcut: '/Favico.ico',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'TriSphere',
    description: 'Discover opportunities before they become obvious with AI-powered trend detection and verified insights.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-midnight text-foreground">
        <WalletProvider>
          <AppShell>{children}</AppShell>
        </WalletProvider>
      </body>
    </html>
  );
}

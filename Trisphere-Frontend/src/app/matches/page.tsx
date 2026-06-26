'use client';

import dynamic from 'next/dynamic';
import '@/integrations/boardy/index.css';

const BoardyApp = dynamic(() => import('@/integrations/boardy/BoardyApp'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-muted">
      Loading Boardy matchmaking…
    </div>
  ),
});

export default function MatchesPage() {
  return (
    <main className="min-h-screen bg-midnight text-foreground">
      <div className="boardy-integration mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <header className="mb-6 space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-accent">ConnectSphere</p>
          <h1 className="text-3xl font-semibold text-white">AI matchmaking intelligence hub</h1>
          <p className="max-w-3xl text-muted">
            Voice-first professional matchmaking connected to trends, hidden champions, registry trust, and strategic opportunity profiles.
          </p>
        </header>
        <BoardyApp />
      </div>
    </main>
  );
}

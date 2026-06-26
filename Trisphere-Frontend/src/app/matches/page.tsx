'use client';

import dynamic from 'next/dynamic';
import '@/integrations/boardy/index.css';

const BoardyApp = dynamic(() => import('@/integrations/boardy/BoardyApp'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
      Loading Boardy matchmaking…
    </div>
  ),
});

export default function MatchesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="boardy-integration mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <header className="mb-6 space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Boardy.ai</p>
          <h1 className="text-3xl font-semibold text-white">AI Matchmaking Hub</h1>
          <p className="max-w-3xl text-slate-400">
            Voice-first professional matchmaking — connect wallet, set your need/offer profile, and discover strategic matches.
          </p>
        </header>
        <BoardyApp />
      </div>
    </main>
  );
}

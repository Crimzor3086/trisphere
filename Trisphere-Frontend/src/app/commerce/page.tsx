'use client';

import Link from 'next/link';
import CommerceEscrowPanel from '@/components/CommerceEscrowPanel';
import { getTriSphereContracts } from '@/lib/contracts';
import { snowtraceAddress } from '@/lib/chains';

const journey = [
  { step: 1, title: 'Detect opportunity', href: '/trends' as const, detail: 'AI surfaces emerging supply-chain trends.' },
  { step: 2, title: 'Verify on Avalanche', href: '/champions' as const, detail: 'TrendRegistry & KHCRegistry proofs on Fuji.' },
  { step: 3, title: 'Connect participants', href: '/matches' as const, detail: 'Boardy match staking unlocks collaboration.' },
  { step: 4, title: 'Settle with USDC', href: '/commerce' as const, detail: 'PaymentEscrow locks funds until delivery.' },
  { step: 5, title: 'Build reputation', href: '/rewards' as const, detail: 'TriSphereReputation updates after settlement.' },
] as const;

export default function CommercePage() {
  const c = getTriSphereContracts();

  return (
    <main className="min-h-screen bg-midnight text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-highlight/80">Avalanche business infrastructure</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Opportunity commerce network</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            TriSphere settles real business transactions on Avalanche — USDC escrow, AVAX milestones, verification registries, and portable reputation. Every interaction reduces friction or improves trust.
          </p>
        </header>

        <section className="mb-12 grid gap-4 lg:grid-cols-5">
          {journey.map((item) => (
            <Link
              key={item.step}
              href={item.href}
              className="rounded-2xl border border-border/70 bg-card/60 p-4 transition hover:border-highlight/40 hover:bg-card/90"
            >
              <p className="text-xs text-highlight">Step {item.step}</p>
              <p className="mt-1 font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-xs leading-5 text-muted">{item.detail}</p>
            </Link>
          ))}
        </section>

        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'PaymentEscrow', addr: c.paymentEscrow },
            { label: 'Treasury', addr: c.treasury },
            { label: 'Reputation', addr: c.reputation },
            { label: 'Mock USDC', addr: c.mockUsdc },
          ].map(({ label, addr }) => (
            <div key={label} className="rounded-2xl border border-border/60 bg-card/50 p-4 text-sm">
              <p className="text-muted">{label}</p>
              {addr ? (
                <a href={snowtraceAddress(addr)} target="_blank" rel="noreferrer" className="mt-1 block truncate text-primary hover:text-white">
                  {addr}
                </a>
              ) : (
                <p className="mt-1 text-amber-400/90">Deploy commerce layer</p>
              )}
            </div>
          ))}
        </section>

        <div id="escrow">
          <CommerceEscrowPanel />
        </div>
      </div>
    </main>
  );
}

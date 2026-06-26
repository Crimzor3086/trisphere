'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import TrendCard from '@/components/TrendCard';
import LiveFeedCard from '@/components/LiveFeedCard';
import PersonaSelector from '@/components/PersonaSelector';
import VerificationPanel from '@/components/VerificationPanel';
import DailyBriefCard from '@/components/DailyBriefCard';
import WatchlistCard from '@/components/WatchlistCard';
import AlertsCard from '@/components/AlertsCard';
import Counter from '@/components/Counter';

const liveFeed = [
  {
    title: 'AI Interns Replacing Junior Analysts',
    velocity: '+87%',
    confidence: 91,
    type: 'Trend',
  },
  {
    title: 'Manufacturing Firm — Eldoret',
    championScore: 89,
    type: 'Hidden Champion',
  },
  {
    title: 'Investor ↔ Climate Startup',
    matchStrength: 94,
    type: 'Match Opportunity',
  },
];

const trends = [
  {
    title: 'East African Logistics Surge',
    velocity: 76,
    category: 'Logistics',
    opportunity: 88,
    firstSeen: '2h ago',
    verified: true,
  },
  {
    title: 'AI-Driven Climate Financing',
    velocity: 69,
    category: 'Climate',
    opportunity: 82,
    firstSeen: '5h ago',
    verified: true,
  },
  {
    title: 'Creator-Led Commerce Networks',
    velocity: 54,
    category: 'Creator Economy',
    opportunity: 74,
    firstSeen: '1d ago',
    verified: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-midnight text-foreground">
      <section className="relative overflow-hidden px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-midnight-glow" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-12">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-border/80 bg-card/80 px-4 py-2 text-sm text-primary">
                Live intelligence for the next wave
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Discover opportunities before they become obvious.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/80">
                AI-powered trend detection, hidden champion discovery, and strategic matchmaking built for founders, investors, creators, and operators.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#live-feed" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-foreground transition hover:bg-primary/90">
                Explore Live Intelligence
              </a>
              <button className="mi-btn-ghost px-6 py-3 text-base font-semibold">
                Connect Wallet
              </button>
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-surface/70 p-8 shadow-glow backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_30%)]" />
              <div className="relative flex flex-col gap-10">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-primary/80">TrendSphere — live dashboard</p>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-3xl font-semibold text-white">Real-time signal pulse</p>
                      <p className="mt-2 max-w-xl text-muted">Live trends, hidden champions, and match suggestions updating every second.</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-midnight/90 px-4 py-2 text-sm text-foreground/80 shadow-lg shadow-black/30">
                      <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-secondary" />
                      <span>Live now</span>
                    </div>
                  </div>
                </div>

<div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-border/70 bg-midnight/80 p-6 shadow-xl shadow-black/30">
                      <p className="text-sm uppercase tracking-[0.28em] text-muted">Signals Today</p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-5xl font-semibold text-white"
                      >
                        <Counter value={42} />
                      </motion.p>
                      <p className="mt-2 text-sm text-muted">New verified insights since dawn.</p>
                    </div>
                    <div className="rounded-3xl border border-border/70 bg-midnight/80 p-6 shadow-xl shadow-black/30">
                      <p className="text-sm uppercase tracking-[0.28em] text-muted">Opportunity Score</p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="mt-4 text-5xl font-semibold text-white"
                      >
                        <Counter value={91} />
                      </motion.p>
                      <p className="mt-2 text-sm text-muted">Score weighted by velocity, relevance, and verification.</p>
                    </div>
                  </div>

<div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-border/70 bg-midnight/80 p-5 text-sm text-foreground/80">
                      <p className="font-semibold text-white">Trends</p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-3 text-3xl font-semibold text-highlight"
                      >
                        <Counter value={16} />
                      </motion.p>
                      <p className="mt-2 text-muted">Emerging now</p>
                    </div>
                    <div className="rounded-3xl border border-border/70 bg-midnight/80 p-5 text-sm text-foreground/80">
                      <p className="font-semibold text-white">Champions</p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="mt-3 text-3xl font-semibold text-secondary"
                      >
                        <Counter value={7} />
                      </motion.p>
                      <p className="mt-2 text-muted">Verified hidden champions</p>
                    </div>
                    <div className="rounded-3xl border border-border/70 bg-midnight/80 p-5 text-sm text-foreground/80">
                      <p className="font-semibold text-white">Matches</p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-3 text-3xl font-semibold text-accent"
                      >
                        <Counter value={23} />
                      </motion.p>
                      <p className="mt-2 text-muted">AI recommended connections</p>
                    </div>
                  </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-midnight/80 p-6 shadow-glow shadow-black/30 backdrop-blur-xl">
              <div className="mb-6 rounded-3xl border border-border/60 bg-card/80 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-primary/80">Personalize your experience</p>
                <p className="mt-3 text-lg text-foreground/80">Choose the role that best describes you to tailor the dashboard and recommendations.</p>
              </div>
              <PersonaSelector />
            </div>
          </div>
        </div>
      </section>

      <section id="live-feed" className="space-y-8 border-t border-border/80 px-6 pb-24 pt-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-primary/80">Live Intelligence Feed</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Bloomberg meets Product Hunt.</h2>
            </div>
            <div className="rounded-full border border-border/80 bg-midnight/80 px-4 py-2 text-sm text-foreground/80">
              Real-time insights updated every few seconds
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {liveFeed.map((item) => (
              <LiveFeedCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/80 px-6 pb-24 pt-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: 'What is TriSphere?',
                description: 'A premium intelligence platform that surfaces high-value trends, hidden champions, and strategic matches before the market notices.',
              },
              {
                title: 'Why it matters',
                description: 'Move faster with AI-curated signals, verification that builds trust, and a discovery engine tuned for your role.',
              },
              {
                title: 'What can you do now?',
                description: 'Explore live trends, discover verified companies, and ask the AI copilot for tailored next steps.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-border/80 bg-card/90 p-8 shadow-xl shadow-black/30">
                <p className="text-sm uppercase tracking-[0.35em] text-primary/80">{item.title}</p>
                <p className="mt-4 text-lg leading-8 text-foreground/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/80 px-6 pb-24 pt-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <DailyBriefCard />
            <WatchlistCard />
            <AlertsCard />
          </div>
        </div>
      </section>

      <section className="border-t border-border/80 px-6 pb-24 pt-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <VerificationPanel />
        </div>
      </section>

      <section className="border-t border-border/80 px-6 pb-24 pt-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 rounded-3xl border border-border/80 bg-card/80 p-8 shadow-xl shadow-black/30 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-primary/80">How to get started</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Begin your first intelligence sprint.</h2>
              <p className="mt-4 max-w-2xl text-foreground/80">Connect your wallet, pick your role, and jump into the live feed to uncover trends and matches that align with your thesis.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-primary/90">Explore Live Intelligence</button>
                <button className="rounded-full border border-border px-6 py-3 text-sm text-foreground/90 transition hover:border-primary">Open AI Copilot</button>
              </div>
            </div>
            <div className="rounded-3xl border border-border/80 bg-midnight/70 p-6 text-foreground/80">
              <p className="text-sm uppercase tracking-[0.35em] text-muted">Role first personalization</p>
              <ul className="mt-6 space-y-3 text-sm leading-7">
                <li>Founder: launch faster with founder-ready trend briefs.</li>
                <li>Investor: identify emerging sectors and fundraising signals.</li>
                <li>Creator: uncover viral topics and content hooks.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/80 px-6 pb-24 pt-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card/80 p-8 shadow-xl shadow-black/30 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-primary/80">Never lead with blockchain</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Trust, transparency, verification.</h2>
              <p className="mt-3 max-w-2xl text-muted">Avalanche is the foundation for immutable attribution, not the headline. We surface the confidence, not the token.</p>
            </div>
            <div className="rounded-3xl bg-midnight/80 px-6 py-4 text-sm text-foreground/80">
              Verified on Avalanche with simple language and clear hashes.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

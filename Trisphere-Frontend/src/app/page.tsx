'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import Link from 'next/link';
import ActionButton from '@/components/ActionButton';
import Counter from '@/components/Counter';

const metrics = [
  { label: 'Emerging Trends', value: 128, change: '+18%', accent: 'text-primary', note: '12 accelerating this week' },
  { label: 'Hidden Champions', value: 42, change: '+7', accent: 'text-secondary', note: 'Verified across 9 sectors' },
  { label: 'Active Matches', value: 316, change: '+24%', accent: 'text-accent', note: 'Founder, investor, operator graph' },
  { label: 'Registry Records', value: 905, change: '99.2%', accent: 'text-registry', note: 'Confidence-weighted attestations' },
];

const signals = [
  { name: 'Climate logistics', score: 92, color: 'bg-primary' },
  { name: 'AI procurement', score: 86, color: 'bg-copilot' },
  { name: 'Specialty manufacturing', score: 81, color: 'bg-secondary' },
  { name: 'Creator commerce rails', score: 73, color: 'bg-accent' },
];

const opportunities = [
  ['East African cold-chain surge', 'TrendSphere', 'High velocity signal linked to 6 verified operators.', '91'],
  ['Eldoret precision fabrication', 'ChampionSphere', 'Underrated exporter with strong resilience indicators.', '89'],
  ['Climate fintech x logistics match', 'ConnectSphere', 'Investor thesis overlaps with 4 emerging-market founders.', '94'],
  ['Registry confidence anomaly', 'Avalanche Registry', 'New contributor hash confirms prior field research.', '87'],
];

const registry = [
  ['Eldoret Manufacturing Works', 'Verified', '0x82A4...19F2', 'Fuji', '96%'],
  ['Lagos Cold Hub', 'Verified', '0x71C9...B3E0', 'Fuji', '93%'],
  ['Nairobi Fleet AI', 'Review', '0x32AE...90D1', 'Fuji', '84%'],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-midnight px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[20px] border border-border/70 bg-surface/80 p-6 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-8"
        >
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mi-label text-copilot">Opportunity Intelligence Network</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                One intelligence graph for trends, champions, matches, and verified opportunity signals.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted sm:text-lg">
                TriSphere transforms fragmented market signals into actionable opportunities for founders, investors, creators,
                researchers, governments, and enterprises.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[
                ['TrendSphere', 'Emerging trends', 'border-primary/40 bg-primary/10 text-primary'],
                ['ChampionSphere', 'Hidden champions', 'border-secondary/40 bg-secondary/10 text-secondary'],
                ['ConnectSphere', 'AI matchmaking', 'border-accent/40 bg-accent/10 text-accent'],
              ].map(([name, label, classes]) => (
                <div key={name} className={`rounded-[20px] border p-4 ${classes}`}>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="mt-1 text-sm opacity-90">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.article
              key={metric.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              className="rounded-[20px] border border-border/70 bg-card/80 p-6 shadow-xl shadow-black/20 transition hover:border-primary/40 hover:shadow-glow"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-muted">{metric.label}</p>
                <span className={`rounded-xl bg-surface px-2.5 py-1 text-xs font-semibold ${metric.accent}`}>{metric.change}</span>
              </div>
              <p className={`mt-5 font-mono text-4xl font-semibold tabular-nums ${metric.accent}`}>
                <Counter value={metric.value} />
              </p>
              <p className="mt-3 text-sm text-muted">{metric.note}</p>
            </motion.article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <Panel title="Trending Signals" kicker="Live velocity">
            <div className="space-y-5">
              {signals.map((signal) => (
                <div key={signal.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-foreground">{signal.name}</span>
                    <span className="font-mono text-muted">{signal.score}</span>
                  </div>
                  <div className="h-2 rounded-full bg-midnight">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${signal.score}%` }}
                      transition={{ duration: 0.9 }}
                      className={`h-full rounded-full ${signal.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-md border border-border/50 bg-surface"
                  style={{ opacity: 0.35 + ((index * 17) % 60) / 100 }}
                />
              ))}
            </div>
          </Panel>

          <Panel title="AI Daily Brief" kicker="Embedded analyst">
            <div className="rounded-[18px] border border-copilot/25 bg-copilot/10 p-5">
              <p className="text-sm leading-7 text-foreground/90">
                Logistics, climate finance, and specialty manufacturing are converging into a near-term opportunity window.
                Prioritize verified operators with export signals and strong founder reachability.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Generate report', 'Find sources', 'Create watchlist'].map((action) => (
                <Link
                  key={action}
                  href={action === 'Generate report' ? '/copilot' : action === 'Find sources' ? '/insights' : '/profile'}
                  className="rounded-xl border border-border/80 bg-surface px-3 py-2 text-sm text-foreground transition hover:border-copilot"
                >
                  {action}
                </Link>
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <Panel title="Opportunity Feed" kicker="Actionable intelligence">
            <div className="space-y-3">
              {opportunities.map(([title, source, detail, score]) => (
                <article key={title} className="rounded-[18px] border border-border/70 bg-surface/70 p-4 transition hover:-translate-y-1 hover:border-primary/40">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{title}</p>
                      <p className="mt-1 text-sm text-muted">{detail}</p>
                    </div>
                    <span className="rounded-xl bg-card px-3 py-2 font-mono text-sm text-white">{score}</span>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-muted">{source}</p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Hidden Champion Spotlight" kicker="ChampionSphere">
            <div className="rounded-[18px] border border-secondary/25 bg-secondary/10 p-5">
              <p className="text-xl font-semibold text-white">Eldoret Manufacturing Works</p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Export-capable fabrication company with strong hiring, procurement, and customer concentration signals.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                {[
                  ['Score', '89'],
                  ['Confidence', '96%'],
                  ['Signals', '18'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-midnight/70 p-3">
                    <p className="text-muted">{label}</p>
                    <p className="mt-1 font-mono text-lg text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <Panel title="Suggested Connections" kicker="ConnectSphere">
            <div className="space-y-3">
              {['Climate infrastructure fund', 'Regional logistics operator', 'AI procurement founder'].map((name, index) => (
                <div key={name} className="flex items-center justify-between rounded-[18px] border border-border/70 bg-surface/70 p-4">
                  <div>
                    <p className="font-medium text-white">{name}</p>
                    <p className="text-sm text-muted">{92 - index * 4}% match strength</p>
                  </div>
                  <ActionButton action="Review" doneLabel="Queued" className="rounded-xl bg-accent/15 px-3 py-2 text-accent" />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Recent Registry Activity" kicker="Trust infrastructure">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.18em] text-muted">
                  <tr>
                    <th className="pb-3 font-medium">Record</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Hash</th>
                    <th className="pb-3 font-medium">Network</th>
                    <th className="pb-3 text-right font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {registry.map(([record, status, hash, network, confidence]) => (
                    <tr key={hash}>
                      <td className="py-3 text-white">{record}</td>
                      <td className="py-3">
                        <span className="rounded-lg bg-success/10 px-2 py-1 text-xs text-success">{status}</span>
                      </td>
                      <td className="py-3 font-mono text-muted">{hash}</td>
                      <td className="py-3 text-muted">{network}</td>
                      <td className="py-3 text-right font-mono text-white">{confidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Panel({ title, kicker, children }: { title: string; kicker: string; children: ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-[20px] border border-border/70 bg-card/80 p-6 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">{kicker}</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
        </div>
      </div>
      {children}
    </motion.article>
  );
}

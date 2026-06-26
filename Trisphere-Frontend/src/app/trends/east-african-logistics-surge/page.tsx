'use client';

import { motion } from 'framer-motion';
import VerificationPanel from '@/components/VerificationPanel';

const trend = {
  title: 'East African Logistics Surge',
  velocity: 76,
  category: 'Logistics',
  opportunity: 88,
  firstSeen: '2h ago',
  verified: true,
  summary: 'Micro-distribution networks are scaling across Kenya, Nigeria, and South Africa, leveraging mobile money integration and cross-border digitization to solve last-mile challenges.',
  tam: '$4.2B',
  growthRate: '+32% YoY',
};

export default function TrendDetailPage() {
  return (
    <main className="min-h-screen bg-midnight text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary">Verified</span>
              <span className="text-sm text-muted">{trend.firstSeen}</span>
            </div>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">{trend.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-foreground/80">{trend.summary}</p>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-black/30">
              <p className="text-sm uppercase tracking-[0.3em] text-muted">Velocity</p>
              <p className="mt-3 text-4xl font-semibold text-primary">{trend.velocity}%</p>
            </div>
            <div className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-black/30">
              <p className="text-sm uppercase tracking-[0.3em] text-muted">Opportunity</p>
              <p className="mt-3 text-4xl font-semibold text-white">{trend.opportunity}</p>
            </div>
            <div className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-black/30">
              <p className="text-sm uppercase tracking-[0.3em] text-muted">Category</p>
              <p className="mt-3 text-4xl font-semibold text-white">{trend.category}</p>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Why It Matters</h2>
            <p className="text-foreground/80 leading-relaxed">
              The logistics revolution in East Africa is driven by mobile-first infrastructure, cross-border payment rails, and a rising middle class demanding faster delivery. Companies that solve cold chain, route optimization, and last-mile distribution are positioned for rapid scale.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Market Opportunity</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border/80 bg-card/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-muted">Potential TAM</p>
                <p className="mt-3 text-3xl font-semibold text-primary">{trend.tam}</p>
              </div>
              <div className="rounded-3xl border border-border/80 bg-card/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-muted">Growth Rate</p>
                <p className="mt-3 text-3xl font-semibold text-secondary">{trend.growthRate}</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Founder Insights</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Tech Stack', description: 'Mobile-first, offline-capable, USSD integration' },
                { title: 'Capital Needed', description: '$250K-2M for regional expansion' },
                { title: 'Green Field', description: 'No dominant regional player yet' },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-border/80 bg-card/80 p-5">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Creator Toolkit</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                { title: 'Hook', content: 'Africa is building the world\'s most innovative logistics networks.' },
                { title: 'Script', content: 'How mobile money is enabling a logistics revolution across the continent.' },
                { title: 'Video Idea', content: 'Day-in-the-life: Kenya\'s micro-distribution heroes.' },
              ].map((tool) => (
                <div key={tool.title} className="rounded-3xl border border-border/80 bg-midnight/80 p-5 shadow-xl shadow-black/30">
                  <p className="text-sm uppercase tracking-[0.3em] text-primary/80">{tool.title}</p>
                  <p className="mt-3 text-foreground/90">{tool.content}</p>
                </div>
              ))}
            </div>
          </section>

          <VerificationPanel />
        </motion.div>
      </div>
    </main>
  );
}

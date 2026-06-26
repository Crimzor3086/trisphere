'use client';

import { motion } from 'framer-motion';

const insights = [
  {
    title: 'Logistics Momentum in East Africa',
    sector: 'Logistics',
    signal: 'high',
    excerpt: 'Micro-distribution networks are expanding 3x faster than traditional models.',
    time: '2h ago',
  },
  {
    title: 'Climate Investment Patterns',
    sector: 'Climate',
    signal: 'medium',
    excerpt: 'Pre-seed rounds in carbon accounting tools are increasing 42% quarter-over-quarter.',
    time: '4h ago',
  },
  {
    title: 'Creator Commerce Convergence',
    sector: 'Creator Economy',
    signal: 'rising',
    excerpt: 'TikTok creators are driving $12M+ in direct commerce sales monthly.',
    time: '1d ago',
  },
];

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-midnight text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-primary/80">Insights</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Your strategic intelligence hub.</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">A contextual feed of verified signals, sector trends, and curated analysis to help you stay ahead.</p>
        </header>

        <div className="space-y-6">
          {insights.map((insight, index) => (
            <InsightCard key={insight.title} insight={insight} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}

function InsightCard({ insight, index }: { insight: typeof insights[0]; index: number }) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.article
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.01, x: 4 }}
      className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-black/30 backdrop-blur-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex rounded-full bg-surface/70 px-3 py-1 text-sm text-foreground/80">{insight.sector}</span>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            insight.signal === 'high' ? 'bg-secondary/10 text-secondary' :
            insight.signal === 'rising' ? 'bg-primary/10 text-primary' :
            'bg-highlight/10 text-highlight'
          }`}>
            {insight.signal}
          </span>
        </div>
        <span className="text-sm text-muted">{insight.time}</span>
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">{insight.title}</h2>
      <p className="mt-3 text-foreground/80">{insight.excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="rounded-full border border-border/80 px-4 py-2 text-sm text-foreground/90 transition hover:border-primary">Save</button>
        <button className="rounded-full border border-border/80 px-4 py-2 text-sm text-foreground/90 transition hover:border-primary">Share</button>
      </div>
    </motion.article>
  );
}

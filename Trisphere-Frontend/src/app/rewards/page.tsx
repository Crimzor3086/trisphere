'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const badges = [
  { name: 'Trend Scout', count: 0, color: 'sky' },
  { name: 'Champion Hunter', count: 0, color: 'blue' },
  { name: 'Connector', count: 0, color: 'emerald' },
  { name: 'Validator', count: 0, color: 'amber' },
];

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-midnight text-foreground">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-primary/80">Rewards</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Earn reputation for discovery.</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">Track your Trend Scout, Champion Hunter, Connector, and Validator achievements across the platform.</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="rounded-3xl border border-border/80 bg-card/80 p-6 text-center shadow-xl shadow-black/30"
            >
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-${badge.color}-500/10 text-${badge.color}-300 text-2xl`}>
                {badge.name.charAt(0)}
              </div>
              <p className="font-semibold text-white">{badge.name}</p>
              <p className="mt-2 text-sm text-muted">Earned {badge.count} times</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

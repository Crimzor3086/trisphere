'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-midnight text-foreground">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-primary/80">Profile</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Your TriSphere identity.</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">Manage your role, watchlists, alerts, and verification status in one place.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-black/30"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/15 text-3xl font-semibold text-primary">TS</div>
              <p className="mt-4 font-semibold text-white">Connected Wallet</p>
              <p className="mt-1 font-mono text-sm text-muted">0x7a3b...c1d2</p>
              <button className="mt-4 rounded-full border border-border/80 bg-midnight/80 px-4 py-2 text-sm text-foreground/80 transition hover:border-primary">
                Disconnect
              </button>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-black/30"
            >
              <p className="text-sm uppercase tracking-[0.35em] text-muted">Current Role</p>
              <p className="mt-3 text-2xl font-semibold text-white">Founder</p>
              <button className="mt-4 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary transition hover:bg-primary/20">
                Change role
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-black/30"
            >
              <p className="text-sm uppercase tracking-[0.35em] text-muted">Reputation</p>
              <p className="mt-3 text-2xl font-semibold text-white">0 points</p>
              <p className="mt-2 text-sm text-muted">Complete actions to earn badges and increase trust.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

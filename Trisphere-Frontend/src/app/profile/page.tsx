'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Profile</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Your TriSphere identity.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-400">Manage your role, watchlists, alerts, and verification status in one place.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-500/15 text-3xl font-semibold text-sky-300">TS</div>
              <p className="mt-4 font-semibold text-white">Connected Wallet</p>
              <p className="mt-1 font-mono text-sm text-slate-400">0x7a3b...c1d2</p>
              <button className="mt-4 rounded-full border border-slate-800/80 bg-slate-950/80 px-4 py-2 text-sm text-slate-300 transition hover:border-sky-400">
                Disconnect
              </button>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20"
            >
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Current Role</p>
              <p className="mt-3 text-2xl font-semibold text-white">Founder</p>
              <button className="mt-4 rounded-full bg-sky-500/10 px-4 py-2 text-sm text-sky-300 transition hover:bg-sky-500/20">
                Change role
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20"
            >
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Reputation</p>
              <p className="mt-3 text-2xl font-semibold text-white">0 points</p>
              <p className="mt-2 text-sm text-slate-400">Complete actions to earn badges and increase trust.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

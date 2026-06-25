'use client';

import { motion } from 'framer-motion';

export default function VerificationPanel() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Avalanche verification</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Trusted, immutable verification without the blockchain noise.</h2>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Verified. Immutable. Attributed.</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Trend hash', value: '0x7a3b...c1d2' },
          { label: 'Champion hash', value: '0x9f4e...b7a8' },
          { label: 'Match hash', value: '0xc2d9...f3b1' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 text-sm text-slate-300"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
            <p className="mt-3 font-mono text-white">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

'use client';

import { motion } from 'framer-motion';

export default function WatchlistCard() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-3xl border border-slate-800/80 bg-slate-950/85 p-8 shadow-xl shadow-slate-950/20"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Watchlist</p>
          <h3 className="mt-4 text-3xl font-semibold text-white">Follow the signals that matter.</h3>
        </div>
        <span className="rounded-full bg-slate-800/80 px-4 py-2 text-sm text-slate-300">4 active lists</span>
      </div>

      <div className="mt-8 space-y-4">
        {[
          { label: 'Industries', value: 'Logistics, Climate, Fintech' },
          { label: 'Countries', value: 'Kenya, Nigeria, South Africa' },
          { label: 'Keywords', value: 'cold chain, founder-led, green growth' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 text-slate-300"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
            <p className="mt-3 text-base text-white">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.article>
  );
}

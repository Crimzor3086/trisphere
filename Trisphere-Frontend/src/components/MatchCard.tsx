'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface Match {
  participants: string;
  sector: string;
  alignment: number;
  reasons: string[];
}

export default function MatchCard({ match }: { match: Match }) {
  const alignmentCount = useMotionValue(0);
  const displayAlignment = useTransform(alignmentCount, (latest) => Math.round(latest));

  useEffect(() => {
    animate(alignmentCount, match.alignment, { duration: 1, delay: 0.1, ease: 'easeOut' });
  }, [match.alignment, alignmentCount]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-3xl border border-slate-800/80 bg-slate-950/85 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
        <span className="inline-flex rounded-full bg-slate-900/70 px-3 py-1">{match.sector}</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-sky-300">
          {displayAlignment}%
        </span>
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-white">{match.participants}</h3>
      <div className="mt-4 space-y-2 text-slate-300">
        {match.reasons.map((reason) => (
          <p key={reason}>• {reason}</p>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Request Intro</button>
        <button className="rounded-full border border-slate-800/80 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400">Save Match</button>
      </div>
    </motion.article>
  );
}

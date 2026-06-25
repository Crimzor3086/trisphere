'use client';

import { motion, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Champion {
  name: string;
  industry: string;
  location: string;
  score: number;
  description: string;
}

export default function ChampionCard({ champion }: { champion: Champion }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const controls = animate(0, champion.score, {
      duration: 1,
      delay: 0.1,
      ease: 'easeOut',
      onUpdate: (value) => setDisplayScore(Math.round(value)),
    });
    return () => controls.stop();
  }, [champion.score]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-3xl border border-slate-800/80 bg-slate-950/85 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
        <span className="inline-flex rounded-full bg-slate-900/70 px-3 py-1">{champion.industry}</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-blue-300">
          Champion {displayScore}
        </span>
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-white">{champion.name}</h3>
      <p className="mt-4 text-slate-300">{champion.description}</p>
      <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
        <span>{champion.location}</span>
        <Link
          href="/champions/eldoret-manufacturing"
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          View profile
        </Link>
      </div>
    </motion.article>
  );
}

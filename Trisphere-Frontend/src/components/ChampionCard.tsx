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
      className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-xl shadow-black/30 backdrop-blur-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 text-sm text-muted">
        <span className="inline-flex rounded-full bg-surface/70 px-3 py-1">{champion.industry}</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-secondary">
          Champion {displayScore}
        </span>
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-white">{champion.name}</h3>
      <p className="mt-4 text-foreground/80">{champion.description}</p>
      <div className="mt-6 flex items-center justify-between text-sm text-muted">
        <span>{champion.location}</span>
        <Link
          href="/champions/eldoret-manufacturing"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-primary/90"
        >
          View profile
        </Link>
      </div>
    </motion.article>
  );
}

'use client';

import { motion, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Match {
  participants: string;
  sector: string;
  alignment: number;
  reasons: string[];
}

export default function MatchCard({ match }: { match: Match }) {
  const [displayAlignment, setDisplayAlignment] = useState(0);

  useEffect(() => {
    const controls = animate(0, match.alignment, {
      duration: 1,
      delay: 0.1,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayAlignment(Math.round(v)),
    });
    return () => controls.stop();
  }, [match.alignment]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-xl shadow-black/30 backdrop-blur-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 text-sm text-muted">
        <span className="inline-flex rounded-full bg-surface/70 px-3 py-1">{match.sector}</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-accent">
          {displayAlignment}%
        </span>
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-white">{match.participants}</h3>
      <div className="mt-4 space-y-2 text-foreground/80">
        {match.reasons.map((reason) => (
          <p key={reason}>• {reason}</p>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-primary/90">
          Request Intro
        </button>
        <button className="rounded-full border border-border/80 px-4 py-2 text-sm text-foreground/90 transition hover:border-primary">
          Save Match
        </button>
      </div>
    </motion.article>
  );
}

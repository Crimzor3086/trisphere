'use client';

import { motion, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LiveFeedItem {
  title: string;
  velocity?: string;
  confidence?: number;
  championScore?: number;
  matchStrength?: number;
  type: string;
}

export default function LiveFeedCard({ item }: { item: LiveFeedItem }) {
  const [displayVelocity, setDisplayVelocity] = useState('0%');
  const [displayConfidence, setDisplayConfidence] = useState('0%');
  const [displayChampion, setDisplayChampion] = useState(0);
  const [displayMatch, setDisplayMatch] = useState('0%');

  useEffect(() => {
    const stops: Array<() => void> = [];
    if (item.velocity) {
      const num = parseInt(item.velocity);
      const controls = animate(0, num, {
        duration: 1.2,
        ease: 'easeOut',
        onUpdate: (v) => setDisplayVelocity(`${Math.round(v)}%`),
      });
      stops.push(() => controls.stop());
    }
    if (item.confidence) {
      const controls = animate(0, item.confidence, {
        duration: 1.2,
        ease: 'easeOut',
        onUpdate: (v) => setDisplayConfidence(`${Math.round(v)}%`),
      });
      stops.push(() => controls.stop());
    }
    if (item.championScore) {
      const controls = animate(0, item.championScore, {
        duration: 1.2,
        ease: 'easeOut',
        onUpdate: (v) => setDisplayChampion(Math.round(v)),
      });
      stops.push(() => controls.stop());
    }
    if (item.matchStrength) {
      const controls = animate(0, item.matchStrength, {
        duration: 1.2,
        ease: 'easeOut',
        onUpdate: (v) => setDisplayMatch(`${Math.round(v)}%`),
      });
      stops.push(() => controls.stop());
    }
    return () => stops.forEach((stop) => stop());
  }, [item]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-6 shadow-xl shadow-black/30 backdrop-blur-xl"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
      />
      <div className="relative flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.35em] text-primary/80">{item.type}</p>
        <div className="flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1 text-xs text-muted">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-secondary" />
          Live
        </div>
      </div>
      <h3 className="relative mt-6 text-xl font-semibold text-white">{item.title}</h3>
      <div className="relative mt-5 space-y-3 text-foreground/80">
        {item.velocity ? (
          <p>
            Velocity: <span className="font-semibold text-white">{displayVelocity}</span>
          </p>
        ) : null}
        {item.confidence ? (
          <p>
            Confidence: <span className="font-semibold text-white">{displayConfidence}</span>
          </p>
        ) : null}
        {item.championScore ? (
          <p>
            Champion Score: <span className="font-semibold text-white">{displayChampion}</span>
          </p>
        ) : null}
        {item.matchStrength ? (
          <p>
            Match Strength: <span className="font-semibold text-white">{displayMatch}</span>
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}

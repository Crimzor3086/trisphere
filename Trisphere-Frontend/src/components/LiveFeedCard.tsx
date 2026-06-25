'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';

interface LiveFeedItem {
  title: string;
  velocity?: string;
  confidence?: number;
  championScore?: number;
  matchStrength?: number;
  type: string;
}

export default function LiveFeedCard({ item }: { item: LiveFeedItem }) {
  const velocityCount = useMotionValue(0);
  const confidenceCount = useMotionValue(0);
  const championCount = useMotionValue(0);
  const matchCount = useMotionValue(0);

  const displayVelocity = useTransform(velocityCount, (latest) => `${Math.round(latest)}%`);
  const displayConfidence = useTransform(confidenceCount, (latest) => `${Math.round(latest)}%`);
  const displayChampion = useTransform(championCount, (latest) => Math.round(latest));
  const displayMatch = useTransform(matchCount, (latest) => `${Math.round(latest)}%`);

  useEffect(() => {
    if (item.velocity) {
      const num = parseInt(item.velocity);
      animate(velocityCount, num, { duration: 1.2, ease: 'easeOut' });
    }
    if (item.confidence) {
      animate(confidenceCount, item.confidence, { duration: 1.2, ease: 'easeOut' });
    }
    if (item.championScore) {
      animate(championCount, item.championScore, { duration: 1.2, ease: 'easeOut' });
    }
    if (item.matchStrength) {
      animate(matchCount, item.matchStrength, { duration: 1.2, ease: 'easeOut' });
    }
  }, [item, velocityCount, confidenceCount, championCount, matchCount]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-3xl border border-slate-800/80 bg-slate-950/85 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0"
      />
      <div className="relative flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">{item.type}</p>
        <div className="rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-400 flex items-center gap-1.5">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>
      <h3 className="relative mt-6 text-xl font-semibold text-white">{item.title}</h3>
      <div className="relative mt-5 space-y-3 text-slate-300">
        {item.velocity ? (
          <p>Velocity: <span className="font-semibold text-white">{displayVelocity}</span></p>
        ) : null}
        {item.confidence ? (
          <p>Confidence: <span className="font-semibold text-white">{displayConfidence}</span></p>
        ) : null}
        {item.championScore ? (
          <p>Champion Score: <span className="font-semibold text-white">{displayChampion}</span></p>
        ) : null}
        {item.matchStrength ? (
          <p>Match Strength: <span className="font-semibold text-white">{displayMatch}</span></p>
        ) : null}
      </div>
    </motion.article>
  );
}

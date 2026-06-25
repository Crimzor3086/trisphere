'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';

interface Trend {
  title: string;
  velocity: number;
  category: string;
  opportunity: number;
  firstSeen: string;
  verified: boolean;
}

export default function TrendCard({ trend }: { trend: Trend }) {
  const velocityCount = useMotionValue(0);
  const opportunityCount = useMotionValue(0);

  const displayVelocity = useTransform(velocityCount, (latest) => `${Math.round(latest)}%`);
  const displayOpportunity = useTransform(opportunityCount, (latest) => Math.round(latest));

  useEffect(() => {
    animate(velocityCount, trend.velocity, { duration: 1, delay: 0.2, ease: 'easeOut' });
    animate(opportunityCount, trend.opportunity, { duration: 1, delay: 0.3, ease: 'easeOut' });
  }, [trend.velocity, trend.opportunity, velocityCount, opportunityCount]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-3xl border border-slate-800/80 bg-slate-950/85 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
        <span className="inline-flex rounded-full bg-slate-900/70 px-3 py-1">{trend.category}</span>
        {trend.verified ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/70 px-3 py-1">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-500" />
            Unverified
          </span>
        )}
      </div>

      <h3 className="mt-6 text-2xl font-semibold text-white">{trend.title}</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Velocity</p>
          <p className="mt-3 text-3xl font-semibold text-sky-300">{displayVelocity}</p>
        </div>
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Opportunity</p>
          <p className="mt-3 text-3xl font-semibold text-white">{displayOpportunity}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        <span>First seen {trend.firstSeen}</span>
        <Link
          href={`/trends/east-african-logistics-surge`}
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          View Brief
        </Link>
      </div>
    </motion.article>
  );
}

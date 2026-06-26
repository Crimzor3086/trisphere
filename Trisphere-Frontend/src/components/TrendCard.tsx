'use client';

import { motion, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
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
  const [displayVelocity, setDisplayVelocity] = useState('0%');
  const [displayOpportunity, setDisplayOpportunity] = useState(0);

  useEffect(() => {
    const velocityControls = animate(0, trend.velocity, {
      duration: 1,
      delay: 0.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayVelocity(`${Math.round(v)}%`),
    });
    const opportunityControls = animate(0, trend.opportunity, {
      duration: 1,
      delay: 0.3,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayOpportunity(Math.round(v)),
    });
    return () => {
      velocityControls.stop();
      opportunityControls.stop();
    };
  }, [trend.velocity, trend.opportunity]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-xl shadow-black/30 backdrop-blur-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 text-sm text-muted">
        <span className="inline-flex rounded-full bg-surface/70 px-3 py-1">{trend.category}</span>
        {trend.verified ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-secondary">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-secondary" />
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-card/70 px-3 py-1">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-muted" />
            Unverified
          </span>
        )}
      </div>

      <h3 className="mt-6 text-2xl font-semibold text-white">{trend.title}</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-border/80 bg-card/80 p-4 text-sm text-foreground/80">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Velocity</p>
          <p className="mt-3 text-3xl font-semibold text-primary">{displayVelocity}</p>
        </div>
        <div className="rounded-3xl border border-border/80 bg-card/80 p-4 text-sm text-foreground/80">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Opportunity</p>
          <p className="mt-3 text-3xl font-semibold text-white">{displayOpportunity}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <span>First seen {trend.firstSeen}</span>
        <Link
          href="/trends"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-primary/90"
        >
          Open workspace
        </Link>
      </div>
    </motion.article>
  );
}

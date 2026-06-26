'use client';

import { motion } from 'framer-motion';

export default function DailyBriefCard() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-3xl border border-border/80 bg-card/90 p-8 shadow-xl shadow-black/30"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-primary/80">Daily Intelligence Brief</p>
          <h3 className="mt-4 text-3xl font-semibold text-white">Start your day with the top signals.</h3>
        </div>
        <motion.span
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary"
        >
          3 new trends
        </motion.span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { title: '2 Hidden Champions', description: 'Fresh discovery with acceleration signals.' },
          { title: '1 Strategic Match', description: 'High-probability connection aligned to your thesis.' },
          { title: 'Alert: Logistics Spike', description: 'East Africa logistics momentum is accelerating fast.' },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-3xl border border-border/80 bg-card/80 p-5 text-foreground/80"
          >
            <p className="font-semibold text-white">{item.title}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.article>
  );
}

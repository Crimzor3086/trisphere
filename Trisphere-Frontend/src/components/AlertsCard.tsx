'use client';

import { motion } from 'framer-motion';

export default function AlertsCard() {
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
          <p className="text-sm uppercase tracking-[0.35em] text-primary/80">Alerts</p>
          <h3 className="mt-4 text-3xl font-semibold text-white">Stay ahead with real-time notifications.</h3>
        </div>
        <span className="rounded-full bg-card px-4 py-2 text-sm text-foreground/80">3 active alerts</span>
      </div>

      <div className="mt-8 space-y-4 text-foreground/80">
        {[
          { title: 'New trend spike', detail: 'East African logistics activity jumped 87% in the last hour.' },
          { title: 'Champion discovered', detail: 'A Lagos supply chain startup entered the hidden champions list.' },
          { title: 'Match found', detail: 'High-fit investor connection detected for climate founders.' },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-3xl border border-border/80 bg-card/80 p-5"
          >
            <p className="font-semibold text-white">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
          </motion.div>
        ))}
      </div>
    </motion.article>
  );
}

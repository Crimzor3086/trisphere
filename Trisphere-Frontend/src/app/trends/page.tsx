import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import TrendCard from '@/components/TrendCard';

const trendData = [
  {
    title: 'East African Logistics Surge',
    velocity: 76,
    category: 'Logistics',
    opportunity: 88,
    firstSeen: '2h ago',
    verified: true,
  },
  {
    title: 'Creator-Led Commerce Networks',
    velocity: 54,
    category: 'Creator Economy',
    opportunity: 74,
    firstSeen: '1d ago',
    verified: false,
  },
  {
    title: 'Renewable Grid Fintech',
    velocity: 82,
    category: 'Climate',
    opportunity: 91,
    firstSeen: '4h ago',
    verified: true,
  },
];

export default function TrendsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Trend Dashboard</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Trend discovery built for immediate action.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-400">Explore verified signals, compare opportunity scores, and surface the trends that matter before everyone else.</p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Filters</p>
                <p className="mt-2 text-sm text-slate-400">Refine the discovery pipeline by category, speed, and verification.</p>
              </div>
              <button className="rounded-full border border-slate-700/80 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400">Edit</button>
            </div>

            <div className="space-y-3">
              {['All', 'Logistics', 'Climate', 'Creator Economy', 'Fintech'].map((chip) => (
                <button key={chip} className="w-full rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-sky-400">
                  {chip}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Signals Today', value: '42' },
                { label: 'Emerging Trends', value: '16' },
                { label: 'Verified Trends', value: '11' },
              ].map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 text-slate-200 shadow-xl shadow-slate-950/20">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{metric.label}</p>
                  <p className="mt-4 text-4xl font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {trendData.map((trend) => (
                <TrendCard key={trend.title} trend={trend} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

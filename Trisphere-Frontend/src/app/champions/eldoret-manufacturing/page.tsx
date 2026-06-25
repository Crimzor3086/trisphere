'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import VerificationPanel from '@/components/VerificationPanel';

const company = {
  name: 'Eldoret Manufacturing',
  industry: 'Advanced Manufacturing',
  location: 'Eldoret, Kenya',
  score: 89,
  description: 'Scaling precision manufacturing for renewable energy components. Privately held with 120 employees and growing.',
  founded: '2018',
  employees: '120',
  revenue: '$12M ARR',
};

export default function CompanyProfilePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">Champion {company.score}</span>
              <span className="text-sm text-slate-500">• {company.industry}</span>
            </div>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">{company.name}</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">{company.description}</p>
          </header>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Location</p>
              <p className="mt-3 text-2xl font-semibold text-white">{company.location}</p>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Founded</p>
              <p className="mt-3 text-2xl font-semibold text-white">{company.founded}</p>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Size</p>
              <p className="mt-3 text-2xl font-semibold text-white">{company.employees}</p>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Market Position</h2>
            <p className="text-slate-300 leading-relaxed">
              Eldoret Manufacturing has captured 12% of Kenya\'s renewable energy component market with a focus on solar panel frames and mounting systems. Their proximity to raw materials and engineering talent provides significant cost advantages.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Growth Indicators</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Revenue', value: company.revenue, change: '+67% YoY' },
                { label: 'Partnerships', value: '12', change: '+3 this quarter' },
                { label: 'Momentum', value: 'High', change: 'Accelerating' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-xs text-emerald-300">{item.change}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Partnership Opportunities</h2>
            <div className="space-y-4">
              {[
                { sector: 'Climate Investment', description: 'Seeking Series A for solar component expansion' },
                { sector: 'Supply Chain', description: 'Looking for raw material sourcing partners' },
                { sector: 'Distribution', description: 'Needs pan-African logistics network' },
              ].map((opp) => (
                <div key={opp.sector} className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5">
                  <p className="font-semibold text-white">{opp.sector}</p>
                  <p className="mt-2 text-sm text-slate-400">{opp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Suggested Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Request Intro</button>
              <button className="rounded-full border border-slate-800 px-6 py-3 text-sm text-slate-200 transition hover:border-sky-400">Save to Watchlist</button>
              <button className="rounded-full border border-slate-800 px-6 py-3 text-sm text-slate-200 transition hover:border-sky-400">Share Signal</button>
            </div>
          </section>

          <VerificationPanel />
        </motion.div>
      </div>
    </main>
  );
}
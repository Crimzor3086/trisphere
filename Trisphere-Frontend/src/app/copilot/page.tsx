'use client';

import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const sampleResponses = [
  {
    role: 'assistant',
    message: 'Emerging East African logistics trends are centered on micro-distribution, cold chain automation, and cross-border freight digitization.',
  },
  {
    role: 'assistant',
    message: 'Hidden champions include a Nairobi-based fleet optimization startup and a Lagos last-mile hub building strategic partnerships.',
  },
  {
    role: 'assistant',
    message: 'Suggested actions: connect with logistics founders, evaluate climate investors, and prepare a brief on regional regulatory themes.',
  },
];

export default function CopilotPage() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('What opportunities are emerging in East African logistics?');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState(sampleResponses);

  const response = useMemo(() => {
    if (!responses.length) return null;
    return responses.map((item, index) => (
      <motion.div
        key={`${item.role}-${index}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 text-slate-200 shadow-xl shadow-slate-950/20"
      >
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{item.role}</p>
        <p className="mt-4 text-lg leading-8 text-slate-100">{item.message}</p>
      </motion.div>
    ));
  }, [responses]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSubmitted(query.trim());
    setResponses([]);

    window.setTimeout(() => {
      setResponses(sampleResponses);
      setLoading(false);
    }, 900);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">AI Copilot</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Ask for the intelligence you need and get focused next steps.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-400">Your daily strategy assistant for trends, champions, matches, and Avalanche verification.</p>
        </header>

        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Ask the Copilot</p>
              <p className="mt-2 text-slate-400">Type a question and receive a curated intelligence summary instantly.</p>
            </div>
            <div className="rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300">Streaming responses, no wait.</div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(query || submitted);
            }}
            className="mt-6 flex flex-col gap-4 sm:flex-row"
          >
            <label className="sr-only" htmlFor="copilot-query">
              Copilot query
            </label>
            <input
              id="copilot-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What opportunities are emerging in East African logistics?"
              className="min-w-0 flex-1 rounded-3xl border border-slate-800/80 bg-slate-950/90 px-5 py-4 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
            <button type="submit" className="rounded-3xl bg-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Analyze
            </button>
          </form>

          <div className="mt-8 space-y-5">
            {loading ? (
              [1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item * 0.05 }}
                  className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20"
                >
                  <div className="h-4 w-32 rounded-full bg-slate-800/80" />
                  <div className="mt-5 space-y-3">
                    <div className="h-4 w-full rounded-full bg-slate-800/80" />
                    <div className="h-4 w-5/6 rounded-full bg-slate-800/80" />
                    <div className="h-4 w-4/6 rounded-full bg-slate-800/80" />
                  </div>
                </motion.div>
              ))
            ) : (
              response
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

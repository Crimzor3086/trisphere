'use client';

import { useMemo, useState } from 'react';
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
        className="rounded-3xl border border-border/80 bg-card/80 p-6 text-foreground/90 shadow-xl shadow-black/30"
      >
        <p className="text-sm uppercase tracking-[0.35em] text-muted">{item.role}</p>
        <p className="mt-4 text-lg leading-8 text-foreground">{item.message}</p>
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
    <main className="min-h-screen bg-midnight text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-copilot">AI Copilot</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Embedded analyst for the opportunity graph.</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">Ask across trends, champions, matches, registry records, reports, and source trails without leaving the workspace.</p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="rounded-[20px] border border-border/80 bg-card/80 p-6 shadow-xl shadow-black/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-muted">Ask the Copilot</p>
              <p className="mt-2 text-muted">Type a question and receive a curated intelligence summary with next actions.</p>
            </div>
            <div className="rounded-2xl bg-copilot/10 px-4 py-2 text-sm text-copilot">Streaming analyst mode</div>
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
              className="min-w-0 flex-1 rounded-3xl border border-border/80 bg-midnight/90 px-5 py-4 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button type="submit" className="rounded-3xl bg-copilot px-6 py-4 text-sm font-semibold text-midnight transition hover:bg-copilot/90">
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
                  className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-black/30"
                >
                  <div className="h-4 w-32 rounded-full bg-card" />
                  <div className="mt-5 space-y-3">
                    <div className="h-4 w-full rounded-full bg-card" />
                    <div className="h-4 w-5/6 rounded-full bg-card" />
                    <div className="h-4 w-4/6 rounded-full bg-card" />
                  </div>
                </motion.div>
              ))
            ) : (
              response
            )}
          </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[20px] border border-border/80 bg-card/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-muted">Suggested prompts</p>
              <div className="mt-4 space-y-3">
                {[
                  'Show verified companies linked to climate logistics.',
                  'Draft an investor brief from this week signals.',
                  'Which matches should I prioritize today?',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setQuery(prompt)}
                    className="w-full rounded-2xl border border-border/70 bg-surface/70 p-3 text-left text-sm text-foreground transition hover:border-copilot"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-[20px] border border-border/80 bg-card/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-muted">Related entities</p>
              <div className="mt-4 space-y-3 text-sm">
                {['East African Logistics Surge', 'Eldoret Manufacturing Works', 'Climate infrastructure fund'].map((entity) => (
                  <div key={entity} className="rounded-2xl bg-surface/70 p-3 text-foreground/90">{entity}</div>
                ))}
              </div>
            </div>
            <div className="rounded-[20px] border border-registry/30 bg-registry/10 p-6">
              <p className="text-sm font-semibold text-white">Sources attached</p>
              <p className="mt-2 text-sm leading-6 text-muted">Registry records, backend discovery notes, live trend feed, and match staking events.</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

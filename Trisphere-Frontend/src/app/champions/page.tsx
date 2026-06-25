import Link from 'next/link';
import { fetchDiscover, fetchRegistry, getKhcPipelineUrl } from '@/lib/api/khc';

function fmt(n: number) {
  return new Intl.NumberFormat('en-KE').format(n);
}

export default async function ChampionsPage() {
  const [discoverRes, registryRes] = await Promise.all([fetchDiscover(), fetchRegistry()]);
  const items = discoverRes.items;
  const registry = registryRes.items;

  const discoveredCount = items.length;
  const hiddenChampionsCount = items.filter((x) => x.score !== null && (x.score as number) >= 80).length;
  const foundersContacted = 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">ChampionSphere · KHC-DE</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Discover hidden champions across emerging markets.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-400">
            Live data from the Kenya Hidden Champions backend — discover, score, profile, and verify private companies.
          </p>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href="/champions/discover" className="text-sky-300 hover:text-white">
              Discover
            </Link>
            <Link href="/champions/registry" className="text-sky-300 hover:text-white">
              Registry
            </Link>
          </nav>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Businesses discovered', value: discoveredCount },
            { label: 'Hidden champions', value: hiddenChampionsCount },
            { label: 'Founders contacted', value: foundersContacted },
          ].map((metric) => (
            <div key={metric.label} className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{metric.label}</p>
              <p className="mt-4 text-4xl font-semibold text-white">{fmt(metric.value)}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6">
          <h2 className="font-semibold text-white">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/champions/discover"
              className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Start discovery
            </Link>
            <form action={getKhcPipelineUrl()} method="post">
              <button
                type="submit"
                className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400"
              >
                Run pipeline
              </button>
            </form>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6">
            <h2 className="font-semibold text-white">Verified registry</h2>
            <p className="mt-2 text-sm text-slate-400">Public verification layer (hash-only).</p>
            <p className="mt-3 text-3xl font-semibold text-white">{fmt(registry.length)}</p>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6">
            <h2 className="font-semibold text-white">Next steps</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-400">
              <li>Use Discover to review candidates</li>
              <li>Open a profile for evidence-safe markdown</li>
              <li>Check Registry for verified hashes</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

import Navbar from '@/components/Navbar';
import ChampionCard from '@/components/ChampionCard';

const champions = [
  {
    name: 'Eldoret Manufacturing',
    industry: 'Advanced Manufacturing',
    location: 'Kenya',
    score: 89,
    description: 'Scaling precision manufacturing for renewable energy components.',
  },
  {
    name: 'Nairobi AgriTech',
    industry: 'AgriTech',
    location: 'Kenya',
    score: 85,
    description: 'AI-enabled supply chain optimization for smallholder farms.',
  },
  {
    name: 'Lagos Logistics',
    industry: 'Logistics',
    location: 'Nigeria',
    score: 92,
    description: 'Micro-distribution network unlocking last-mile delivery efficiency.',
  },
];

export default function ChampionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">ChampionSphere</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Discover hidden champions across emerging markets.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-400">Search by industry, region, revenue band, and verified momentum to identify the most promising private companies before the market does.</p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Explorer filters</p>
            <div className="mt-6 space-y-3">
              {['Industry', 'Country', 'Revenue band', 'Champion score'].map((filter) => (
                <button key={filter} className="w-full rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-sky-400">
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Explored companies', value: '128' },
                { label: 'Verified signals', value: '34' },
                { label: 'Regional hotspots', value: '5' },
              ].map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 text-slate-200 shadow-xl shadow-slate-950/20">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{metric.label}</p>
                  <p className="mt-4 text-4xl font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {champions.map((champion) => (
                <ChampionCard key={champion.name} champion={champion} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

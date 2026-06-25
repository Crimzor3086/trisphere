import Navbar from '@/components/Navbar';
import MatchCard from '@/components/MatchCard';

const matches = [
  {
    participants: 'Founder ↔ Investor',
    sector: 'Climate',
    alignment: 93,
    reasons: ['Sector overlap', 'Investment thesis', 'Regional fit'],
  },
  {
    participants: 'Creator ↔ Brand',
    sector: 'Consumer',
    alignment: 88,
    reasons: ['Audience match', 'Content momentum', 'Campaign synergy'],
  },
  {
    participants: 'Operator ↔ Supply Chain',
    sector: 'Logistics',
    alignment: 90,
    reasons: ['Network access', 'Execution capability', 'Market timing'],
  },
];

export default function MatchesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">AI Matchmaking Hub</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Connect with opportunities built for your thesis.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-400">Explore AI-recommended matches and move from signal to intro with confidence.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {matches.map((match) => (
            <MatchCard key={match.participants} match={match} />
          ))}
        </div>
      </div>
    </main>
  );
}

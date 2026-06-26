import Link from 'next/link';
import KhcBackendBanner from '@/components/KhcBackendBanner';
import { fetchDiscover, type DiscoverItem, KhcBackendError } from '@/lib/api/khc';

function scoreLabel(item: DiscoverItem) {
  if (item.score === null) return 'No score';
  if (item.score >= 90) return 'Exceptional';
  if (item.score >= 80) return 'Hidden Champion';
  if (item.score >= 70) return 'Emerging';
  if (item.score >= 60) return 'Watchlist';
  return 'Rejected';
}

export default async function ChampionsDiscoverPage() {
  let items: DiscoverItem[] = [];
  let backendError: string | null = null;

  try {
    const res = await fetchDiscover();
    items = res.items;
  } catch (error) {
    backendError = error instanceof KhcBackendError ? error.message : 'Failed to load discover data.';
  }

  return (
    <main className="min-h-screen bg-midnight text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-8 space-y-3">
          <Link href="/champions" className="text-sm text-primary hover:text-white">
            ← Champions
          </Link>
          <h1 className="text-3xl font-semibold text-white">Discover</h1>
          <p className="text-muted">Company, sector, location, and champion score from the KHC backend.</p>
        </header>

        {backendError ? <KhcBackendBanner message={backendError} /> : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 500).map((item) => (
            <Link
              key={item.id}
              href={`/champions/profile/${encodeURIComponent(item.id)}`}
              className="rounded-2xl border border-border/80 bg-card/80 p-5 transition hover:border-primary/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{item.company_name || '(unknown)'}</div>
                  <div className="mt-1 text-sm text-muted">{item.sector || '(unknown)'}</div>
                  <div className="mt-1 text-sm text-muted">{item.location || '(unknown)'}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-primary">
                    {item.score === null ? '—' : `${item.score}/100`}
                  </div>
                  <div className="mt-1 text-xs text-muted">{scoreLabel(item)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!backendError && items.length === 0 && (
          <p className="mt-6 text-sm text-muted">No candidates yet. Run the pipeline from the Champions home page.</p>
        )}

        {items.length > 500 && (
          <p className="mt-4 text-sm text-muted">Showing first 500 of {items.length}.</p>
        )}
      </div>
    </main>
  );
}

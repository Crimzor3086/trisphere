import Link from "next/link";
import { fetchDiscover, type DiscoverItem } from "@/lib/api";

function scoreLabel(item: DiscoverItem) {
  if (item.score === null) return "No score";
  if (item.score >= 90) return "Exceptional";
  if (item.score >= 80) return "Hidden Champion";
  if (item.score >= 70) return "Emerging";
  if (item.score >= 60) return "Watchlist";
  return "Rejected";
}

export default async function DiscoverPage() {
  const res = await fetchDiscover();
  const items = res.items;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="font-semibold">KHC-DE</div>
          <nav className="flex gap-4 text-sm">
            <Link className="hover:underline" href="/">Home</Link>
            <Link className="hover:underline" href="/registry">Registry</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Discover</h1>
        <p className="mt-2 text-sm text-zinc-600">Cards: Company, Sector, Location, Score.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.slice(0, 500).map((item) => (
            <Link
              key={item.id}
              className="rounded-xl border bg-white p-4 hover:bg-zinc-50"
              href={`/profile/${encodeURIComponent(item.id)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{item.company_name || "(unknown)"}</div>
                  <div className="mt-1 text-sm text-zinc-600">{item.sector || "(unknown)"}</div>
                  <div className="mt-1 text-sm text-zinc-600">{item.location || "(unknown)"}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{item.score === null ? "—" : `${item.score}/100`}</div>
                  <div className="mt-1 text-xs text-zinc-500">{scoreLabel(item)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {items.length > 500 && (
          <div className="mt-4 text-sm text-zinc-500">Showing first 500 of {items.length}.</div>
        )}
      </main>
    </div>
  );
}


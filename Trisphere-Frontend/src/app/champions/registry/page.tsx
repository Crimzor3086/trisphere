import Link from 'next/link';
import KhcBackendBanner from '@/components/KhcBackendBanner';
import { fetchRegistry, type RegistryItem, KhcBackendError } from '@/lib/api/khc';

function formatDate(ts: string) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

export default async function ChampionsRegistryPage() {
  let items: RegistryItem[] = [];
  let backendError: string | null = null;

  try {
    const res = await fetchRegistry();
    items = res.items;
  } catch (error) {
    backendError = error instanceof KhcBackendError ? error.message : 'Failed to load registry data.';
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-8 space-y-3">
          <Link href="/champions" className="text-sm text-sky-300 hover:text-white">
            ← Champions
          </Link>
          <h1 className="text-3xl font-semibold text-white">Registry</h1>
          <p className="text-slate-400">Verified entries from the KHC on-chain registry (hash-only public layer).</p>
        </header>

        {backendError ? <KhcBackendBanner message={backendError} /> : null}

        <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/80">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 500).map((it, idx) => (
                <tr key={`${it.profile_hash}-${idx}`} className="border-t border-slate-800/80">
                  <td className="px-4 py-3 font-medium text-white">{it.company}</td>
                  <td className="px-4 py-3 text-slate-400">{it.sector}</td>
                  <td className="px-4 py-3">
                    {it.validation_status === 'Qualified' ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">
                        Qualified
                      </span>
                    ) : it.validation_status === 'Rejected' ? (
                      <span className="rounded-full bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300">
                        Rejected
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-300">
                        Needs Validation
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(it.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!backendError && items.length === 0 && (
          <p className="mt-6 text-sm text-slate-400">No verified entries yet. Run the pipeline from the Champions home page.</p>
        )}
      </div>
    </main>
  );
}

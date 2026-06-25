import Link from "next/link";
import { fetchRegistry, type RegistryItem } from "@/lib/api";

function formatDate(ts: string) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

export default async function RegistryPage() {
  const res = await fetchRegistry();
  const items: RegistryItem[] = res.items;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="font-semibold">KHC-DE</div>
          <nav className="flex gap-4 text-sm">
            <Link className="hover:underline" href="/">Home</Link>
            <Link className="hover:underline" href="/discover">Discover</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Registry</h1>
        <p className="mt-2 text-sm text-zinc-600">Verified (public verification layer). No full data stored.</p>

        <div className="mt-6 overflow-hidden rounded-xl border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Date</th>

              </tr>
            </thead>
            <tbody>
              {items.slice(0, 500).map((it, idx) => (
                <tr key={`${it.profile_hash}-${idx}`} className="border-t">
                  <td className="px-4 py-3 font-medium">{it.company}</td>
                  <td className="px-4 py-3 text-zinc-600">{it.sector}</td>
                  <td className="px-4 py-3">
                    {it.validation_status === "Qualified" ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">Qualified</span>
                    ) : it.validation_status === "Rejected" ? (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">Rejected</span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Needs Validation</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-zinc-600">{formatDate(it.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="mt-6 text-sm text-zinc-600">No verified entries yet. Run POST /api/pipeline/run.</div>
        )}
      </main>
    </div>
  );
}


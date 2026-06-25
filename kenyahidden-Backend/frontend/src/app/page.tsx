import Link from "next/link";
import { fetchDiscover, fetchRegistry, type DiscoverItem, type RegistryItem } from "@/lib/api";

function fmt(n: number) {
  return new Intl.NumberFormat("en-KE").format(n);
}

export default async function Home() {
  const [discoverRes, registryRes] = await Promise.all([fetchDiscover(), fetchRegistry()]);
  const items: DiscoverItem[] = discoverRes.items;
  const registry: RegistryItem[] = registryRes.items;

  const discoveredCount = items.length;
  const hiddenChampionsCount = items.filter((x) => x.score !== null && (x.score as number) >= 80).length;

  // Outreach not wired yet; keep it truthful.
  const foundersContacted = 0;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="font-semibold">KHC-DE</div>
          <nav className="flex gap-4 text-sm">
            <Link className="hover:underline" href="/discover">Discover</Link>
            <Link className="hover:underline" href="/registry">Registry</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Hidden Champions Discovery Engine</h1>
        <p className="mt-2 text-sm text-zinc-600">Discover → Research → Score → Profile → Verify</p>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-zinc-600">Businesses discovered</div>
            <div className="mt-2 text-3xl font-semibold">{fmt(discoveredCount)}</div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-zinc-600">Hidden champions</div>
            <div className="mt-2 text-3xl font-semibold">{fmt(hiddenChampionsCount)}</div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <div className="text-sm text-zinc-600">Founders contacted</div>
            <div className="mt-2 text-3xl font-semibold">{fmt(foundersContacted)}</div>
          </div>
        </section>

        <section className="mt-8 rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Quick actions</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800" href="/discover">
              Start discovery
            </Link>
            <form
              action={"/api/pipeline/run"}
              method="post"
              className="flex"
            >
              <button
                formAction={"http://localhost:3000/api/pipeline/run"}
                type="submit"
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm hover:bg-zinc-50"
              >
                Run pipeline
              </button>
            </form>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-4">
            <h2 className="font-semibold">Verified registry</h2>
            <p className="mt-2 text-sm text-zinc-600">Public verification layer (hash-only).</p>
            <div className="mt-3 text-2xl font-semibold">{fmt(registry.length)}</div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <h2 className="font-semibold">Next steps</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700">
              <li>Use /discover to review candidates</li>
              <li>Open a /profile/[id] for evidence-safe markdown</li>
              <li>Use /registry to see verified hashes</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}


import Link from "next/link";
import { fetchProfile } from "@/lib/api";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const data = await fetchProfile(params.id);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="font-semibold">KHC-DE</div>
          <nav className="flex gap-4 text-sm">
            <Link className="hover:underline" href="/">Home</Link>
            <Link className="hover:underline" href="/discover">Discover</Link>
            <Link className="hover:underline" href="/registry">Registry</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Business Profile</h1>
        <p className="mt-2 text-sm text-zinc-600">{data.company} • {data.sector}</p>

        <div className="mt-6 rounded-xl border bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-sm text-zinc-600">Score</div>
              <div className="mt-1 text-2xl font-semibold">{data.score === null ? "—" : `${data.score}/100`}</div>
            </div>
            <div>
              <div className="text-sm text-zinc-600">Validation</div>
              <div className="mt-1 text-sm font-semibold">{data.validation_status || "—"}</div>
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Profile (markdown)</h2>
          <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-800">{data.profile_markdown}</pre>
        </section>
      </main>
    </div>
  );
}


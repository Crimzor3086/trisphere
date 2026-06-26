import Link from 'next/link';
import KhcBackendBanner from '@/components/KhcBackendBanner';
import { fetchProfile, KhcBackendError } from '@/lib/api/khc';

export default async function ChampionProfilePage({ params }: { params: { id: string } }) {
  let data: Awaited<ReturnType<typeof fetchProfile>> | null = null;
  let backendError: string | null = null;

  try {
    data = await fetchProfile(params.id);
  } catch (error) {
    backendError = error instanceof KhcBackendError ? error.message : 'Failed to load profile.';
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-8 space-y-3">
          <Link href="/champions/discover" className="text-sm text-sky-300 hover:text-white">
            ← Discover
          </Link>
          <h1 className="text-3xl font-semibold text-white">Business Profile</h1>
          {data ? (
            <p className="text-slate-400">
              {data.company} · {data.sector}
            </p>
          ) : null}
        </header>

        {backendError ? <KhcBackendBanner message={backendError} /> : null}

        {data ? (
          <>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-slate-500">Score</div>
                  <div className="mt-1 text-2xl font-semibold text-white">
                    {data.score === null ? '—' : `${data.score}/100`}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Validation</div>
                  <div className="mt-1 text-sm font-semibold text-sky-300">{data.validation_status || '—'}</div>
                </div>
              </div>
            </div>

            <section className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6">
              <h2 className="font-semibold text-white">Profile (markdown)</h2>
              <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">{data.profile_markdown}</pre>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

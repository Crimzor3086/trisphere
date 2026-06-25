export default function TrendsPage() {
  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] flex-col bg-slate-950">
      <div className="border-b border-slate-800/80 px-6 py-4 sm:px-10">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Trend Hunter</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">AI Trend-to-Content Engine</h1>
        <p className="mt-1 text-sm text-slate-400">
          Live trends, content briefs, and Avalanche registry — connected to the Trend Hunter backend on port 8000.
        </p>
      </div>
      <iframe
        title="Trend Hunter"
        src="/trend-hunter/index.html"
        className="min-h-0 flex-1 w-full border-0"
        style={{ height: 'calc(100vh - 9rem)' }}
      />
    </main>
  );
}

export default function TrendsPage() {
  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] flex-col bg-midnight text-foreground">
      <div className="border-b border-border/80 px-6 py-4 sm:px-10">
        <p className="text-sm uppercase tracking-[0.35em] text-primary/80">TrendSphere</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Emerging trend intelligence workspace</h1>
        <p className="mt-1 text-sm text-muted">
          Live trends, content briefs, source trails, and verification signals connected to the opportunity graph.
        </p>
      </div>
      <iframe
        title="TrendSphere workspace"
        src="/trend-hunter/index.html"
        className="min-h-0 flex-1 w-full border-0"
        style={{ height: 'calc(100vh - 9rem)' }}
      />
    </main>
  );
}

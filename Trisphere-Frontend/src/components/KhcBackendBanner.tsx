import { khcBackendHint } from '@/lib/api/khc';

export default function KhcBackendBanner({ message }: { message?: string }) {
  return (
    <div className="mb-8 rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4 text-foreground/90">
      <p className="font-medium text-highlight">Champion API unavailable</p>
      <p className="mt-2 text-sm text-muted">
        {message ?? `Could not load live champion data. ${khcBackendHint()}`}
      </p>
    </div>
  );
}

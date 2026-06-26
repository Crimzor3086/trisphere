import { khcBackendHint } from '@/lib/api/khc';

export default function KhcBackendBanner({ message }: { message?: string }) {
  return (
    <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-amber-100">
      <p className="font-medium">KHC backend unavailable</p>
      <p className="mt-2 text-sm text-amber-200/90">
        {message ?? `Could not load live champion data. ${khcBackendHint()}`}
      </p>
    </div>
  );
}

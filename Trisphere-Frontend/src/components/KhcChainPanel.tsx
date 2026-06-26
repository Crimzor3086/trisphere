'use client';

import { useState } from 'react';
import { fetchChainStatus, syncChainRegistry } from '@/lib/api/khc-chain';
import { snowtraceAddress } from '@/lib/chains';
import { getTriSphereContracts } from '@/lib/contracts';

export default function KhcChainPanel() {
  const [status, setStatus] = useState<Awaited<ReturnType<typeof fetchChainStatus>> | null>(null);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contracts = getTriSphereContracts();

  async function loadStatus() {
    setLoading(true);
    setError(null);
    try {
      setStatus(await fetchChainStatus());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load chain status');
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setLoading(true);
    setError(null);
    setSyncResult(null);
    try {
      const result = await syncChainRegistry();
      setSyncResult(JSON.stringify(result, null, 2));
      await loadStatus();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-secondary/20 bg-card/80 p-6 shadow-glow-secondary">
      <h2 className="font-semibold text-foreground">Avalanche Fuji On-Chain Registry</h2>
      <p className="mt-2 text-sm text-muted">
        KHCRegistry on Fuji testnet — sync verified champions from the pipeline to chain.
      </p>

      {contracts.khcRegistry ? (
        <p className="mt-3 text-sm">
          Contract:{' '}
          <a
            href={snowtraceAddress(contracts.khcRegistry)}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:text-white"
          >
            {contracts.khcRegistry.slice(0, 10)}…{contracts.khcRegistry.slice(-8)}
          </a>
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={loadStatus}
          disabled={loading}
          className="rounded-full border border-border px-4 py-2 text-sm text-foreground/90 hover:border-primary"
        >
          Check chain status
        </button>
        <button
          type="button"
          onClick={handleSync}
          disabled={loading}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-foreground hover:bg-primary/90"
        >
          Sync to Fuji
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}
      {status ? (
        <pre className="mt-4 overflow-x-auto rounded-xl bg-midnight/80 p-4 text-xs text-foreground/80">
          {JSON.stringify(status, null, 2)}
        </pre>
      ) : null}
      {syncResult ? (
        <pre className="mt-4 overflow-x-auto rounded-xl bg-midnight/80 p-4 text-xs text-secondary">
          {syncResult}
        </pre>
      ) : null}
    </section>
  );
}

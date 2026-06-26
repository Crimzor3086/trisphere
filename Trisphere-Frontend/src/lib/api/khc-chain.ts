import { getKhcApiBase } from '@/lib/config';

export type ChainStatus = {
  configured: boolean;
  registryAddress?: string;
  connected?: boolean;
  chainId?: number;
  verifiedCount?: number;
  explorerUrl?: string;
};

export async function fetchChainStatus(): Promise<ChainStatus> {
  const res = await fetch(`${getKhcApiBase()}/chain/status`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`chain/status failed: ${res.status}`);
  return res.json();
}

export async function syncChainRegistry() {
  const res = await fetch(`${getKhcApiBase()}/chain/sync`, { method: 'POST', cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`chain/sync failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchOnChainRegistry() {
  const res = await fetch(`${getKhcApiBase()}/chain/registry`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`chain/registry failed: ${res.status}`);
  return res.json();
}

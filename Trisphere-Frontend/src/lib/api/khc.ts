import { getKhcApiBase } from '@/lib/config';

export type DiscoverItem = {
  id: string;
  business_id?: string;
  company_name: string;
  sector: string;
  location: string;
  score: number | null;
  classification?: string;
  validation_status?: string;
};

export type RegistryItem = {
  company: string;
  sector: string;
  score: number | null;
  validation_status?: string;
  profile_hash: string;
  timestamp: string;
};

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${getKhcApiBase()}${path}`, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET ${path} failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

export async function fetchDiscover() {
  return getJson<{ items: DiscoverItem[] }>('/discover');
}

export async function fetchRegistry() {
  return getJson<{ items: RegistryItem[] }>('/registry');
}

export async function fetchProfile(id: string) {
  return getJson<{
    company: string;
    sector: string;
    score: number | null;
    validation_status?: string;
    profile_markdown: string;
  }>(`/profile/${encodeURIComponent(id)}`);
}

export function getKhcPipelineUrl() {
  return `${getKhcApiBase()}/pipeline/run`;
}

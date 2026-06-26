import { BACKEND_PORTS, getKhcApiBase } from '@/lib/config';

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

export class KhcBackendError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KhcBackendError';
  }
}

export function khcBackendHint() {
  return `Start the KHC backend: cd kenyahidden-Backend && npm run backend (port ${BACKEND_PORTS.khc})`;
}

async function getJson<T>(path: string): Promise<T> {
  const url = `${getKhcApiBase()}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      cache: 'no-store',
    });
  } catch {
    throw new KhcBackendError(`Cannot reach KHC backend at ${getKhcApiBase()}. ${khcBackendHint()}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new KhcBackendError(`GET ${path} failed: ${res.status} ${text}`);
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

/** Browser form POST — routed through Next.js proxy. */
export function getKhcPipelineUrl() {
  return '/api/khc/pipeline/run';
}

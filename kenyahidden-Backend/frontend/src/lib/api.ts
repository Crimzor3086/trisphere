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


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: { "content-type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

export async function fetchDiscover() {
  return getJson<{ items: DiscoverItem[] }>("/api/discover");
}

export async function fetchRegistry() {
  return getJson<{ items: RegistryItem[] }>("/api/registry");
}

export async function fetchProfile(id: string) {
  return getJson<any>(`/api/profile/${encodeURIComponent(id)}`);
}


/** TriSphere backend port map (backends stay separate; frontends unified here). */
export const BACKEND_PORTS = {
  boardy: 4000,
  khc: 5000,
  trend: 8000,
} as const;

/** Official open-source backend services behind the unified frontend. */
export const BACKEND_APIS = [
  {
    id: 'trend',
    name: 'Trend API',
    stack: 'FastAPI',
    description: 'Trend intelligence backend',
    license: 'Open Source',
    port: BACKEND_PORTS.trend,
    route: '/trends',
    proxyPath: '/api/trend',
    uiLabel: 'TrendSphere',
  },
  {
    id: 'champion',
    name: 'Champion API',
    stack: 'Express.js',
    description: 'Hidden Champion engine',
    license: 'Open Source',
    port: BACKEND_PORTS.khc,
    route: '/champions',
    proxyPath: '/api/khc',
    uiLabel: 'ChampionSphere',
  },
  {
    id: 'connect',
    name: 'Connect API',
    stack: 'Phoenix (Elixir)',
    description: 'Matchmaking backend',
    license: 'Open Source',
    port: BACKEND_PORTS.boardy,
    route: '/matches',
    proxyPath: '/api/boardy',
    uiLabel: 'ConnectSphere',
  },
] as const;

function serverBoardyBase() {
  return process.env.BOARDY_API_URL ?? `http://localhost:${BACKEND_PORTS.boardy}`;
}

function serverKhcBase() {
  return process.env.KHC_API_URL ?? `http://localhost:${BACKEND_PORTS.khc}/api`;
}

function serverTrendBase() {
  return process.env.TREND_API_URL ?? `http://localhost:${BACKEND_PORTS.trend}`;
}

/** Connect API — Phoenix matchmaking (profiles, matches, Vapi). */
export function getBoardyApiBase(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BOARDY_API_URL ?? '/api/boardy';
  }
  return serverBoardyBase();
}

/** Champion API — Hidden Champion discovery engine. */
export function getKhcApiBase(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_KHC_API_URL ?? '/api/khc';
  }
  return serverKhcBase();
}

/** Trend API — trend intelligence, briefs, registry signals. */
export function getTrendApiBase(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_TREND_API_URL ?? '/api/trend';
  }
  return serverTrendBase();
}

export function backendApiHint(apiId: (typeof BACKEND_APIS)[number]['id']): string {
  const api = BACKEND_APIS.find((entry) => entry.id === apiId);
  if (!api) return '';
  return `Start the ${api.name} (${api.stack}): port ${api.port}`;
}

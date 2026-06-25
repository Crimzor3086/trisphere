/** TriSphere backend port map (backends stay separate; frontends unified here). */
export const BACKEND_PORTS = {
  boardy: 4000,
  khc: 5000,
  trend: 8000,
} as const;

function serverBoardyBase() {
  return process.env.BOARDY_API_URL ?? `http://localhost:${BACKEND_PORTS.boardy}`;
}

function serverKhcBase() {
  return process.env.KHC_API_URL ?? `http://localhost:${BACKEND_PORTS.khc}/api`;
}

function serverTrendBase() {
  return process.env.TREND_API_URL ?? `http://localhost:${BACKEND_PORTS.trend}`;
}

/** Boardy (Phoenix) — profiles, matches, Vapi. */
export function getBoardyApiBase(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BOARDY_API_URL ?? '/api/boardy';
  }
  return serverBoardyBase();
}

/** Kenya Hidden Champions (Express). */
export function getKhcApiBase(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_KHC_API_URL ?? '/api/khc';
  }
  return serverKhcBase();
}

/** Trend Hunter (FastAPI). */
export function getTrendApiBase(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_TREND_API_URL ?? '/api/trend';
  }
  return serverTrendBase();
}

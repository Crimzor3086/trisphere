# TriSphere Frontend

Unified intelligence platform shell — one frontend, three open-source backends.

## Open-source backends

| API | Stack | Role | License | Route | Port |
|-----|-------|------|---------|-------|------|
| **Trend API** | FastAPI | Trend intelligence backend | Open Source | `/trends` | **8000** |
| **Champion API** | Express.js | Hidden Champion engine | Open Source | `/champions/*` | **5000** |
| **Connect API** | Phoenix (Elixir) | Matchmaking backend | Open Source | `/matches` | **4000** |

## Routes

| Route | UI module | API |
|-------|-----------|-----|
| `/` | TriSphere dashboard | — |
| `/trends` | TrendSphere workspace | Trend API `:8000` |
| `/champions` | ChampionSphere hub | Champion API `:5000` |
| `/champions/discover` | Company explorer | Champion API `:5000` |
| `/champions/registry` | On-chain registry | Champion API `:5000` |
| `/champions/profile/[id]` | Business profile | Champion API `:5000` |
| `/matches` | ConnectSphere matchmaking | Connect API `:4000` |
| `/commerce` | Avalanche settlement layer | On-chain (Fuji) |

## Development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Start all three backends first (see root [README](../README.md) for ports).

## API proxy

Client requests use same-origin paths proxied by `next.config.mjs`:

- `NEXT_PUBLIC_TREND_API_URL=/api/trend` → **Trend API**
- `NEXT_PUBLIC_KHC_API_URL=/api/khc` → **Champion API**
- `NEXT_PUBLIC_BOARDY_API_URL=/api/boardy` → **Connect API**

Server components call backends directly via `TREND_API_URL`, `KHC_API_URL`, and `BOARDY_API_URL`.

## Integrated apps

- **TrendSphere** — static app in `public/trend-hunter/`, embedded at `/trends`
- **ChampionSphere** — Next.js pages under `src/app/champions/`
- **ConnectSphere** — React components in `src/integrations/boardy/`, mounted at `/matches`

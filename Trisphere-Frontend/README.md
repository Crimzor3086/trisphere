# TriSphere Frontend

Unified intelligence platform shell — one frontend, three separate backends.

## Routes

| Route | System | Backend |
|-------|--------|---------|
| `/` | TriSphere landing | — |
| `/trends` | Trend Hunter workspace | `:8000` |
| `/champions` | KHC discovery hub | `:5000` |
| `/champions/discover` | Company explorer | `:5000` |
| `/champions/registry` | On-chain registry | `:5000` |
| `/champions/profile/[id]` | Business profile | `:5000` |
| `/matches` | Boardy.ai matchmaking | `:4000` |

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

- `NEXT_PUBLIC_BOARDY_API_URL=/api/boardy`
- `NEXT_PUBLIC_KHC_API_URL=/api/khc`
- `NEXT_PUBLIC_TREND_API_URL=/api/trend`

Server components call backends directly via `BOARDY_API_URL`, `KHC_API_URL`, and `TREND_API_URL`.

## Integrated apps

- **Trend Hunter** — static app in `public/trend-hunter/`, embedded at `/trends`
- **KHC-DE** — Next.js pages under `src/app/champions/`
- **Boardy.ai** — React components in `src/integrations/boardy/`, mounted at `/matches`

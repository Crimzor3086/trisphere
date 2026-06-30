# TriSphere

TriSphere combines three previously separate intelligence systems into one unified frontend, while keeping each backend independent on its own port.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Trisphere-Frontend  (port 3000)  — unified shell + nav   │
│  /trends          → TrendSphere UI     →  Trend API (FastAPI) :8000      │
│  /champions/*     → ChampionSphere UI  →  Champion API (Express) :5000   │
│  /matches         → ConnectSphere UI   →  Connect API (Phoenix) :4000    │
└─────────────────────────────────────────────────────────────┘
```

| API | Stack | Role | License | Frontend route | Port |
|-----|-------|------|---------|----------------|------|
| **Trend API** | FastAPI | Trend intelligence backend | Open Source | `/trends` | **8000** |
| **Champion API** | Express.js | Hidden Champion engine | Open Source | `/champions/*` | **5000** |
| **Connect API** | Phoenix (Elixir) | Matchmaking backend | Open Source | `/matches` | **4000** |

| System | Frontend route | Backend folder | Port |
|--------|----------------|----------------|------|
| **TriSphere** (unified shell) | `Trisphere-Frontend/` | — | **3000** |
| **TrendSphere** | `/trends` | `trendhuntjack-backend-/backend/` | **8000** |
| **ChampionSphere** | `/champions/*` | `kenyahidden-Backend/backend/` | **5000** |
| **ConnectSphere** | `/matches` | `boardyai-backend/backend/` | **4000** |

Legacy standalone frontends under each subsystem folder are **not** required for local dev — use `Trisphere-Frontend` only.

### Supporting services

| Service | Port | System |
|---------|------|--------|
| PostgreSQL + pgvector | 5432 | Boardy.ai |
| Redis | 6379 | Trend Hunter |
| n8n (optional, Boardy dev) | 5678 | Boardy.ai |

## Quick start

### 1. Start backends (each in its own terminal)

**Connect API** (Phoenix + Postgres):

```bash
cd boardyai-backend
docker compose up db -d
cd backend && mix phx.server   # http://localhost:4000
```

**Champion API** (Express):

```bash
cd kenyahidden-Backend
npm run backend                # http://localhost:5000
```

**Trend API** (FastAPI + optional Redis):

```bash
cd trendhuntjack-backend-
docker compose up redis -d     # optional
npm run backend                # http://localhost:8000
```

### 2. Start the unified frontend

```bash
cd Trisphere-Frontend
cp .env.example .env.local
npm install
npm run dev                    # http://localhost:3000
```

API calls from the browser are proxied through Next.js:

- `/api/boardy/*` → Connect API (Phoenix)
- `/api/khc/*` → Champion API (Express)
- `/api/trend/*` → Trend API (FastAPI)

## Repository layout

```
Trisphere/
├── Trisphere-Frontend/       # Main unified frontend (use this)
├── boardyai-backend/         # Matchmaking — backend + legacy Vite frontend
├── kenyahidden-Backend/      # Hidden champions — backend + legacy Next frontend
└── trendhuntjack-backend-/   # Trend hunter — backend + legacy static frontend
```

## Environment

Copy `Trisphere-Frontend/.env.example` to `.env.local`. Backend URLs default to the ports above; override only when deploying.

Each subsystem retains its own `.env` / `env.example` for backend configuration — those backends are unchanged except Trend Hunter CORS now allows the TriSphere origin on port 3000.

## Avalanche Fuji blockchain

All three products deploy to **Avalanche Fuji** (chainId `43113`).

### Deploy contracts

```bash
# Root .env needs PRIVATE_KEY + RPC_URL (see .env.example)
npm install
npm run deploy:fuji
npm run sync:env
```

Manifest: `deployments/trisphere-fuji.json`

| Contract | Purpose |
|----------|---------|
| `TrendRegistry` | Trend first-seen proofs |
| `KHCRegistry` | Verified hidden champion hashes |
| `BoardyMatchStaking` | 0.01 AVAX bilateral match stakes |
| `BoardyMilestoneEscrow` | Milestone escrow (Boardy) |

### Wallet connection (Trisphere-Frontend)

- Navbar **Connect Wallet** → Thirdweb on Fuji (MetaMask / social login)
- `/matches` → real `stake()` on BoardyMatchStaking
- `/trends` → Trend Hunter iframe (Core / MetaMask via `window.ethereum`)
- `/champions` → **Sync to Fuji** panel for KHCRegistry

After deploy, restart backends so they pick up new contract addresses.

```bash
# Sync verified champions to chain (KHC backend must be running)
curl -X POST http://localhost:5000/api/chain/sync
```

Faucet: https://faucet.avax.network/

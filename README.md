# TriSphere

TriSphere combines three previously separate intelligence systems into one unified frontend, while keeping each backend independent on its own port.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Trisphere-Frontend  (port 3000)  — unified shell + nav   │
│  /trends          → Trend Hunter UI  →  FastAPI :8000       │
│  /champions/*     → KHC-DE UI        →  Express :5000       │
│  /matches         → Boardy.ai UI     →  Phoenix  :4000      │
└─────────────────────────────────────────────────────────────┘
```

| System | Frontend route | Backend | Port |
|--------|----------------|---------|------|
| **TriSphere** (main) | `Trisphere-Frontend/` | — | **3000** |
| **Trend Hunter** | `/trends` | `trendhuntjack-backend-/backend/` | **8000** |
| **Kenya Hidden Champions** | `/champions/*` | `kenyahidden-Backend/backend/` | **5000** |
| **Boardy.ai** | `/matches` | `boardyai-backend/backend/` | **4000** |

Legacy standalone frontends under each subsystem folder are **not** required for local dev — use `Trisphere-Frontend` only.

### Supporting services

| Service | Port | System |
|---------|------|--------|
| PostgreSQL + pgvector | 5432 | Boardy.ai |
| Redis | 6379 | Trend Hunter |
| n8n (optional, Boardy dev) | 5678 | Boardy.ai |

## Quick start

### 1. Start backends (each in its own terminal)

**Boardy.ai** (Phoenix + Postgres):

```bash
cd boardyai-backend
docker compose up db -d
cd backend && mix phx.server   # http://localhost:4000
```

**Kenya Hidden Champions** (Express):

```bash
cd kenyahidden-Backend
npm run backend                # http://localhost:5000
```

**Trend Hunter** (FastAPI + optional Redis):

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

- `/api/boardy/*` → Boardy backend
- `/api/khc/*` → KHC backend
- `/api/trend/*` → Trend Hunter backend

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

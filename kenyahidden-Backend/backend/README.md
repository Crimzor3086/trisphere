# KHC-DE Backend (Express + Blockchain)

Primary API for the Kenya Hidden Champions Discovery Engine. Port **5000**.

## Setup
```bash
npm install --prefix backend
cp env.example .env   # repo root
```

## Run
```bash
npm run backend
```

## Discovery engine flow

```
POST /api/discovery/ingest  →  raw_discoveries.csv
POST /api/pipeline/run      →  scored_candidates.csv + profiles + public registry
POST /api/chain/sync        →  optional on-chain verification (Fuji)
```

CLI equivalents:
```bash
node scripts/daily_discovery.js --import data/raw/discovery_candidates.json --run-pipeline
npm run pipeline
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/discovery/status` | Engine health: raw count, scored, qualified |
| `GET` | `/api/discovery/raw` | All rows in raw_discoveries.csv |
| `POST` | `/api/discovery/ingest` | Add candidate(s); `?runPipeline=true` to score immediately |
| `GET` | `/api/discover` | Scored candidates |
| `GET` | `/api/profile/:id` | Company profile |
| `GET` | `/api/registry` | Qualified champions (off-chain trust layer) |
| `POST` | `/api/pipeline/run` | Score, validate, profile, rebuild registry |
| `GET` | `/api/chain/status` | Avalanche Fuji connectivity |
| `POST` | `/api/chain/sync` | Register Qualified champions on-chain |

## Blockchain (optional)

```bash
npm run compile
npm run deploy:fuji
# Set KHC_REGISTRY_ADDRESS + PRIVATE_KEY in .env (deployer must be contract owner)
```

Set `CHAIN_AUTO_SYNC=true` to register on-chain after each pipeline run.

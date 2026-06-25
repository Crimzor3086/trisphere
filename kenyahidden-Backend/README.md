# Kenya Hidden Champions Discovery Engine (KHC-DE)

## What this is
**KHC-DE** is a repeatable business intelligence + field-research system that continuously discovers **exceptional Kenyan businesses** that are operationally strong but **invisible to the startup ecosystem**.

It is designed to help you keep finding hundreds of companies over time—not just "top 50 once".

> **Stack:** Node.js ≥ 22 · Express · Next.js 16 · Solidity (Avalanche)

---

## Core idea
Ecosystems over-index on venture-backed, LinkedIn-visible, media-frequent companies. Meanwhile, thousands of resilient businesses quietly:
- serve institutional customers,
- maintain quality for years,
- expand operations slowly,
- and build trust through outcomes.

KHC-DE finds those businesses using a **funnel pipeline**:
1) source collection → 2) normalization & de-duplication → 3) enrichment → 4) scoring → 5) validation → 6) profiling → 7) outreach.

---

## Hidden Champion definition (high level)
**Must satisfy all required criteria:**
- Kenya founded or Kenya-based operations
- operating for 5+ years (exceptions allowed)
- strong customer trust signals
- no major startup-ecosystem visibility

**Must be excluded if any exclusion criteria apply:**
- raised venture capital
- frequently featured by TechCabal / Disrupt Africa / TechCrunch / etc.
- accelerator alumni
- startup competition regulars
- heavy LinkedIn presence
- AI / fintech / Web3 startup categorization

(See: `Hidden Champion Definition.md`)

---

## Deliverables (docs in this repo)
- `Hidden Champion Definition.md`
- `SOP.md`
- `Sources.md`
- `Scoring Model.md`
- `Database Schema.md`
- `Company Profile Template.md`
- `Validation Checklist.md`
- `Founder Outreach.md`
- `Repeatable Pipeline SOP — Technical.md`
- `TODO.md` — live task tracker

---

## Scoring model (100 points)
A Hidden Champion score is computed from:
- Longevity (20)
- Customer Trust (20)
- Operational Footprint (20)
- Growth Signals (20)
- Ecosystem Invisibility (20)

(See: `Scoring Model.md` and `scripts/scoring_calculator.js`)

---

## Data model (recommended)
Use Airtable/Notion/Google Sheets for speed, or PostgreSQL for scale.

(See: `Database Schema.md`)

---

## How discovery runs (repeatable loop)
- **Daily:** collect + enrich + de-dup + lightly score
- **Weekly:** deeper scoring + validate top candidates + draft profiles
- **Monthly:** publish top 50 + contact top 10 founders
- **Quarterly:** refresh sources + re-score + expand sectors/regions

(See: `SOP.md`)

---

## Important constraint
KHC-DE is not a "scrape everything" system.
It's an **evidence-driven discovery engine** with explicit validation gates.

---

## Folder structure (actual)
```text
Kenya-Hidden-Champions/
├── README.md
├── TODO.md
├── LICENSE
├── .gitignore
├── package.json                  # monorepo root — pipeline dependencies
├── package-lock.json
├── .env                          # local secrets (not committed)
├── env.example                   # env var template (commit-safe)
│
├── Hidden Champion Definition.md
├── SOP.md
├── Sources.md
├── Scoring Model.md
├── Database Schema.md
├── Company Profile Template.md
├── Validation Checklist.md
├── Founder Outreach.md
├── Repeatable Pipeline SOP — Technical.md
│
├── data/
│   ├── raw/                      # raw_discoveries.csv (pipeline input)
│   ├── processed/                # scored_candidates.csv (pipeline output)
│   ├── validated/
│   ├── verified/                 # public_registry.json (written by backend)
│   ├── profiles/                 # per-company .md profiles (generated)
│   ├── research/
│   ├── google_maps/
│   ├── directories/
│   ├── government/
│   ├── news/
│   └── social/
│
├── scripts/
│   ├── run_pipeline.js           # ETL: load → score → validate → profile
│   ├── scoring_calculator.js       # 100-point scoring logic
│   ├── daily_discovery.js          # ingest discoveries into raw CSV
│   ├── discovery/
│   │   ├── ingest.js               # normalize + dedupe + append raw CSV
│   │   └── csvSchema.js
│   └── outreach/
│       ├── outreach_queue.md
│       └── outreach_template.md
│
├── backend/
│   ├── index.js                    # Express API (port 5000) + discovery + chain
│   ├── chain.js                    # Avalanche Fuji / KHCRegistry
│   ├── chainSync.js
│   └── pipeline.js
│
├── frontend/
│   └── src/app/                    # Next.js UI
│
└── contracts/
    └── KHCRegistry.sol             # on-chain verified champion registry
```

---

## Quick start

### Prerequisites
- **Node.js ≥ 22** — download from [nodejs.org](https://nodejs.org)

### 1. Environment variables
Copy `env.example` to `.env` and fill in your keys:
```bash
copy env.example .env
```
| Variable | Purpose |
|---|---|
| `RPC_URL` | Avalanche Fuji RPC (optional — defaults to public Fuji endpoint) |
| `PRIVATE_KEY` | Wallet for on-chain registration (contract owner) |
| `KHC_REGISTRY_ADDRESS` | Deployed KHCRegistry address |
| `CHAIN_AUTO_SYNC` | `true` to register Qualified champions after pipeline runs |
| `PORT` | Backend port (default 5000) |

### 2. Install dependencies
```bash
npm install
npm install --prefix backend
```

### 3. Ingest discoveries and run pipeline
Add candidates via API or CLI, then score:
```bash
# Bulk import seed candidates
npm run discover:import

# Score, validate, generate profiles
npm run pipeline
```

Or via API (with backend running):
```bash
curl -X POST http://localhost:5000/api/discovery/ingest \
  -H 'Content-Type: application/json' \
  -d '{"company_name":"Example Co","sector":"Manufacturing","city":"Nairobi","county":"Nairobi","website":"https://example.co.ke","runPipeline":true}'
```

Outputs:
- `data/processed/scored_candidates.csv`
- `data/profiles/<company-slug>.md`
- `data/verified/public_registry.json` (Qualified only, after pipeline via API)

### 4. Start the backend API
```bash
npm run backend
```
Server: **http://localhost:5000**

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/discovery/status` | Discovery engine health |
| `POST` | `/api/discovery/ingest` | Add raw candidate(s) |
| `GET` | `/api/discover` | Scored candidates |
| `GET` | `/api/profile/{id}` | Company profile |
| `GET` | `/api/registry` | Qualified public registry |
| `POST` | `/api/pipeline/run` | Run full ETL pipeline |
| `GET` | `/api/chain/status` | Blockchain connectivity |

### 5. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 6. Daily discovery sessions
```bash
node scripts/daily_discovery.js "packaging manufacturer kenya"
node scripts/daily_discovery.js --import data/raw/discovery_candidates.json --run-pipeline
```

### 7. Smart contracts (optional)
```bash
npm run compile
npm run deploy:fuji
```
Deploys `KHCRegistry` to Avalanche Fuji for on-chain verification.

---

## Next steps
1. Define the Hidden Champion rules precisely.
2. Create the scoring rubric + evidence requirements.
3. Implement the pipeline state machine (even if manual at first).
4. Start building a growing dataset with strict deduping.

(See `TODO.md` for the live task tracker.)

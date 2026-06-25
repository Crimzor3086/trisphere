# TODO — Kenya Hidden Champions Discovery Engine (KHC-DE)

## Completed Documentation
- [x] Create `README.md` with full project architecture + how to run as a repeatable discovery engine
- [x] Create `Hidden Champion Definition.md` (inclusion/exclusion rules)
- [x] Create `SOP.md` (daily/weekly/monthly/quarterly operations)
- [x] Create `Sources.md` (Google Maps, directories, procurement, market ecosystems, associations, social, news)
- [x] Create `Scoring Model.md` (100-point rubric + sub-metrics)
- [x] Create `Database Schema.md` (tables/fields + dedupe strategy)
- [x] Create `Company Profile Template.md` (1-page profile structure)
- [x] Create `Validation Checklist.md` (existence, quality, exclusion)
- [x] Create `Founder Outreach.md` (message framework + outreach pipeline)
- [x] Create `Repeatable Pipeline SOP — Technical.md` (ETL outline + state machine + manual checkpoints)

## Week 1 — Discovery (200 companies)
- [x] Create data directory structure
- [x] Start Google Maps research (target 25/day)
- [x] Begin directory research
- [x] Collect procurement winners

## Week 2 — Enrichment (150 quality businesses)
- [x] Add years operating data
- [x] Capture reviews/testimonials  
- [x] Research branches/warehouses
- [ ] Verify ecosystem invisibility (TechCabal, VC funding, accelerators)
- [ ] Run full scoring updates for pending companies

## Week 3 — Validation (50 hidden champions)
- [x] Run exclusion checks (VC, accelerator, media)
- [x] Score top candidates
- [ ] Generate Top 50 list (need to discover ~40 more companies)

## Week 4 — Profiles & Outreach
- [ ] Create 10 detailed profiles
- [ ] Contact 10 founders

## Engineering Tasks

### Backend (done)
- [x] Single Express backend with discovery ingest + pipeline + chain integration
- [x] Validation gating in `scripts/run_pipeline.js` → Qualified / Needs Validation / Rejected
- [x] Public registry (Qualified only) with profile hashes
- [x] Removed legacy FastAPI backend and mock payment contracts

### Frontend follow-ups
- [ ] Wire home page pipeline button to `POST http://localhost:5000/api/pipeline/run`
- [ ] Show `validation_status` on discover cards
- [ ] Show on-chain verification badges on registry page


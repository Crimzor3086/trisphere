# SOP — Kenya Hidden Champions Discovery Engine (KHC-DE)

## Operating principle
Run a repeatable loop that produces:
1) new candidates,
2) de-duplicated master records,
3) evidence-backed scoring,
4) validation of top candidates,
5) one-page profiling,
6) founder outreach.

---

## State machine (recommended)
- `Discovered` → `Enriched` → `Scored` → `Validated` → `Profiled` → `Contacted` → `Interviewed` → `Invited`

---

## Daily (evidence acquisition)
1. **Source collection (20 businesses/day)**
   - Google Maps (target industrial/manufacturing/supply niches)
   - Directories
   - Social discovery (FB/IG/TikTok) via keyword patterns

2. **Enrichment (basic evidence capture)**
   - website
   - phone
   - city/county
   - review rating/count (if available)
   - years operating estimate (from “since”/history pages or earliest references)

3. **Normalization & de-duplication**
   - unify company names
   - unify phone formats
   - unify locations (city/county)

4. **Light scoring**
   - compute provisional Longevity + Customer Trust

5. **Queue for weekly scoring/validation**

**Daily outputs**
- 20 new rows (or updates) in master DB
- evidence links attached
- duplicate rate tracked

---

## Weekly (qualification + profiling)
1. **Run full scoring for new candidates**
2. **Rank by Hidden Champion score**
3. **Validate top 20** (human checklist + exclusion evidence)
4. **Generate draft profiles** for top 10

**Weekly outputs**
- Top candidates validated
- 10 draft profiles ready for editing

---

## Monthly (publication + outreach)
1. **Publish Top 50 Hidden Champions**
2. **Founder outreach to top 10**
   - email/phone script
   - capture response
3. **Update exclusion/visibility tags** based on outreach research

**Monthly outputs**
- 50 published profiles
- outreach pipeline progressed for 10 founders

---

## Quarterly (pipeline improvement)
1. Revisit scoring weights & thresholds
2. Expand sources for new sectors/regions
3. Add new evidence patterns for Ecosystem Visibility detection
4. Audit dedupe rules

**Quarterly outputs**
- revised scoring rubric
- updated source query library
- improved pipeline reliability metrics

---

## QA checks (always)
- Verify Kenya-based operations with at least one evidence link.
- Never claim “no VC / no accelerator” without an evidence search or marking as “unknown—needs validation”.
- Ensure every high-score candidate has at least:
  - customer trust evidence
  - longevity evidence
  - ecosystem visibility evidence (or explicit “insufficient evidence”)


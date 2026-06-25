# Repeatable Pipeline SOP — Technical (Plan/Blueprint)

## Goal
Provide a practical blueprint to implement KHC-DE as a repeatable “Discovery Engine”. Even if you don’t automate fully on day 1, you should implement the **same states, artifacts, and rules**.

---

## Recommended architecture (stateful)
Treat the pipeline as an ETL + state machine:

1) **Extract** candidates from sources
2) **Normalize** entity fields
3) **Dedupe** and merge into master business records
4) **Enrich** with intelligence signals
5) **Score** using scoring model
6) **Validate** using checklist + exclusion rules
7) **Profile** into one-page report
8) **Outreach** via CRM pipeline

---

## State machine (minimum implementation)
Persist status per business:
- `Discovered`
- `Enriched`
- `Scored`
- `Validated`
- `Profiled`
- `Contacted`

Every step updates:
- computed fields
- evidence links
- timestamps
- human notes

---

## Data ingestion playbook
### 1) Source adapters
For each source, write a small adapter that outputs a normalized candidate object:

```json
{
  "company_name": "Top Image Africa",
  "sector": "Branding",
  "city": "Nairobi",
  "county": "Nairobi",
  "website": "https://...",
  "phone": "+254...",
  "source": "Google Maps",
  "evidence_urls": ["..."]
}
```

### 2) Normalization rules
- unify phone formats (E.164)
- standardize domains (strip protocol, lowercase)
- map sector into a taxonomy
- map city → county

### 3) Dedupe keys
Auto-merge when:
- normalized phone matches, or
- website domain matches, or
- high fuzzy match + same phone

Flag ambiguous merges for manual review.

---

## Scoring implementation notes
- Score only after enrichment
- Store the breakdown (longevity/trust/operations/growth/invisibility)
- Always attach evidence for:
  - longevity
  - trust
  - ecosystem visibility/exclusion signals

---

## Validation implementation notes
Validation is a human gate. Enforce:
- exclusion criteria require evidence links
- unknown exclusion → `Needs Validation`
- validated candidates must have profile-ready data

---

## Profiling engine
Generate markdown profiles using:
- validated business intelligence
- validated evidence links

Version profiles so updates are trackable.

---

## KPIs to track (engineering-facing)
- duplicate rate
- evidence coverage (% businesses with required evidence types)
- validation throughput (businesses/week)
- profile completion rate
- outreach response rate

---

## What to automate first (sequence)
1. normalization + dedupe
2. evidence collection templates
3. scoring calculation
4. profile generation
5. outreach CRM integration

---

## Manual checkpoints
Even with automation, keep explicit human checks:
- exclusion detection confirmation
- ambiguous dedupe merges
- final profile edits before publication


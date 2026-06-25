# Database Schema — KHC-DE

## Goal
Store raw discoveries, unify duplicates, maintain evidence links, compute scoring, and track outreach.

---

## Recommended approach
Start with a spreadsheet/Notion/Airtable schema.
If you want scale, map the same fields into PostgreSQL.

---

## Core tables (relational)

### 1) `businesses`
Master record (deduplicated).

| Field | Type | Notes |
|---|---|---|
| business_id | UUID | primary |
| company_name | text | canonical name |
| sector | text | taxonomy tag |
| city | text | normalized |
| county | text | normalized |
| founded_year | int | inferred/verified |
| website | text | |
| phone | text | normalized |
| source_primary | text | e.g., Google Maps |
| created_at | timestamp | |

---

### 2) `evidence`
Attach proof artifacts to a business.

| Field | Type |
|---|---|
| evidence_id | UUID |
| business_id | UUID (FK) |
| evidence_type | text | review, news, directory, procurement, website_about |
| url | text |
| title | text |
| captured_at | timestamp |
| notes | text |

---

### 3) `intelligence`
Enrichment and computed signals.

| Field | Type | Notes |
|---|---|---|
| business_id | UUID (FK) | unique |
| years_operating | int | derived |
| google_rating | float | optional |
| google_review_count | int | optional |
| branches | int | optional |
| employees_estimate | int | optional |
| exports | boolean | optional |
| growth_signal_summary | text | |

---

### 4) `scoring`
Scoring breakdown and final score.

| Field | Type |
|---|---|
| business_id | UUID |
| longevity_score | int |
| trust_score | int |
| operations_score | int |
| growth_score | int |
| invisibility_score | int |
| total_score | int |
| visibility_level | text | e.g., low/med/high |
| scored_at | timestamp |

---

### 5) `validation`
Human gating.

| Field | Type |
|---|---|
| business_id | UUID |
| validation_status | text | Qualified / Needs Validation / Rejected |
| exclusion_flags | text[] | VC, accelerator, startup_media, linkedin_heavy |
| validation_notes | text |
| validated_by | text |
| validated_at | timestamp |

---

### 6) `profiles`
Generated one-page profile outputs.

| Field | Type |
|---|---|
| business_id | UUID |
| profile_markdown | text |
| profile_version | int |
| generated_at | timestamp |

---

### 7) `founders`
Founder contact + outreach pipeline.

| Field | Type |
|---|---|
| founder_id | UUID |
| business_id | UUID |
| founder_name | text |
| email | text |
| phone | text |
| linkedin | text |
| outreach_status | text | Discovered/Contacted/Interviewed/Invited |
| last_contacted_at | timestamp |
| response_notes | text |

---

## Dedupe strategy (pragmatic)
Use a staged dedupe approach:

1. **Exact matches**
   - normalized phone
   - exact website domain match

2. **Near matches**
   - fuzzy company name similarity
   - same phone + similar name

3. **Manual merge queue**
   - conflicts flagged for human resolution

Document merge rules so the engine stays consistent over time.


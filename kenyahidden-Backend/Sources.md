# Sources — KHC-DE Discovery Inputs

## Source taxonomy
KHC-DE uses multiple unconventional sources so the dataset doesn’t overfit on LinkedIn/media-visible companies.

---

## Source A — Google Maps (primary; ~40%)
**Goal:** capture local, operational businesses with reviews/trust signals.

**Search terms (sector-specific):**
- industrial laundry Kenya
- packaging company Kenya
- water drilling Kenya
- cold chain logistics Kenya
- hospital equipment supplier Kenya
- school furniture manufacturer Kenya
- bakery supplier Kenya
- agro processor Kenya
- animal feed manufacturer Kenya
- waste management Kenya
- security systems Kenya
- transport SACCO Kenya
- industrial kitchen supplier Kenya

**Captured fields**
- name
- location (city/county)
- website
- phone
- years operating (if visible)
- reviews rating/count

---

## Source B — Business Directories (~15%)
Examples:
- Kenya Business Directory
- Yellow Pages Kenya
- SoftKenya
- KenyaPlex
- Bizna Kenya

**Captured fields**
- company
- category/sector
- location
- contact
- website (if present)

---

## Source C — Procurement winners (~15%)
Purpose: institutional contracting is a strong trust signal.

Search patterns:
- site:tenders.go.ke awarded contract
- site:kebs.org suppliers
- site:kra.go.ke registered suppliers
- site:kenha.co.ke suppliers

**Captured fields**
- company name
- procurement agency
- contract evidence link
- contract date

---

## Source D — Physical market ecosystems (~10%)
Map business clusters by area. Use them as discovery “seeds” to expand the candidate graph.

- Nairobi: Industrial Area, Gikomba, Kariobangi, Kamukunji, Muthurwa
- Mombasa: Changamwe
- Kisumu: Kibos
- Nakuru: Industrial Area
- Eldoret: Pioneer
- Meru: Makutano

**Captured fields**
- business listings in cluster
- sector tags

---

## Source E — Industry associations (~10%)
Association member lists are high-signal.

Examples:
- Kenya Association of Manufacturers
- Fresh Produce Exporters Association
- Kenya Association of Hotelkeepers
- Kenya Healthcare Federation

**Captured fields**
- member company list entries
- category/industry

---

## Source F — Social discovery (non-LinkedIn) (~10%)
Search Facebook/Instagram/TikTok for “operational” language.

Query templates:
- "family business Kenya"
- "serving Kenyans since"
- "supplier Kenya"
- "manufacturer Kenya"

**Captured fields**
- page URL
- contact info (if present)
- evidence of longevity ("since" / history)

---

## Source G — News archives (~10%)
Older stories (2010–2020) are gold.

Templates:
- site:businessdailyafrica.com company Kenya
- site:standardmedia.co.ke manufacturer Kenya
- site:nation.africa family business Kenya

**Captured fields**
- publication URL
- date
- evidence of operational continuity


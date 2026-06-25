/**
 * Discovery ingestion — normalize, dedupe, append to raw_discoveries.csv.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { RAW_DISCOVERIES_COLUMNS, RAW_DISCOVERIES_DEFAULTS } from './csvSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const REPO_ROOT = resolve(__dirname, '..', '..');
export const RAW_DISCOVERIES_CSV = join(REPO_ROOT, 'data', 'raw', 'raw_discoveries.csv');

function normalizeDomain(url) {
  return String(url ?? '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    .replace(/^www\./, '');
}

function normalizeCompanyName(name) {
  return String(name ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ');
}

function boolString(value, fallback = 'False') {
  if (value == null || value === '') return fallback;
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  const s = String(value).trim().toLowerCase();
  if (['true', '1', 'yes'].includes(s)) return 'True';
  if (['false', '0', 'no'].includes(s)) return 'False';
  return fallback;
}

function joinEvidenceUrls(input) {
  if (Array.isArray(input)) {
    return input.map(u => String(u).trim()).filter(Boolean).join('; ');
  }
  return String(input ?? '').trim();
}

/**
 * Map API/JSON input to a raw_discoveries.csv row.
 */
export function normalizeCandidate(input) {
  const website = String(input.website ?? '').trim();
  const evidence = joinEvidenceUrls(input.evidence_urls ?? input.evidenceUrls ?? website);

  return {
    company_name: String(input.company_name ?? input.companyName ?? '').trim(),
    sector: String(input.sector ?? RAW_DISCOVERIES_DEFAULTS.sector).trim(),
    city: String(input.city ?? '').trim(),
    county: String(input.county ?? '').trim(),
    source: String(input.source ?? RAW_DISCOVERIES_DEFAULTS.source).trim(),
    website,
    founded_year: input.founded_year ?? input.foundedYear ?? '',
    evidence_urls: evidence,
    google_rating: input.google_rating ?? input.googleRating ?? '',
    google_review_count: String(input.google_review_count ?? input.googleReviewCount ?? '0'),
    institutional_refs: String(input.institutional_refs ?? input.institutionalRefs ?? '0'),
    branches: String(input.branches ?? '0'),
    warehouses: String(input.warehouses ?? '0'),
    distribution_coverage: String(input.distribution_coverage ?? input.distributionCoverage ?? 'local'),
    new_locations: String(input.new_locations ?? input.newLocations ?? '0'),
    hiring_visible: boolString(input.hiring_visible ?? input.hiringVisible),
    exports: boolString(input.exports),
    new_products: String(input.new_products ?? input.newProducts ?? '0'),
    vc_funded: boolString(input.vc_funded ?? input.vcFunded),
    accelerator_alumni: boolString(input.accelerator_alumni ?? input.acceleratorAlumni),
    media_featured: boolString(input.media_featured ?? input.mediaFeatured),
    linkedin_heavy: boolString(input.linkedin_heavy ?? input.linkedinHeavy),
    is_startup: boolString(input.is_startup ?? input.isStartup),
    status: String(input.status ?? 'Discovered'),
    added_date: input.added_date ?? new Date().toISOString().slice(0, 10),
  };
}

export function dedupeKey(row) {
  const domain = normalizeDomain(row.website);
  if (domain) return `domain:${domain}`;
  const name = normalizeCompanyName(row.company_name);
  if (name) return `name:${name}`;
  return null;
}

export function loadRawDiscoveries() {
  if (!existsSync(RAW_DISCOVERIES_CSV)) {
    return [];
  }

  const content = readFileSync(RAW_DISCOVERIES_CSV, 'utf8').trim();
  if (!content) return [];

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });
}

function nextBusinessId(rows) {
  let max = 0;
  for (const row of rows) {
    const id = parseInt(String(row.business_id ?? '0'), 10);
    if (!Number.isNaN(id) && id > max) max = id;
  }
  return String(max + 1);
}

function writeRawDiscoveries(rows) {
  mkdirSync(join(REPO_ROOT, 'data', 'raw'), { recursive: true });
  const csv = stringify(rows, { header: true, columns: RAW_DISCOVERIES_COLUMNS });
  writeFileSync(RAW_DISCOVERIES_CSV, csv, 'utf8');
}

/**
 * @param {object|object[]} candidates
 * @returns {{ added: object[], skipped: object[], total: number }}
 */
export function ingestCandidates(candidates) {
  const list = Array.isArray(candidates) ? candidates : [candidates];
  const existing = loadRawDiscoveries();
  const seen = new Set(existing.map(r => dedupeKey(r)).filter(Boolean));

  const added = [];
  const skipped = [];

  for (const raw of list) {
    const normalized = normalizeCandidate(raw);

    if (!normalized.company_name) {
      skipped.push({ input: raw, reason: 'missing company_name' });
      continue;
    }

    const key = dedupeKey(normalized);
    if (key && seen.has(key)) {
      skipped.push({ company_name: normalized.company_name, reason: 'duplicate', key });
      continue;
    }

    const row = {
      business_id: nextBusinessId([...existing, ...added]),
      ...RAW_DISCOVERIES_DEFAULTS,
      ...normalized,
    };

    added.push(row);
    if (key) seen.add(key);
  }

  if (added.length > 0) {
    writeRawDiscoveries([...existing, ...added]);
  }

  return { added, skipped, total: existing.length + added.length };
}

export function importFromJsonFile(filePath) {
  const abs = resolve(filePath);
  const data = JSON.parse(readFileSync(abs, 'utf8'));
  const candidates = Array.isArray(data) ? data : data.candidates ?? [data];
  return ingestCandidates(candidates);
}

export function getDiscoveryStats() {
  const raw = loadRawDiscoveries();
  const byStatus = {};
  for (const row of raw) {
    const s = row.status || 'Unknown';
    byStatus[s] = (byStatus[s] || 0) + 1;
  }
  return {
    rawCount: raw.length,
    byStatus,
    csvPath: RAW_DISCOVERIES_CSV,
  };
}

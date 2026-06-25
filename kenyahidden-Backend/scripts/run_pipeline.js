#!/usr/bin/env node
/**
 * KHC-DE Pipeline Runner
 *
 * Runs the full ETL pipeline:
 *   1. Load  data/raw/raw_discoveries.csv
 *   2. Score each row (scoring_calculator.js)
 *   3. Apply validation gating  → Qualified / Needs Validation / Rejected
 *   4. Write data/processed/scored_candidates.csv
 *   5. Write data/profiles/<slug>.md  (one per company)
 *
 * Usage:
 *   node scripts/run_pipeline.js
 */

import { createReadStream } from 'fs';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { calculateHiddenChampionScore } from './scoring_calculator.js';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const REPO_ROOT             = resolve(__dirname, '..');
const RAW_DISCOVERIES_CSV   = join(REPO_ROOT, 'data', 'raw', 'raw_discoveries.csv');
const PROFILES_DIR          = join(REPO_ROOT, 'data', 'profiles');
const OUT_SCORED_CSV        = join(REPO_ROOT, 'data', 'processed', 'scored_candidates.csv');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeInt(x, defaultVal = null) {
  if (x == null) return defaultVal;
  const s = String(x).trim().replace(/[^0-9]/g, '');
  if (!s) return defaultVal;
  const n = parseInt(s, 10);
  return isNaN(n) ? defaultVal : n;
}

function safeFloat(x, defaultVal = null) {
  if (x == null) return defaultVal;
  const s = String(x).trim();
  if (!s) return defaultVal;
  const n = parseFloat(s);
  return isNaN(n) ? defaultVal : n;
}

function flagTrue(row, key) {
  return String(row[key] ?? 'false').trim().toLowerCase() === 'true';
}

function normalizeDomain(url) {
  return (url ?? '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split('/')[0];
}

function extractYearsOperating(row) {
  const founded = safeInt(row.founded_year);
  if (founded == null) return null;
  const years = new Date().getUTCFullYear() - founded;
  return years < 0 ? null : years;
}

function slugify(name) {
  return (name || 'company')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'company';
}

// ---------------------------------------------------------------------------
// Profile markdown generator
// ---------------------------------------------------------------------------

function generateProfileMarkdown(row, enrichment, scored, validation) {
  const companyName = row.company_name || '(unknown)';
  const sector      = row.sector       || '(unknown)';
  const city        = row.city         || '(unknown)';
  const county      = row.county       || '(unknown)';

  const yearsOp    = enrichment.years_operating;
  const reviewCnt  = enrichment.google_review_count;
  const rating     = enrichment.google_rating;

  const evidenceUrls = (row.evidence_urls || '')
    .split(';')
    .map(u => u.trim())
    .filter(Boolean);

  const lines = [
    `# ${companyName}`,
    '',
    `**Sector:** ${sector}`,
    `**Founder:** [Unknown—needs research]`,
    `**Founded:** ${row.founded_year || '[Unknown—needs evidence]'}`,
    `**Headquarters:** ${city}, ${county}`,
    '',
    '## Business Model',
    `- ${sector} company serving institutional and commercial customers`,
    '',
    '## Why They Are Exceptional',
    `- ${scored.classification} (Score: ${scored.total_score}/100)`,
    `- Longevity: ${yearsOp != null ? yearsOp : '[Unknown]'} years of continuous operation`,
    '- Evidence-based discovery through multiple sources',
    '',
    '## Growth Indicators',
    `- Branches: ${enrichment.branches || '[Unknown]'}`,
    `- Distribution: ${enrichment.distribution_coverage || 'local'}`,
    `- Exports: ${enrichment.exports ? 'Yes' : 'No'}`,
    `- New products: ${enrichment.new_products || '[Unknown]'}`,
    '',
    '## Hidden Champion Indicators',
    `- Longevity: ${yearsOp != null ? yearsOp : '[Unknown—needs evidence]'} years`,
    `- Trust score: ${scored.trust_score}/20`,
    `- Operations score: ${scored.operations_score}/20`,
    `- Growth score: ${scored.growth_score}/20`,
    `- Invisibility score: ${scored.invisibility_score}/20`,
    '',
    `**Hidden Champion Score:** ${scored.total_score}/100 (${scored.classification})`,
    '',
    '## Evidence Links (verification sources used)',
    ...(evidenceUrls.length
      ? evidenceUrls.map(u => `- ${u}`)
      : ['- [None provided in CSV evidence_urls; mark as Needs Validation]']),
    '',
    '---',
    '## Validation Status',
    `- Status: ${validation.validation_status}`,
    `- Notes: ${validation.validation_notes}`,
    '',
    '## Scoring Breakdown',
    `- Longevity Score: ${scored.longevity_score}`,
    `- Trust Score: ${scored.trust_score}`,
    `- Operations Score: ${scored.operations_score}`,
    `- Growth Score: ${scored.growth_score}`,
    `- Invisibility Score: ${scored.invisibility_score}`,
  ];

  return lines.join('\n').trimEnd() + '\n';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  if (!existsSync(RAW_DISCOVERIES_CSV)) {
    throw new Error(`Raw discoveries CSV not found: ${RAW_DISCOVERIES_CSV}`);
  }

  const csvContent = readFileSync(RAW_DISCOVERIES_CSV, 'utf8');
  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,   // tolerate rows with fewer columns (matches Python csv.DictReader)
  });

  if (rows.length === 0) {
    console.log('No rows found in raw_discoveries.csv');
    return;
  }

  mkdirSync(PROFILES_DIR, { recursive: true });
  mkdirSync(join(REPO_ROOT, 'data', 'processed'), { recursive: true });

  const scoredRows = [];

  for (const row of rows) {
    const businessId  = row.business_id  || 'row';
    const companyName = row.company_name || 'unknown';

    const yearsOperating   = extractYearsOperating(row);
    const reviewsRating    = safeFloat(row.google_rating);
    const reviewsCount     = safeInt(row.google_review_count, 0);
    const institutionalRefs = safeInt(row.institutional_refs, 0);

    const branches             = safeInt(row.branches, 0);
    const warehouses           = safeInt(row.warehouses, 0);
    const distributionCoverage = (row.distribution_coverage || 'local').trim() || 'local';

    const newLocations  = safeInt(row.new_locations, 0);
    const hiringVisible = flagTrue(row, 'hiring_visible');
    const exports       = flagTrue(row, 'exports');
    const newProducts   = safeInt(row.new_products, 0);

    const vcFunded          = flagTrue(row, 'vc_funded');
    const acceleratorAlumni = flagTrue(row, 'accelerator_alumni');
    const mediaFeatured     = flagTrue(row, 'media_featured');
    const linkedinHeavy     = flagTrue(row, 'linkedin_heavy');
    const isStartup         = flagTrue(row, 'is_startup');

    const scored = calculateHiddenChampionScore({
      yearsOperating: yearsOperating ?? 0,
      reviewsRating,
      reviewsCount,
      institutionalRefs,
      branches,
      warehouses,
      distributionCoverage,
      newLocations,
      hiringVisible,
      exports,
      newProducts,
      vcFunded,
      acceleratorAlumni,
      mediaFeatured,
      linkedinHeavy,
      isStartup,
    });

    // ------------------------------------------------------------------
    // Validation gating  (mirrors Validation Checklist.md)
    // Statuses: Qualified | Needs Validation | Rejected
    // ------------------------------------------------------------------

    // Stage 1: Existence & operations evidence
    const websiteExists          = !!String(row.website ?? '').trim();
    const physicalLocationExists = !!(String(row.city ?? '').trim() || String(row.county ?? '').trim());
    const activeOpsEvidence      = (reviewsCount ?? 0) >= 5;
    const stage1Ok = websiteExists && physicalLocationExists && activeOpsEvidence;

    // Stage 2: Longevity
    const longevityOk = yearsOperating != null && yearsOperating >= 5;

    // Stage 3: Customer trust
    const trustOk = reviewsCount > 0 && reviewsRating != null && reviewsRating >= 4.0;

    // Exclusion checks
    const exclusionFlags = [];
    for (const key of ['vc_funded', 'accelerator_alumni', 'media_featured', 'linkedin_heavy', 'is_startup']) {
      if (flagTrue(row, key)) exclusionFlags.push(key);
    }

    let validationStatus, validationNotes;

    if (exclusionFlags.length > 0) {
      validationStatus = 'Rejected';
      validationNotes  = `Exclusion evidence confirmed: ${exclusionFlags.join(', ')}.`;
    } else if (stage1Ok && longevityOk && trustOk && scored.total_score >= 60) {
      validationStatus = 'Qualified';
      validationNotes  = 'Evidence thresholds passed for existence/operations, longevity, and customer trust; exclusions not confirmed.';
    } else {
      validationStatus = 'Needs Validation';
      const missing = [];
      if (!stage1Ok)  missing.push('Stage 1 (existence/operations)');
      if (!longevityOk) missing.push('Stage 2 (longevity)');
      if (!trustOk)   missing.push('Stage 3 (customer trust)');
      validationNotes = missing.length
        ? `Insufficient evidence for full validation. Missing: ${missing.join(', ')}`
        : 'Insufficient evidence for full validation.';
    }

    const validation = { validation_status: validationStatus, validation_notes: validationNotes };

    const enrichment = {
      years_operating:              yearsOperating,
      google_rating:                reviewsRating,
      google_review_count:          reviewsCount,
      branches,
      warehouses,
      distribution_coverage:        distributionCoverage,
      new_products:                 newProducts,
      exports,
      source_normalized_website_domain: normalizeDomain(row.website),
    };

    // Write profile markdown
    const profileMd   = generateProfileMarkdown(row, enrichment, scored, validation);
    const slug        = slugify(companyName);
    const profilePath = join(PROFILES_DIR, `${slug}.md`);
    writeFileSync(profilePath, profileMd, 'utf8');

    scoredRows.push({
      business_id:       businessId,
      company_name:      companyName,
      sector:            row.sector            || '',
      city:              row.city              || '',
      county:            row.county            || '',
      years_operating:   yearsOperating,
      longevity_score:   scored.longevity_score,
      trust_score:       scored.trust_score,
      operations_score:  scored.operations_score,
      growth_score:      scored.growth_score,
      invisibility_score: scored.invisibility_score,
      total_score:       scored.total_score,
      classification:    scored.classification,
      validation_status: validationStatus,
      scored_at:         new Date().toISOString(),
    });
  }

  // Write scored CSV
  const csvOut = stringify(scoredRows, { header: true });
  writeFileSync(OUT_SCORED_CSV, csvOut, 'utf8');

  console.log(`✓ Wrote ${scoredRows.length} scored candidates → ${OUT_SCORED_CSV}`);
  console.log(`✓ Wrote ${scoredRows.length} profiles          → ${PROFILES_DIR}`);
}

main();

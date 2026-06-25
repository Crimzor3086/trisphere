#!/usr/bin/env node
/**
 * KHC-DE Daily Discovery CLI
 *
 * Usage:
 *   node scripts/daily_discovery.js "packaging manufacturer kenya"
 *   node scripts/daily_discovery.js --import data/raw/discovery_candidates.json
 *   node scripts/daily_discovery.js --ingest '{"company_name":"Acme Ltd","sector":"Manufacturing","city":"Nairobi","county":"Nairobi","website":"https://acme.co.ke"}'
 */

import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { importFromJsonFile, ingestCandidates, REPO_ROOT } from './discovery/ingest.js';
import { runPipelineScript } from '../backend/pipeline.js';

const args = process.argv.slice(2);

function detectSector(q) {
  const lower = q.toLowerCase();
  if (lower.includes('manufactur')) return 'Manufacturing';
  if (lower.includes('logistics') || lower.includes('transport')) return 'Logistics';
  if (lower.includes('hospital') || lower.includes('medical')) return 'Healthcare';
  if (lower.includes('school') || lower.includes('education')) return 'Education';
  if (lower.includes('agro') || lower.includes('feed') || lower.includes('seed')) return 'Agriculture';
  return 'Unknown';
}

async function main() {
  if (args[0] === '--import' && args[1]) {
    const result = importFromJsonFile(args[1]);
    console.log(`Imported ${result.added.length} candidates (${result.skipped.length} skipped)`);
    console.log(`Total in raw_discoveries.csv: ${result.total}`);
    if (args.includes('--run-pipeline')) {
      const out = await runPipelineScript();
      console.log(out.stdout);
    }
    return;
  }

  if (args[0] === '--ingest' && args[1]) {
    const payload = JSON.parse(args[1]);
    const candidates = Array.isArray(payload) ? payload : payload.candidates ?? [payload];
    const result = ingestCandidates(candidates);
    console.log(`Ingested ${result.added.length} candidates (${result.skipped.length} skipped)`);
    console.log(`Total in raw_discoveries.csv: ${result.total}`);
    if (args.includes('--run-pipeline')) {
      const out = await runPipelineScript();
      console.log(out.stdout);
    }
    return;
  }

  const query = args[0];
  if (!query) {
    console.error(`Usage:
  node scripts/daily_discovery.js "<search query>"
  node scripts/daily_discovery.js --import <json-file> [--run-pipeline]
  node scripts/daily_discovery.js --ingest '<json>' [--run-pipeline]`);
    process.exit(1);
  }

  const sector = detectSector(query);
  const date = new Date().toISOString().slice(0, 10);

  console.log(`=== Daily Discovery: ${date} ===`);
  console.log(`Query:  ${query}`);
  console.log(`Sector: ${sector}`);
  console.log('');
  console.log('Research this query, then ingest findings:');
  console.log(`  node scripts/daily_discovery.js --ingest '{"company_name":"...","sector":"${sector}","city":"...","county":"...","website":"https://...","source":"Google Maps - ${query.replace(/"/g, '\\"')}"}' --run-pipeline`);
  console.log('');
  console.log('Or bulk-import from JSON:');
  console.log('  node scripts/daily_discovery.js --import data/raw/discovery_candidates.json --run-pipeline');

  const trackerDir = join(REPO_ROOT, 'data', 'research');
  const trackerPath = join(trackerDir, 'discovery_tracker.csv');
  mkdirSync(trackerDir, { recursive: true });
  appendFileSync(
    trackerPath,
    `${date},"${query.replace(/"/g, '""')}",0,,,${sector},Session started\n`,
    'utf8'
  );

  console.log('Discovery session logged.');
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});

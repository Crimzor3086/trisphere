import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import {
  getChainStatus,
  registerChampionOnChain,
  getChampionFromChain,
  getAllChampionsFromChain,
  verifyChampionOnChain,
  formatBusinessId,
  isChainConfigured,
} from './chain.js';
import { syncRegistryToChain } from './chainSync.js';
import { runPipelineScript } from './pipeline.js';
import {
  ingestCandidates,
  loadRawDiscoveries,
  getDiscoveryStats,
  RAW_DISCOVERIES_CSV,
} from '../scripts/discovery/ingest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(REPO_ROOT, '.env') });

const DATA_PROCESSED = path.join(REPO_ROOT, 'data', 'processed');
const PROFILES_DIR = path.join(REPO_ROOT, 'data', 'profiles');
const VERIFIED_DIR = path.join(REPO_ROOT, 'data', 'verified');
const PUBLIC_REGISTRY_PATH = path.join(VERIFIED_DIR, 'public_registry.json');
const SCORED_CANDIDATES_CSV = path.join(DATA_PROCESSED, 'scored_candidates.csv');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true,
  methods: '*',
  allowedHeaders: '*',
}));

app.use(express.json());

function sha256Text(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}

function ensurePublicRegistry() {
  try {
    fs.mkdirSync(VERIFIED_DIR, { recursive: true });
    if (!fs.existsSync(PUBLIC_REGISTRY_PATH)) {
      fs.writeFileSync(PUBLIC_REGISTRY_PATH, '[]', 'utf8');
    }
    return JSON.parse(fs.readFileSync(PUBLIC_REGISTRY_PATH, 'utf8'));
  } catch {
    fs.writeFileSync(PUBLIC_REGISTRY_PATH, '[]', 'utf8');
    return [];
  }
}

function writePublicRegistry(entries) {
  fs.mkdirSync(VERIFIED_DIR, { recursive: true });
  fs.writeFileSync(PUBLIC_REGISTRY_PATH, JSON.stringify(entries, null, 2), 'utf8');
}

function loadScoredCandidates() {
  if (!fs.existsSync(SCORED_CANDIDATES_CSV)) {
    throw { status: 404, message: `Missing ${SCORED_CANDIDATES_CSV}. Run POST /api/pipeline/run first.` };
  }

  const rows = parse(fs.readFileSync(SCORED_CANDIDATES_CSV, 'utf8'), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return rows.map((row, idx) => {
    const score = row.total_score;
    const parsed = score !== '' && score != null ? parseFloat(score) : null;
    return {
      id: String(idx),
      business_id: String(row.business_id ?? idx),
      company_name: String(row.company_name ?? ''),
      sector: String(row.sector ?? ''),
      location: [row.city, row.county].filter(x => x?.trim()).join(', '),
      score: parsed != null && !Number.isNaN(parsed) ? parsed : null,
      classification: row.classification,
      validation_status: row.validation_status,
    };
  });
}

function profilePathByCompanyName(companyName) {
  const safeSlug = companyName
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'company';
  const p = path.join(PROFILES_DIR, `${safeSlug}.md`);
  return fs.existsSync(p) ? p : null;
}

function parseProfileMarkdown(md) {
  const out = { profile_markdown: md };
  const m = md.match(/Hidden Champion Score:\s*([0-9]+)\/100\s*\(([^)]+)\)/);
  if (m) {
    out.score = parseInt(m[1], 10);
    out.classification = m[2].trim();
  }
  return out;
}

function updatePublicRegistryFromProfiles(candidates) {
  const entries = [];

  for (const c of candidates) {
    if (c.validation_status !== 'Qualified') continue;

    const profPath = profilePathByCompanyName(c.company_name || '');
    if (!profPath) continue;

    const md = fs.readFileSync(profPath, 'utf8');
    entries.push({
      business_id: c.business_id,
      company: c.company_name,
      sector: c.sector,
      score: c.score,
      validation_status: c.validation_status,
      profile_hash: sha256Text(md),
      timestamp: new Date().toISOString(),
    });
  }

  entries.sort(
    (a, b) =>
      (-(a.score || 0) || 0) - (-(b.score || 0) || 0) ||
      (a.company || '').localeCompare(b.company || '')
  );
  writePublicRegistry(entries);
  return entries;
}

async function maybeSyncRegistryToChain(entries) {
  if (process.env.CHAIN_AUTO_SYNC !== 'true') return null;
  if (!isChainConfigured()) {
    console.warn('CHAIN_AUTO_SYNC enabled but KHC_REGISTRY_ADDRESS not set — skipping');
    return null;
  }

  try {
    const { synced, entries: updated } = await syncRegistryToChain(entries);
    writePublicRegistry(updated);
    return synced;
  } catch (e) {
    console.error('Chain auto-sync failed:', e.message);
    return { error: e.message };
  }
}

async function refreshRegistryFromPipeline() {
  const candidates = loadScoredCandidates();
  const entries = updatePublicRegistryFromProfiles(candidates);
  const chainSync = await maybeSyncRegistryToChain(entries);
  return { entries, chainSync };
}

function discoveryEngineStatus() {
  const stats = getDiscoveryStats();
  let scored = null;
  let qualified = 0;
  let needsValidation = 0;
  let rejected = 0;

  if (fs.existsSync(SCORED_CANDIDATES_CSV)) {
    const rows = loadScoredCandidates();
    scored = rows.length;
    for (const r of rows) {
      if (r.validation_status === 'Qualified') qualified++;
      else if (r.validation_status === 'Rejected') rejected++;
      else needsValidation++;
    }
  }

  const registry = ensurePublicRegistry();

  return {
    operational: fs.existsSync(RAW_DISCOVERIES_CSV),
    raw: stats,
    scored,
    validation: { qualified, needsValidation, rejected },
    publicRegistry: registry.length,
    chainConfigured: isChainConfigured(),
    paths: {
      rawDiscoveries: RAW_DISCOVERIES_CSV,
      scoredCandidates: SCORED_CANDIDATES_CSV,
      publicRegistry: PUBLIC_REGISTRY_PATH,
    },
  };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'KHC-DE Backend',
    port: PORT,
    endpoints: {
      discovery: '/api/discovery/status',
      discover: '/api/discover',
      pipeline: 'POST /api/pipeline/run',
      registry: '/api/registry',
      chain: '/api/chain/status',
    },
  });
});

app.get('/api/discovery/status', (req, res) => {
  try {
    res.json(discoveryEngineStatus());
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});

app.get('/api/discovery/raw', (req, res) => {
  try {
    res.json({ items: loadRawDiscoveries() });
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});

app.post('/api/discovery/ingest', async (req, res) => {
  try {
    const body = req.body ?? {};
    const candidates = Array.isArray(body) ? body : body.candidates ?? [body];
    const result = ingestCandidates(candidates);

    let pipeline = null;
    let registry = null;

    if (body.runPipeline === true || req.query.runPipeline === 'true') {
      pipeline = await runPipelineScript();
      registry = await refreshRegistryFromPipeline();
    }

    res.json({ ok: true, ...result, pipeline, registry: registry?.entries?.length ?? null });
  } catch (e) {
    res.status(400).json({ detail: e.message });
  }
});

app.get('/api/discover', (req, res) => {
  try {
    res.json({ items: loadScoredCandidates() });
  } catch (e) {
    res.status(e.status || 500).json({ detail: e.message || 'Internal error' });
  }
});

app.get('/api/profile/:id', (req, res) => {
  try {
    const candidates = loadScoredCandidates();
    const idx = parseInt(req.params.id, 10);

    if (Number.isNaN(idx) || idx < 0 || idx >= candidates.length) {
      return res.status(404).json({ detail: 'Profile not found' });
    }

    const c = candidates[idx];
    const profPath = profilePathByCompanyName(c.company_name || '');

    if (!profPath) {
      return res.status(404).json({ detail: 'Profile markdown not found — run POST /api/pipeline/run' });
    }

    const parsed = parseProfileMarkdown(fs.readFileSync(profPath, 'utf8'));
    res.json({
      ...parsed,
      id: c.id,
      company: c.company_name,
      sector: c.sector,
      location: c.location,
      score: parsed.score ?? c.score,
      validation_status: c.validation_status,
    });
  } catch (e) {
    res.status(e.status || 500).json({ detail: e.message || 'Internal error' });
  }
});

app.get('/api/registry', (req, res) => {
  try {
    res.json({ items: ensurePublicRegistry() });
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});

app.post('/api/pipeline/run', async (req, res) => {
  try {
    if (!fs.existsSync(RAW_DISCOVERIES_CSV)) {
      return res.status(400).json({
        detail: `No raw discoveries at ${RAW_DISCOVERIES_CSV}. POST /api/discovery/ingest first.`,
      });
    }

    const pipeline = await runPipelineScript();
    const { entries, chainSync } = await refreshRegistryFromPipeline();

    res.json({
      ok: true,
      ...pipeline,
      registryCount: entries.length,
      chainSync,
    });
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
});

// ---------------------------------------------------------------------------
// Chain endpoints — Avalanche Fuji
// ---------------------------------------------------------------------------

app.get('/api/chain/status', async (req, res) => {
  try {
    res.json(await getChainStatus());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/chain/registry', async (req, res) => {
  try {
    const items = await getAllChampionsFromChain();
    res.json({ items, count: items.length });
  } catch (e) {
    res.status(e.message?.includes('not found') ? 503 : 500).json({ error: e.message });
  }
});

app.get('/api/chain/verify/:businessId', async (req, res) => {
  try {
    const rawId = req.params.businessId;
    const formattedId = rawId.startsWith('khc-') ? rawId : formatBusinessId(rawId);

    const offChain = ensurePublicRegistry().find(
      e => formatBusinessId(e.business_id) === formattedId || String(e.business_id) === rawId
    );

    if (!offChain) {
      return res.status(404).json({ error: 'Business not found in off-chain public registry' });
    }

    const verification = await verifyChampionOnChain(formattedId, offChain.profile_hash);
    res.json({
      offChain: {
        business_id: offChain.business_id,
        company: offChain.company,
        profile_hash: offChain.profile_hash,
        chain: offChain.chain ?? null,
      },
      ...verification,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/chain/sync', async (req, res) => {
  try {
    const entries = ensurePublicRegistry();
    if (entries.length === 0) {
      return res.json({ ok: true, message: 'Public registry is empty', synced: [] });
    }

    const { synced, entries: updated } = await syncRegistryToChain(entries);
    writePublicRegistry(updated);

    res.json({
      ok: true,
      summary: {
        registered: synced.filter(s => s.status === 'registered').length,
        already_synced: synced.filter(s => s.status === 'already_synced').length,
        errors: synced.filter(s => s.status === 'error').length,
      },
      synced,
    });
  } catch (e) {
    res.status(e.message?.includes('not configured') ? 503 : 500).json({ error: e.message });
  }
});

app.post('/api/chain/register', async (req, res) => {
  const { businessId, companyName, sector, score, profileHash } = req.body ?? {};

  if (!businessId || !companyName || !sector || score == null || !profileHash) {
    return res.status(400).json({
      error: 'Required fields: businessId, companyName, sector, score, profileHash',
    });
  }

  try {
    const chainId = String(businessId).startsWith('khc-')
      ? String(businessId)
      : formatBusinessId(businessId);
    const result = await registerChampionOnChain(chainId, companyName, sector, score, profileHash);
    res.json({ ok: true, businessId: chainId, ...result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/chain/champion/:businessId', async (req, res) => {
  try {
    const rawId = req.params.businessId;
    const chainId = rawId.startsWith('khc-') ? rawId : formatBusinessId(rawId);
    res.json(await getChampionFromChain(chainId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

function bootstrap() {
  if (!fs.existsSync(SCORED_CANDIDATES_CSV)) {
    console.log('No scored candidates yet — run POST /api/pipeline/run after ingesting discoveries');
    return;
  }

  try {
    const entries = updatePublicRegistryFromProfiles(loadScoredCandidates());
    console.log(`Public registry: ${entries.length} Qualified champion(s)`);
  } catch (e) {
    console.warn('Registry bootstrap skipped:', e.message);
  }
}

app.listen(PORT, () => {
  bootstrap();
  console.log(`KHC-DE backend → http://localhost:${PORT}`);
  console.log(`Discovery status → GET /api/discovery/status`);
  console.log(`Run pipeline     → POST /api/pipeline/run`);
  if (process.env.CHAIN_AUTO_SYNC === 'true') {
    console.log('Chain auto-sync: ENABLED');
  }
});

#!/usr/bin/env node
/** Merge deployment addresses into subsystem .env files (does not overwrite secrets). */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: path.join(ROOT, '.env') });
const manifestPath = path.join(ROOT, 'deployments/trisphere-fuji.json');

if (!fs.existsSync(manifestPath)) {
  console.error('Run node scripts/deploy-fuji-all.mjs first.');
  process.exit(1);
}

const { contracts } = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function upsertEnv(filePath, updates) {
  const lines = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').split('\n') : [];
  const map = new Map();

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    map.set(line.slice(0, idx).trim(), line.slice(idx + 1));
  }

  for (const [key, value] of Object.entries(updates)) {
    if (value) map.set(key, value);
  }

  const preservedComments = lines.filter((l) => l.trim().startsWith('#') || l.trim() === '');
  const body = [...map.entries()].map(([k, v]) => `${k}=${v}`).join('\n');
  fs.writeFileSync(filePath, `${preservedComments.join('\n')}\n${body}\n`);
  console.log(`Updated ${filePath}`);
}

upsertEnv(path.join(ROOT, 'kenyahidden-Backend/.env'), {
  KHC_REGISTRY_ADDRESS: contracts.khcRegistry,
  PORT: '5000',
});

upsertEnv(path.join(ROOT, 'trendhuntjack-backend-/.env'), {
  TREND_REGISTRY_ADDRESS: contracts.trendRegistry,
  REGISTRY_PRIVATE_KEY: process.env.PRIVATE_KEY || '',
});

upsertEnv(path.join(ROOT, 'Trisphere-Frontend/.env.local'), {
  NEXT_PUBLIC_TREND_REGISTRY_ADDRESS: contracts.trendRegistry,
  NEXT_PUBLIC_KHC_REGISTRY_ADDRESS: contracts.khcRegistry,
  NEXT_PUBLIC_BOARDY_MATCH_STAKING_ADDRESS: contracts.boardyMatchStaking,
  NEXT_PUBLIC_BOARDY_MILESTONE_ESCROW_ADDRESS: contracts.boardyMilestoneEscrow,
  NEXT_PUBLIC_BOARDY_STAKE_AMOUNT_AVAX: contracts.boardyStakeAmountAvax,
  NEXT_PUBLIC_AVALANCHE_CHAIN_ID: '43113',
  AVALANCHE_RPC_URL: process.env.RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc',
  BOARDY_OWNER_PRIVATE_KEY: process.env.PRIVATE_KEY || '',
});

console.log('Env sync complete.');

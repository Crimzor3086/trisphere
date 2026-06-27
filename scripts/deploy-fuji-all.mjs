#!/usr/bin/env node
/**
 * Deploy all TriSphere Fuji contracts and write deployments/trisphere-fuji.json
 *
 * Requires root .env with PRIVATE_KEY and RPC_URL.
 * Usage: node scripts/deploy-fuji-all.mjs
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(ROOT, '.env') });

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY;
if (!PRIVATE_KEY || !/^0x[0-9a-fA-F]{64}$/.test(PRIVATE_KEY)) {
  console.error('Set a valid PRIVATE_KEY in root .env before deploying.');
  process.exit(1);
}

const env = {
  ...process.env,
  PRIVATE_KEY,
  DEPLOYER_PRIVATE_KEY: PRIVATE_KEY,
  RPC_URL: process.env.RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc',
  FUJI_RPC_URL: process.env.RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc',
};

function run(label, cwd, command, args) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, { cwd, env, stdio: 'inherit', shell: false });
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

async function main() {
  run('Trend Hunter compile', path.join(ROOT, 'trendhuntjack-backend-'), 'npm', ['run', 'compile']);
  run('Trend Hunter deploy', path.join(ROOT, 'trendhuntjack-backend-'), 'npm', ['run', 'deploy:fuji']);

  run('KHC compile', path.join(ROOT, 'kenyahidden-Backend'), 'npm', ['run', 'compile']);
  run('KHC deploy', path.join(ROOT, 'kenyahidden-Backend'), 'npm', ['run', 'deploy:fuji']);

  run('Boardy compile', path.join(ROOT, 'boardyai-backend/contracts'), 'npm', ['run', 'compile']);
  run('Boardy deploy', path.join(ROOT, 'boardyai-backend/contracts'), 'npm', ['run', 'deploy:fuji']);

  run('Commerce compile', path.join(ROOT, 'contracts/commerce'), 'npm', ['run', 'compile']);
  run('Commerce deploy', path.join(ROOT, 'contracts/commerce'), 'npm', ['run', 'deploy:fuji']);

  const trend = readJson(path.join(ROOT, 'trendhuntjack-backend-/deployments/fuji-TrendRegistry.json'));
  const khc = readJson(path.join(ROOT, 'kenyahidden-Backend/deployments/fuji.json'));
  const boardy = readJson(path.join(ROOT, 'boardyai-backend/contracts/deployments/fuji.json'));
  const commercePath = path.join(ROOT, 'deployments/trisphere-commerce-fuji.json');
  const commerce = fs.existsSync(commercePath) ? readJson(commercePath) : { contracts: {} };

  const manifest = {
    network: 'fuji',
    chainId: 43113,
    rpcUrl: env.RPC_URL,
    explorer: 'https://testnet.snowtrace.io',
    deployedAt: new Date().toISOString(),
    deployer: trend.deployer || khc.deployer || boardy.deployer,
    contracts: {
      trendRegistry: trend.address,
      khcRegistry: khc.KHCRegistry,
      boardyMatchStaking: boardy.contracts.BoardyMatchStaking.address,
      boardyMilestoneEscrow: boardy.contracts.BoardyMilestoneEscrow.address,
      boardyStakeAmountAvax: boardy.contracts.BoardyMatchStaking.stakeAmountAvax,
      paymentEscrow: commerce.contracts?.paymentEscrow ?? '',
      treasury: commerce.contracts?.treasury ?? '',
      reputation: commerce.contracts?.reputation ?? '',
      mockUsdc: commerce.contracts?.mockUsdc ?? '',
      platformFeeBps: commerce.contracts?.platformFeeBps ?? 250,
    },
  };

  const outDir = path.join(ROOT, 'deployments');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'trisphere-fuji.json');
  fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2));

  console.log('\n=== TriSphere Fuji deployment complete ===');
  console.log(JSON.stringify(manifest.contracts, null, 2));
  console.log(`\nManifest: ${outFile}`);
  console.log('\nNext: copy addresses into subsystem .env files (see README).');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

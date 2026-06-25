/**
 * KHC-DE Blockchain Service
 * Connects to Avalanche Fuji Testnet and exposes KHCRegistry contract helpers.
 *
 * Requires:
 *   - RPC_URL           in .env  (default: Fuji public RPC)
 *   - PRIVATE_KEY       in .env  (signer for write transactions)
 *   - KHC_REGISTRY_ADDRESS  in .env  (set after running npm run deploy:fuji)
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const REPO_ROOT  = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(REPO_ROOT, '.env') });

// ---------------------------------------------------------------------------
// Fuji network constants
// ---------------------------------------------------------------------------
export const FUJI_CHAIN_ID = 43113;
export const FUJI_RPC_URL  = process.env.RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc';
export const SNOWTRACE_BASE = 'https://testnet.snowtrace.io';

/** Stable on-chain business identifier from CSV business_id. */
export function formatBusinessId(businessId) {
  return `khc-${String(businessId).trim()}`;
}

// ---------------------------------------------------------------------------
// KHCRegistry ABI (minimal — only the methods we call from the backend)
// ---------------------------------------------------------------------------
const KHC_REGISTRY_ABI = [
  'function verifyChampion(string calldata businessId, string calldata companyName, string calldata sector, uint256 score, string calldata profileHash) external',
  'function getChampion(string calldata businessId) external view returns (string companyName, string sector, uint256 validationDate, uint256 score, string profileHash, bool isVerified)',
  'function getVerifiedChampionsCount() external view returns (uint256)',
  'function getBusinessIdAtIndex(uint256 index) external view returns (string)',
  'function owner() external view returns (address)',
];

// ---------------------------------------------------------------------------
// Provider / signer (lazy-initialised singletons)
// ---------------------------------------------------------------------------

let _provider = null;
let _signer   = null;

export function getProvider() {
  if (!_provider) {
    _provider = new ethers.JsonRpcProvider(FUJI_RPC_URL, {
      chainId: FUJI_CHAIN_ID,
      name:    'avalanche-fuji',
    });
  }
  return _provider;
}

export function getSigner() {
  if (!_signer) {
    const pk = process.env.PRIVATE_KEY;
    if (!pk) throw new Error('PRIVATE_KEY not set in .env');
    _signer = new ethers.Wallet(pk, getProvider());
  }
  return _signer;
}

// ---------------------------------------------------------------------------
// Deployment address resolution
// ---------------------------------------------------------------------------

function loadDeployments() {
  // Priority 1: .env variable (set after running deploy)
  if (process.env.KHC_REGISTRY_ADDRESS) {
    return { KHCRegistry: process.env.KHC_REGISTRY_ADDRESS };
  }
  // Priority 2: deployments/fuji.json written by deploy script
  const jsonPath = path.join(REPO_ROOT, 'deployments', 'fuji.json');
  if (fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }
  return null;
}

export function getRegistryAddress() {
  const d = loadDeployments();
  if (!d?.KHCRegistry) {
    return null;
  }
  return d.KHCRegistry;
}

/** True when registry address is available (env or deployments/fuji.json). */
export function isChainConfigured() {
  return Boolean(getRegistryAddress());
}

export function getRegistryContract(withSigner = false) {
  const address = getRegistryAddress();
  if (!address) {
    throw new Error(
      'KHCRegistry address not found. ' +
      'Run `npm run deploy:fuji` first, then set KHC_REGISTRY_ADDRESS in .env'
    );
  }
  const runner  = withSigner ? getSigner() : getProvider();
  return new ethers.Contract(address, KHC_REGISTRY_ABI, runner);
}

// ---------------------------------------------------------------------------
// Chain status check
// ---------------------------------------------------------------------------

export async function getChainStatus() {
  const provider = getProvider();

  const [blockNumber, network] = await Promise.all([
    provider.getBlockNumber(),
    provider.getNetwork(),
  ]);

  const status = {
    connected:   true,
    network:     'avalanche-fuji',
    chainId:     Number(network.chainId),
    rpcUrl:      FUJI_RPC_URL,
    blockNumber,
    timestamp:   new Date().toISOString(),
  };

  // Wallet info (non-fatal if PRIVATE_KEY not set)
  try {
    const signer  = getSigner();
    const address = signer.address;
    const balance = await provider.getBalance(address);
    status.wallet = {
      address,
      balanceAVAX: ethers.formatEther(balance),
    };
  } catch {
    status.wallet = null;
  }

  // Registry info (non-fatal if not deployed yet)
  try {
    if (!isChainConfigured()) {
      status.registry = null;
    } else {
      const registry = getRegistryContract();
      const count    = await registry.getVerifiedChampionsCount();
      status.registry = {
        address:           getRegistryAddress(),
        verifiedChampions: Number(count),
        explorerUrl:       `${SNOWTRACE_BASE}/address/${getRegistryAddress()}`,
      };
    }
  } catch {
    status.registry = null;
  }

  status.chainConfigured = isChainConfigured();
  status.autoSyncEnabled = process.env.CHAIN_AUTO_SYNC === 'true';

  return status;
}

// ---------------------------------------------------------------------------
// Write: register a Qualified champion on-chain
// ---------------------------------------------------------------------------

/**
 * @param {string} businessId
 * @param {string} companyName
 * @param {string} sector
 * @param {number} score         0-100
 * @param {string} profileHash   sha256 hex
 * @returns {Promise<{ txHash: string, blockNumber: number }>}
 */
export async function registerChampionOnChain(businessId, companyName, sector, score, profileHash) {
  const registry = getRegistryContract(true); // with signer
  const tx = await registry.verifyChampion(businessId, companyName, sector, BigInt(score), profileHash);
  const receipt = await tx.wait();
  return {
    txHash:          receipt.hash,
    blockNumber:     receipt.blockNumber,
    registryAddress: getRegistryAddress(),
    explorerUrl:     `${SNOWTRACE_BASE}/tx/${receipt.hash}`,
  };
}

// ---------------------------------------------------------------------------
// Read: get a single champion from chain
// ---------------------------------------------------------------------------

export async function getChampionFromChain(businessId) {
  const registry = getRegistryContract();
  const result   = await registry.getChampion(businessId);
  return {
    businessId,
    companyName:    result[0],
    sector:         result[1],
    validationDate: Number(result[2]),
    score:          Number(result[3]),
    profileHash:    result[4],
    isVerified:     result[5],
  };
}

// ---------------------------------------------------------------------------
// Read: enumerate all champions on-chain
// ---------------------------------------------------------------------------

export async function getAllChampionsFromChain() {
  const registry = getRegistryContract();
  const count    = Number(await registry.getVerifiedChampionsCount());
  const items    = [];

  for (let i = 0; i < count; i++) {
    const businessId = await registry.getBusinessIdAtIndex(i);
    items.push(await getChampionFromChain(businessId));
  }

  return items;
}

// ---------------------------------------------------------------------------
// Verify: compare off-chain profile hash with on-chain record
// ---------------------------------------------------------------------------

export async function verifyChampionOnChain(businessId, expectedProfileHash) {
  const onChain = await getChampionFromChain(businessId);

  if (!onChain.isVerified) {
    return {
      businessId,
      verified: false,
      onChain:  null,
      match:    false,
      message:  'Champion is not registered on-chain',
    };
  }

  const match = onChain.profileHash.toLowerCase() === String(expectedProfileHash).toLowerCase();

  return {
    businessId,
    verified: true,
    onChain,
    match,
    message: match
      ? 'Off-chain profile hash matches on-chain record'
      : 'Profile hash mismatch — on-chain record may be stale',
  };
}

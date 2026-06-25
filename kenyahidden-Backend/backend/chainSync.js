/**
 * Syncs off-chain public registry entries to KHCRegistry on Avalanche Fuji.
 */

import {
  formatBusinessId,
  isChainConfigured,
  getChampionFromChain,
  registerChampionOnChain,
  verifyChampionOnChain,
} from './chain.js';

/**
 * Register a single registry entry on-chain if missing or hash differs.
 * @param {object} entry — public_registry.json row
 * @returns {Promise<object>}
 */
export async function syncEntryToChain(entry) {
  const businessId = formatBusinessId(entry.business_id);

  if (!entry.profile_hash) {
    return { businessId, status: 'skipped', reason: 'missing profile_hash' };
  }

  let onChain;
  try {
    onChain = await getChampionFromChain(businessId);
  } catch (e) {
    return { businessId, status: 'error', error: e.message };
  }

  if (onChain.isVerified) {
    const hashMatch = onChain.profileHash.toLowerCase() === entry.profile_hash.toLowerCase();
    if (hashMatch) {
      return {
        businessId,
        status: 'already_synced',
        txHash: entry.chain?.tx_hash ?? null,
        onChain,
      };
    }
  }

  try {
    const result = await registerChampionOnChain(
      businessId,
      entry.company,
      entry.sector,
      Math.round(entry.score ?? 0),
      entry.profile_hash,
    );

    return {
      businessId,
      status: 'registered',
      ...result,
    };
  } catch (e) {
    return { businessId, status: 'error', error: e.message };
  }
}

/**
 * Sync all Qualified entries from the public registry to chain.
 * Updates each entry's `chain` metadata on success.
 * @param {object[]} entries — mutable registry array
 * @returns {Promise<{ synced: object[], entries: object[] }>}
 */
export async function syncRegistryToChain(entries) {
  if (!isChainConfigured()) {
    throw new Error(
      'Blockchain not configured. Deploy contracts and set KHC_REGISTRY_ADDRESS in .env'
    );
  }

  if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY not set in .env — required for on-chain registration');
  }

  const synced = [];

  for (const entry of entries) {
    const result = await syncEntryToChain(entry);
    synced.push(result);

    if (result.status === 'registered') {
      entry.chain = {
        business_id:      result.businessId,
        registry_address: result.registryAddress,
        tx_hash:          result.txHash,
        block_number:     result.blockNumber,
        explorer_url:     result.explorerUrl,
        synced_at:        new Date().toISOString(),
      };
    } else if (result.status === 'already_synced' && entry.chain?.tx_hash) {
      entry.chain = {
        ...entry.chain,
        business_id: result.businessId,
        verified_at: new Date().toISOString(),
      };
    }
  }

  return { synced, entries };
}

/**
 * Verify one registry entry against its on-chain record.
 * @param {object} entry
 */
export async function verifyRegistryEntry(entry) {
  if (!isChainConfigured()) {
    throw new Error('Blockchain not configured');
  }

  const businessId = formatBusinessId(entry.business_id);
  return verifyChampionOnChain(businessId, entry.profile_hash);
}

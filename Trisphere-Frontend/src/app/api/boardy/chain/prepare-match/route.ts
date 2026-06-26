import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { BOARDY_MATCH_STAKING_ABI } from '@/lib/abis/boardyMatchStaking';
import { getTriSphereContracts } from '@/lib/contracts';

const FUJI_RPC = process.env.AVALANCHE_RPC_URL ?? 'https://api.avax-test.network/ext/bc/C/rpc';

function getOwnerWallet() {
  const pk = process.env.BOARDY_OWNER_PRIVATE_KEY ?? process.env.PRIVATE_KEY;
  if (!pk) throw new Error('BOARDY_OWNER_PRIVATE_KEY or PRIVATE_KEY not configured');
  const provider = new ethers.JsonRpcProvider(FUJI_RPC, 43113);
  return new ethers.Wallet(pk, provider);
}

export async function POST(request: Request) {
  try {
    const { walletAddress, profileId } = await request.json();
    if (!walletAddress || profileId == null) {
      return NextResponse.json({ error: 'walletAddress and profileId required' }, { status: 400 });
    }

    const { boardyMatchStaking: address } = getTriSphereContracts();
    if (!address) {
      return NextResponse.json({ error: 'BoardyMatchStaking address not configured' }, { status: 503 });
    }

    const owner = getOwnerWallet();
    const counterparty = process.env.BOARDY_COUNTERPARTY_ADDRESS ?? owner.address;
    const matchId = ethers.id(`boardy-match-${profileId}`);
    const contract = new ethers.Contract(address, BOARDY_MATCH_STAKING_ABI, owner);

    const existing = await contract.matches(matchId);
    if (existing.userA === ethers.ZeroAddress) {
      const tx = await contract.createMatch(matchId, walletAddress, counterparty);
      await tx.wait();
    }

    return NextResponse.json({
      matchId,
      stakingAddress: address,
      counterparty,
      stakeAmountAvax: getTriSphereContracts().boardyStakeAmountAvax,
      explorer: `https://testnet.snowtrace.io/address/${address}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'prepare-match failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

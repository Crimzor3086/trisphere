import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { BOARDY_MATCH_STAKING_ABI } from '@/lib/abis/boardyMatchStaking';
import { getTriSphereContracts } from '@/lib/contracts';

const FUJI_RPC = process.env.AVALANCHE_RPC_URL ?? 'https://api.avax-test.network/ext/bc/C/rpc';
const MatchStatus = { Pending: 0, StakedA: 1, StakedB: 2, Unlocked: 3 } as const;

function getOwnerWallet() {
  const pk = process.env.BOARDY_OWNER_PRIVATE_KEY ?? process.env.PRIVATE_KEY;
  if (!pk) throw new Error('BOARDY_OWNER_PRIVATE_KEY or PRIVATE_KEY not configured');
  const provider = new ethers.JsonRpcProvider(FUJI_RPC, 43113);
  return new ethers.Wallet(pk, provider);
}

/** Counter-stake as userB after userA has staked — unlocks match on Fuji. */
export async function POST(request: Request) {
  try {
    const { matchId } = await request.json();
    if (!matchId) {
      return NextResponse.json({ error: 'matchId required' }, { status: 400 });
    }

    const { boardyMatchStaking: address, boardyStakeAmountAvax } = getTriSphereContracts();
    if (!address) {
      return NextResponse.json({ error: 'BoardyMatchStaking address not configured' }, { status: 503 });
    }

    const owner = getOwnerWallet();
    const contract = new ethers.Contract(address, BOARDY_MATCH_STAKING_ABI, owner);
    const stakeAmount = await contract.stakeAmount();
    const match = await contract.matches(matchId);

    if (Number(match.status) === MatchStatus.Unlocked) {
      return NextResponse.json({ ok: true, status: 'Unlocked', alreadyUnlocked: true });
    }

    if (Number(match.status) === MatchStatus.StakedA) {
      const tx = await contract.stake(matchId, { value: stakeAmount });
      const receipt = await tx.wait();
      return NextResponse.json({
        ok: true,
        status: 'Unlocked',
        txHash: receipt.hash,
        stakeAmountAvax: boardyStakeAmountAvax,
      });
    }

    return NextResponse.json(
      { error: `Match not ready for counter-stake (status ${match.status})` },
      { status: 409 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'complete-match failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

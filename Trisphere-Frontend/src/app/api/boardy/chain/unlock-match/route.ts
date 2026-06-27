import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { BOARDY_MATCH_STAKING_ABI } from '@/lib/abis/boardyMatchStaking';
import { getTriSphereContracts } from '@/lib/contracts';

const FUJI_RPC = process.env.AVALANCHE_RPC_URL ?? 'https://api.avax-test.network/ext/bc/C/rpc';
const MatchStatus = { Pending: 0, StakedA: 1, StakedB: 2, Unlocked: 3 } as const;

/** Verify on-chain match is Unlocked, then provision Boardy chat room. */
export async function POST(request: Request) {
  try {
    const { matchId, userId, profileId } = await request.json();
    if (!matchId || userId == null) {
      return NextResponse.json({ error: 'matchId and userId required' }, { status: 400 });
    }

    const { boardyMatchStaking: address } = getTriSphereContracts();
    if (!address) {
      return NextResponse.json({ error: 'BoardyMatchStaking address not configured' }, { status: 503 });
    }

    const provider = new ethers.JsonRpcProvider(FUJI_RPC, 43113);
    const contract = new ethers.Contract(address, BOARDY_MATCH_STAKING_ABI, provider);
    const match = await contract.matches(matchId);

    if (Number(match.status) !== MatchStatus.Unlocked) {
      return NextResponse.json(
        { error: `Match not unlocked on-chain (status ${match.status})` },
        { status: 409 },
      );
    }

    const boardyApi = process.env.BOARDY_API_URL ?? 'http://localhost:4000';
    const dbMatchId = profileId ?? userId;
    const response = await fetch(`${boardyApi}/api/matches/${dbMatchId}/confirm-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        chain_match_id: matchId,
        chain_verified: true,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json({ error: err.error || 'Backend unlock failed' }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json({
      ok: true,
      chainStatus: 'Unlocked',
      chatRoomId: data.chat_room_id,
      explorer: `https://testnet.snowtrace.io/tx/${matchId}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unlock-match failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

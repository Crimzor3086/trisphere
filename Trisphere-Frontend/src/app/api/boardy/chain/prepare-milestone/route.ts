import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { BOARDY_MILESTONE_ESCROW_ABI } from '@/lib/abis/boardyMilestoneEscrow';
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
    const { payerAddress, payeeAddress, amountAvax, description, roomId } = await request.json();
    if (!payerAddress || !payeeAddress || !amountAvax) {
      return NextResponse.json({ error: 'payerAddress, payeeAddress, amountAvax required' }, { status: 400 });
    }

    const { boardyMilestoneEscrow: address } = getTriSphereContracts();
    if (!address) {
      return NextResponse.json({ error: 'BoardyMilestoneEscrow address not configured' }, { status: 503 });
    }

    const milestoneId = ethers.id(`boardy-milestone-${roomId}-${Date.now()}`);
    const amountWei = ethers.parseEther(String(amountAvax));
    const owner = getOwnerWallet();
    const contract = new ethers.Contract(address, BOARDY_MILESTONE_ESCROW_ABI, owner);

    const existing = await contract.milestones(milestoneId);
    if (existing.payer === ethers.ZeroAddress) {
      const tx = await contract.createMilestone(
        milestoneId,
        payerAddress,
        payeeAddress,
        amountWei,
        description || 'Deliverable milestone',
      );
      await tx.wait();
    }

    return NextResponse.json({
      milestoneId,
      escrowAddress: address,
      amountAvax: String(amountAvax),
      amountWei: amountWei.toString(),
      explorer: `https://testnet.snowtrace.io/address/${address}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'prepare-milestone failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

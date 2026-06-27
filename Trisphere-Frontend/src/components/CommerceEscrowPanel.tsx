'use client';

import { useState, useEffect } from 'react';
import { useActiveAccount, useSendTransaction } from 'thirdweb/react';
import { getContract, prepareContractCall, readContract } from 'thirdweb';
import { parseUnits, formatUnits } from 'ethers';
import { client } from '@/integrations/boardy/client';
import { avalancheFuji } from '@/lib/chains';
import { getTriSphereContracts } from '@/lib/contracts';
import { PAYMENT_ESCROW_ABI } from '@/lib/abis/paymentEscrow';
import { MOCK_USDC_ABI } from '@/lib/abis/mockUsdc';
import ConnectWalletButton from '@/components/ConnectWalletButton';

export default function CommerceEscrowPanel() {
  const account = useActiveAccount();
  const { mutateAsync: sendTx, isPending } = useSendTransaction();
  const contracts = getTriSphereContracts();

  const [payee, setPayee] = useState('');
  const [amountUsdc, setAmountUsdc] = useState('100');
  const [description, setDescription] = useState('Trend-based marketing campaign');
  const [escrowId, setEscrowId] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [txNote, setTxNote] = useState('');
  const [usdcBalance, setUsdcBalance] = useState<bigint | null>(null);

  useEffect(() => {
    async function loadBalance() {
      if (!account?.address || !contracts.mockUsdc) return;
      const usdc = getContract({ client, chain: avalancheFuji, address: contracts.mockUsdc, abi: MOCK_USDC_ABI });
      const bal = await readContract({ contract: usdc, method: 'balanceOf', params: [account.address] });
      setUsdcBalance(bal as bigint);
    }
    loadBalance().catch(console.error);
  }, [account?.address, contracts.mockUsdc, step, isPending]);

  const mintTestUsdc = async () => {
    if (!account?.address || !contracts.mockUsdc) return;
    const contract = getContract({ client, chain: avalancheFuji, address: contracts.mockUsdc, abi: MOCK_USDC_ABI });
    const tx = prepareContractCall({
      contract,
      method: 'mint',
      params: [account.address, parseUnits('1000', 6)],
    });
    await sendTx(tx);
    setTxNote('Minted 1,000 test USDC on Fuji.');
  };

  const createAndFund = async () => {
    if (!account?.address || !contracts.paymentEscrow || !contracts.mockUsdc) {
      alert('Connect wallet and deploy commerce contracts first.');
      return;
    }
    if (!payee) {
      alert('Enter creator wallet address.');
      return;
    }

    const amount = parseUnits(amountUsdc, 6);
    const usdc = getContract({ client, chain: avalancheFuji, address: contracts.mockUsdc, abi: MOCK_USDC_ABI });
    const escrow = getContract({
      client,
      chain: avalancheFuji,
      address: contracts.paymentEscrow,
      abi: PAYMENT_ESCROW_ABI,
    });

    await sendTx(
      prepareContractCall({
        contract: usdc,
        method: 'approve',
        params: [contracts.paymentEscrow, amount],
      }),
    );

    await sendTx(
      prepareContractCall({
        contract: escrow,
        method: 'createEscrow',
        params: [payee, contracts.mockUsdc, amount, description],
      }),
    );

    const nextId = (await readContract({ contract: escrow, method: 'nextId' })) as bigint;
    const id = Number(nextId) - 1;
    setEscrowId(id);

    await sendTx(
      prepareContractCall({
        contract: escrow,
        method: 'fundEscrow',
        params: [BigInt(id)],
      }),
    );

    setStep(1);
    setTxNote(`Escrow #${id} funded with ${amountUsdc} USDC on Avalanche Fuji.`);
  };

  const approveMilestone = async () => {
    if (escrowId == null || !contracts.paymentEscrow) return;
    const escrow = getContract({
      client,
      chain: avalancheFuji,
      address: contracts.paymentEscrow,
      abi: PAYMENT_ESCROW_ABI,
    });
    await sendTx(
      prepareContractCall({ contract: escrow, method: 'approveMilestone', params: [BigInt(escrowId)] }),
    );
    setStep(2);
    setTxNote('Work approved — ready to release payment.');
  };

  const releaseFunds = async () => {
    if (escrowId == null || !contracts.paymentEscrow) return;
    const escrow = getContract({
      client,
      chain: avalancheFuji,
      address: contracts.paymentEscrow,
      abi: PAYMENT_ESCROW_ABI,
    });
    await sendTx(
      prepareContractCall({ contract: escrow, method: 'releaseFunds', params: [BigInt(escrowId)] }),
    );
    setStep(3);
    setTxNote('Payment released — creator paid, platform fee to treasury, reputation updated on-chain.');
  };

  const balanceLabel = usdcBalance != null ? `${formatUnits(usdcBalance, 6)} USDC` : '—';

  return (
    <div className="mi-panel space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-highlight/80">Payment layer</p>
          <h2 className="text-2xl font-semibold text-white">USDC creator escrow</h2>
          <p className="mt-1 text-sm text-muted">Real PaymentEscrow on Avalanche Fuji — no mocks.</p>
        </div>
        <ConnectWalletButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {['Create & fund', 'Approve deliverable', 'Release payment'].map((label, i) => (
          <div
            key={label}
            className={`rounded-2xl border p-4 ${step >= i ? 'border-highlight/50 bg-highlight/5' : 'border-border/60 bg-card/40'}`}
          >
            <p className="text-xs text-muted">Step {i + 1}</p>
            <p className="font-medium text-white">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted">
        Wallet balance: <span className="text-white">{balanceLabel}</span>
        {contracts.mockUsdc && (
          <button type="button" onClick={mintTestUsdc} disabled={isPending || !account} className="ml-3 rounded-full border border-border px-3 py-1 text-xs text-foreground/90">
            Mint test USDC
          </button>
        )}
      </p>

      {step === 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted">Creator wallet</span>
            <input
              className="mt-1 w-full rounded-xl border border-border/80 bg-midnight px-3 py-2 text-white"
              placeholder="0x…"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted">Amount (USDC)</span>
            <input
              className="mt-1 w-full rounded-xl border border-border/80 bg-midnight px-3 py-2 text-white"
              value={amountUsdc}
              onChange={(e) => setAmountUsdc(e.target.value)}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-muted">Campaign description</span>
            <input
              className="mt-1 w-full rounded-xl border border-border/80 bg-midnight px-3 py-2 text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <button
            type="button"
            disabled={isPending || !account}
            onClick={createAndFund}
            className="mi-btn-primary sm:col-span-2"
          >
            {isPending ? 'Confirm in wallet…' : 'Create escrow & deposit USDC'}
          </button>
        </div>
      )}

      {step === 1 && (
        <button type="button" disabled={isPending} onClick={approveMilestone} className="mi-btn-primary">
          Approve milestone (company)
        </button>
      )}

      {step === 2 && (
        <button type="button" disabled={isPending} onClick={releaseFunds} className="mi-btn-primary">
          Release funds to creator
        </button>
      )}

      {step === 3 && (
        <p className="rounded-xl border border-secondary/30 bg-secondary/10 p-4 text-sm text-secondary">
          Demo journey complete: insight → verified escrow → USDC settlement → on-chain reputation.
        </p>
      )}

      {txNote && <p className="text-xs text-muted">{txNote}</p>}

      {!contracts.paymentEscrow && (
        <p className="text-sm text-amber-400/90">
          Run npm run deploy:fuji && npm run sync:env from repo root to deploy PaymentEscrow.
        </p>
      )}
    </div>
  );
}

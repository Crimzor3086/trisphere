'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useActiveAccount } from 'thirdweb/react';
import { readContract } from 'thirdweb';
import { getContract } from 'thirdweb';
import { client } from '@/integrations/boardy/client';
import { avalancheFuji } from '@/lib/chains';
import { getTriSphereContracts } from '@/lib/contracts';
import { TRISPHERE_REPUTATION_ABI } from '@/lib/abis/triSphereReputation';
import { REPUTATION_METRIC_IDS } from '@/lib/reputation';
import ConnectWalletButton from '@/components/ConnectWalletButton';

type Badge = { name: string; count: number; colorClass: string; metricKey?: string };

const badgeDefs: Badge[] = [
  { name: 'Payments', count: 0, colorClass: 'bg-highlight/10 text-highlight', metricKey: REPUTATION_METRIC_IDS.PAYMENTS_COMPLETED },
  { name: 'Escrows funded', count: 0, colorClass: 'bg-primary/10 text-primary', metricKey: REPUTATION_METRIC_IDS.ESCROWS_FUNDED },
  { name: 'Trend Scout', count: 0, colorClass: 'bg-secondary/10 text-secondary' },
  { name: 'Connector', count: 0, colorClass: 'bg-accent/10 text-accent' },
];

export default function RewardsPage() {
  const account = useActiveAccount();
  const contracts = getTriSphereContracts();
  const [badges, setBadges] = useState(badgeDefs);
  const [totalScore, setTotalScore] = useState<number | null>(null);

  useEffect(() => {
    async function loadReputation() {
      if (!account?.address || !contracts.reputation) return;

      const rep = getContract({
        client,
        chain: avalancheFuji,
        address: contracts.reputation,
        abi: TRISPHERE_REPUTATION_ABI,
      });

      const score = (await readContract({ contract: rep, method: 'totalScore', params: [account.address] })) as bigint;
      setTotalScore(Number(score));

      const updated = await Promise.all(
        badgeDefs.map(async (badge) => {
          if (!badge.metricKey) return badge;
          const val = (await readContract({
            contract: rep,
            method: 'metric',
            params: [account.address, badge.metricKey as `0x${string}`],
          })) as bigint;
          return { ...badge, count: Number(val) };
        }),
      );
      setBadges(updated);
    }

    loadReputation().catch(console.error);
  }, [account?.address, contracts.reputation]);

  return (
    <main className="min-h-screen bg-midnight text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-primary/80">Reputation layer</p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">On-chain contributor score</h1>
            <p className="max-w-3xl text-lg leading-8 text-muted">
              TriSphereReputation on Avalanche Fuji — earned from completed escrows, validations, and marketplace activity. Connect your wallet to read live scores.
            </p>
            {totalScore != null && (
              <p className="text-2xl font-semibold text-white">
                Total score: <span className="text-highlight">{totalScore}</span>
              </p>
            )}
          </div>
          <ConnectWalletButton />
        </header>

        {!contracts.reputation && (
          <p className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Deploy commerce contracts (npm run deploy:fuji) to enable live reputation reads.
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="rounded-3xl border border-border/80 bg-card/80 p-6 text-center shadow-xl shadow-black/30"
            >
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl ${badge.colorClass}`}>
                {badge.name.charAt(0)}
              </div>
              <p className="font-semibold text-white">{badge.name}</p>
              <p className="mt-2 text-sm text-muted">
                {account?.address ? `Score: ${badge.count}` : 'Connect wallet'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

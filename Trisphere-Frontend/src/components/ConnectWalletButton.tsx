'use client';

import { ConnectButton } from 'thirdweb/react';
import { createWallet, inAppWallet } from 'thirdweb/wallets';
import { client } from '@/integrations/boardy/client';
import { avalancheFuji } from '@/lib/chains';

const wallets = [
  inAppWallet({
    auth: { options: ['google', 'email', 'apple'] },
  }),
  createWallet('io.metamask'),
  createWallet('io.rabby'),
];

export default function ConnectWalletButton() {
  return (
    <ConnectButton
      client={client}
      chain={avalancheFuji}
      chains={[avalancheFuji]}
      wallets={wallets}
      theme="dark"
      connectButton={{
        label: 'Connect Wallet',
        className:
          '!rounded-full !border !border-slate-800/80 !bg-slate-900/80 !px-4 !py-2 !text-sm !text-slate-200 hover:!border-sky-400 hover:!text-white',
      }}
      connectModal={{
        size: 'wide',
        title: 'Connect to Avalanche Fuji',
        titleIcon: '',
      }}
    />
  );
}

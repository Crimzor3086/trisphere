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
          '!rounded-full !border !border-border/80 !bg-card/80 !px-4 !py-2 !text-sm !text-foreground/90 hover:!border-primary hover:!text-foreground',
      }}
      connectModal={{
        size: 'wide',
        title: 'Connect to Avalanche Fuji',
        titleIcon: '',
      }}
    />
  );
}

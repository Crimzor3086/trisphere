'use client';

import { ThirdwebProvider } from 'thirdweb/react';

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
}

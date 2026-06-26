import { defineChain } from 'thirdweb/chains';

export const AVALANCHE_FUJI_CHAIN_ID = 43113;

export const avalancheFuji = defineChain({
  id: AVALANCHE_FUJI_CHAIN_ID,
  name: 'Avalanche Fuji',
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  rpc: process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL ?? 'https://api.avax-test.network/ext/bc/C/rpc',
  blockExplorers: [{ name: 'Snowtrace', url: 'https://testnet.snowtrace.io' }],
  testnet: true,
});

export const SNOWTRACE_BASE = 'https://testnet.snowtrace.io';

export function snowtraceAddress(address: string) {
  return `${SNOWTRACE_BASE}/address/${address}`;
}

export function snowtraceTx(hash: string) {
  return `${SNOWTRACE_BASE}/tx/${hash}`;
}

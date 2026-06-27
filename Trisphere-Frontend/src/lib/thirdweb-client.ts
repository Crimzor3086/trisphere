import { createThirdwebClient, type ThirdwebClient } from 'thirdweb';

/** Public TriSphere demo client — override with NEXT_PUBLIC_THIRDWEB_CLIENT_ID in production. */
const DEFAULT_CLIENT_ID = 'e6f3b0b3a82babc9ae65be1c880236e9';

export function resolveThirdwebClientId(): string {
  const fromEnv = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID?.trim();
  return fromEnv || DEFAULT_CLIENT_ID;
}

let cached: ThirdwebClient | undefined;

export function getThirdwebClient(): ThirdwebClient {
  if (!cached) {
    cached = createThirdwebClient({ clientId: resolveThirdwebClientId() });
  }
  return cached;
}

/** Shared Thirdweb client for wallet + contract reads. */
export const client = getThirdwebClient();

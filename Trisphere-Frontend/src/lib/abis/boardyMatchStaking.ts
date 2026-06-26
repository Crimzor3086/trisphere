export const BOARDY_MATCH_STAKING_ABI = [
  {
    type: 'function',
    name: 'createMatch',
    inputs: [
      { name: 'matchId', type: 'bytes32' },
      { name: 'userA', type: 'address' },
      { name: 'userB', type: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'stake',
    inputs: [{ name: 'matchId', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'stakeAmount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'matches',
    inputs: [{ name: 'matchId', type: 'bytes32' }],
    outputs: [
      { name: 'userA', type: 'address' },
      { name: 'userB', type: 'address' },
      { name: 'status', type: 'uint8' },
      { name: 'withdrawnA', type: 'bool' },
      { name: 'withdrawnB', type: 'bool' },
    ],
    stateMutability: 'view',
  },
] as const;

export function boardyMatchId(profileId: string | number) {
  // Deterministic match id for demo / MVP staking flow
  const input = `boardy-match-${profileId}`;
  let hash = 0n;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 256n + BigInt(input.charCodeAt(i))) & (2n ** 256n - 1n);
  }
  return `0x${hash.toString(16).padStart(64, '0')}` as `0x${string}`;
}

/** keccak256 via ethers-compatible id — used server-side; client uses API prepare. */
export function boardyMatchIdHex(profileId: string | number) {
  return boardyMatchId(profileId);
}

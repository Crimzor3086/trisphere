export const TRISPHERE_REPUTATION_ABI = [
  {
    type: 'function',
    name: 'totalScore',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'metric',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'metricKey', type: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

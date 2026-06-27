export const BOARDY_MILESTONE_ESCROW_ABI = [
  {
    type: 'function',
    name: 'createMilestone',
    inputs: [
      { name: 'milestoneId', type: 'bytes32' },
      { name: 'payer', type: 'address' },
      { name: 'payee', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'description', type: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'fundMilestone',
    inputs: [{ name: 'milestoneId', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'markCompleted',
    inputs: [{ name: 'milestoneId', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'release',
    inputs: [{ name: 'milestoneId', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'refund',
    inputs: [{ name: 'milestoneId', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getMilestone',
    inputs: [{ name: 'milestoneId', type: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'payer', type: 'address' },
          { name: 'payee', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'description', type: 'string' },
          { name: 'status', type: 'uint8' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'milestones',
    inputs: [{ name: 'milestoneId', type: 'bytes32' }],
    outputs: [
      { name: 'payer', type: 'address' },
      { name: 'payee', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'description', type: 'string' },
      { name: 'status', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
] as const;

export const MilestoneStatus = {
  Proposed: 0,
  Funded: 1,
  Completed: 2,
  Released: 3,
  Refunded: 4,
  Disputed: 5,
} as const;

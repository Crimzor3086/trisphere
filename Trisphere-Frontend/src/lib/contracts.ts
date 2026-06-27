const fallback = {
  trendRegistry: '',
  khcRegistry: '',
  boardyMatchStaking: '',
  boardyMilestoneEscrow: '',
  boardyStakeAmountAvax: '0.01',
  paymentEscrow: '',
  treasury: '',
  reputation: '',
  mockUsdc: '',
  platformFeeBps: '250',
};

export function getTriSphereContracts() {
  return {
    trendRegistry: process.env.NEXT_PUBLIC_TREND_REGISTRY_ADDRESS ?? fallback.trendRegistry,
    khcRegistry: process.env.NEXT_PUBLIC_KHC_REGISTRY_ADDRESS ?? fallback.khcRegistry,
    boardyMatchStaking: process.env.NEXT_PUBLIC_BOARDY_MATCH_STAKING_ADDRESS ?? fallback.boardyMatchStaking,
    boardyMilestoneEscrow: process.env.NEXT_PUBLIC_BOARDY_MILESTONE_ESCROW_ADDRESS ?? fallback.boardyMilestoneEscrow,
    boardyStakeAmountAvax: process.env.NEXT_PUBLIC_BOARDY_STAKE_AMOUNT_AVAX ?? fallback.boardyStakeAmountAvax,
    paymentEscrow: process.env.NEXT_PUBLIC_PAYMENT_ESCROW_ADDRESS ?? fallback.paymentEscrow,
    treasury: process.env.NEXT_PUBLIC_TRISPHERE_TREASURY_ADDRESS ?? fallback.treasury,
    reputation: process.env.NEXT_PUBLIC_TRISPHERE_REPUTATION_ADDRESS ?? fallback.reputation,
    mockUsdc: process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS ?? fallback.mockUsdc,
    platformFeeBps: process.env.NEXT_PUBLIC_PLATFORM_FEE_BPS ?? fallback.platformFeeBps,
  };
}

export function contractsConfigured() {
  const c = getTriSphereContracts();
  return Boolean(c.trendRegistry || c.khcRegistry || c.boardyMatchStaking);
}

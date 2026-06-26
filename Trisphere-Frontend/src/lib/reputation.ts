import { id } from 'ethers';

export const REPUTATION_METRIC_IDS = {
  PAYMENTS_COMPLETED: id('PAYMENTS_COMPLETED'),
  ESCROWS_FUNDED: id('ESCROWS_FUNDED'),
  TRENDS_REGISTERED: id('TRENDS_REGISTERED'),
  CHAMPIONS_REGISTERED: id('CHAMPIONS_REGISTERED'),
} as const;

export function reputationMetricLabel(key: string): string {
  const labels: Record<string, string> = {
    [REPUTATION_METRIC_IDS.PAYMENTS_COMPLETED]: 'Payments completed',
    [REPUTATION_METRIC_IDS.ESCROWS_FUNDED]: 'Escrows funded',
    [REPUTATION_METRIC_IDS.TRENDS_REGISTERED]: 'Trends registered',
    [REPUTATION_METRIC_IDS.CHAMPIONS_REGISTERED]: 'Champions registered',
  };
  return labels[key] ?? 'Contribution';
}

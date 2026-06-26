# TriSphere Blockchain Layer — Avalanche Business Infrastructure

TriSphere uses Avalanche Fuji (C-Chain) as **settlement and trust infrastructure** — not merely hash storage. Every on-chain interaction reduces business friction, improves trust, automates payments, or builds portable reputation.

## Architecture

```text
TriSphere Platform (port 3000)
        │
        ├── Verification — TrendRegistry, KHCRegistry
        ├── Payments — PaymentEscrow + MockUSDC (Fuji testnet)
        ├── Reputation — TriSphereReputation
        ├── Escrow — BoardyMilestoneEscrow (AVAX milestones)
        └── Identity / matching — BoardyMatchStaking
```

## Deployed contracts (Fuji)

After `npm run deploy:fuji && npm run sync:env` from repo root, addresses live in `deployments/trisphere-fuji.json`.

| Contract | Purpose |
|----------|---------|
| `TrendRegistry` | Immutable trend proofs |
| `KHCRegistry` | Verified Hidden Champion records |
| `BoardyMatchStaking` | Bilateral AVAX commitment stakes |
| `BoardyMilestoneEscrow` | AVAX deliverable escrow (Matches chat) |
| `PaymentEscrow` | USDC milestone payments + platform fee |
| `TriSphereTreasury` | Platform revenue (report sales, fees) |
| `TriSphereReputation` | Contributor scores |
| `MockUSDC` | Fuji test settlement token (6 decimals) |

## User journeys (live — no mocks)

### Demo-day commerce flow (`/commerce`)

1. Detect trend → `/trends`
2. Verify company/trend → `/champions` (KHC chain panel)
3. Match & stake → `/matches` (BoardyMatchStaking on Fuji)
4. **USDC escrow** → `/commerce` (PaymentEscrow: create → fund → approve → release)
5. **Reputation** → `/rewards` (reads TriSphereReputation for connected wallet)

### Matches milestone escrow

In Boardy chat rooms, **Create AVAX escrow milestone** calls:

- `POST /api/boardy/chain/prepare-milestone` (owner registers milestone)
- Wallet: `fundMilestone` → `markCompleted` → `release`

Chat messages use Boardy REST API (`/api/chat_rooms/:id/messages`) — no simulated counterparty.

### Match unlock

After user stakes AVAX, TriSphere verifies on-chain `Unlocked` status via `/api/boardy/chain/unlock-match` before provisioning the chat room. Boardy backend rejects unlock without `chain_verified: true`.

## Token flow

```text
Customer → USDC (MockUSDC on Fuji) → PaymentEscrow
         → Creator (minus 2.5% fee) → TriSphereTreasury
         → TriSphereReputation (payer + payee)
```

AVAX milestones follow a parallel path through `BoardyMilestoneEscrow`.

## Commands

```bash
# Deploy all layers (trend, KHC, boardy, commerce)
npm run deploy:fuji
npm run sync:env

# Commerce contracts only
cd contracts/commerce && npm install && npm run deploy:fuji

# Frontend
cd Trisphere-Frontend && npm run dev
```

## Environment

Frontend (`Trisphere-Frontend/.env.local`):

- `NEXT_PUBLIC_PAYMENT_ESCROW_ADDRESS`
- `NEXT_PUBLIC_TRISPHERE_TREASURY_ADDRESS`
- `NEXT_PUBLIC_TRISPHERE_REPUTATION_ADDRESS`
- `NEXT_PUBLIC_MOCK_USDC_ADDRESS`
- Plus existing registry / Boardy addresses (see `.env.example`)

Boardy backend:

- `BOARDY_MATCH_STAKING_ADDRESS`
- `BOARDY_MILESTONE_ESCROW_ADDRESS`
- `AVALANCHE_RPC_URL`

## Why Avalanche

Fast finality, low fees, EVM compatibility, and native USDC support make frequent B2B settlements practical. TriSphere uses Fuji testnet for hackathon/demo; production targets Avalanche mainnet with Circle USDC.

import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { client } from "../client";
import { avalancheFuji } from "@/lib/chains";

const wallets = [
  inAppWallet({
    auth: { options: ["google", "email", "apple"] },
  }),
  createWallet("io.metamask"),
  createWallet("io.rabby"),
];

export default function Login({ onBack }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          ← Back to Home
        </button>
      </div>

      <div className="glass-card animate-in" style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, var(--primary), #06b6d4)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 30px var(--primary-glow)' }}>
            <span style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold' }}>CS</span>
          </div>
          <h1 className="title">ConnectSphere</h1>
          <p className="subtitle">Connect Core Wallet or MetaMask on Avalanche Fuji to enter the AI matchmaking workspace.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ConnectButton
            client={client}
            chain={avalancheFuji}
            chains={[avalancheFuji]}
            wallets={wallets}
            theme="dark"
            connectModal={{ size: "wide", title: "Join ConnectSphere on Fuji" }}
          />
        </div>
      </div>
    </div>
  );
}

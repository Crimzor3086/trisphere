import { useState, useEffect } from "react";
import { useDisconnect, useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall, toWei } from "thirdweb";
import { client } from "../client";
import { getBoardyApiUrl } from "../api";
import Vapi from "@vapi-ai/web";
import { avalancheFuji } from "@/lib/chains";
import { getTriSphereContracts } from "@/lib/contracts";
import { BOARDY_MATCH_STAKING_ABI } from "@/lib/abis/boardyMatchStaking";

export default function Dashboard({ profile }) {
  const { disconnect } = useDisconnect();
  const activeAccount = useActiveAccount();
  const { mutateAsync: sendTx, isPending } = useSendTransaction();
  const [callStatus, setCallStatus] = useState("inactive");
  const [matchStatus, setMatchStatus] = useState("idle");
  const [vapiInstance, setVapiInstance] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const contracts = getTriSphereContracts();

  useEffect(() => {
    const VapiClass = Vapi.default || Vapi;
    const vapi = new VapiClass(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'dummy_key');
    setVapiInstance(vapi);

    vapi.on("call-start", () => setCallStatus("active"));
    vapi.on("call-end", () => setCallStatus("inactive"));
    vapi.on("error", (e) => {
      console.error(e);
      setCallStatus("inactive");
    });

    return () => vapi.removeAllListeners();
  }, []);

  const handleStakeClick = async () => {
    if (!activeAccount?.address) {
      alert("Connect your wallet on Avalanche Fuji first (navbar or login).");
      return;
    }

    if (!contracts.boardyMatchStaking) {
      alert("BoardyMatchStaking contract address is not configured. Deploy contracts and set NEXT_PUBLIC_BOARDY_MATCH_STAKING_ADDRESS.");
      return;
    }

    setMatchStatus("staking");
    setTxHash(null);

    try {
      const prep = await fetch("/api/boardy/chain/prepare-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: activeAccount.address,
          profileId: profile.id,
        }),
      });

      if (!prep.ok) {
        const err = await prep.json().catch(() => ({}));
        throw new Error(err.error || "Failed to prepare on-chain match");
      }

      const { matchId } = await prep.json();
      const stakeValue = toWei(contracts.boardyStakeAmountAvax || "0.01");

      const contract = getContract({
        client,
        chain: avalancheFuji,
        address: contracts.boardyMatchStaking,
        abi: BOARDY_MATCH_STAKING_ABI,
      });

      const transaction = prepareContractCall({
        contract,
        method: "stake",
        params: [matchId],
        value: stakeValue,
      });

      const result = await sendTx(transaction);
      setTxHash(result.transactionHash);

      setMatchStatus("queuing");

      await fetch("/api/boardy/chain/complete-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      });

      const apiUrl = getBoardyApiUrl();
      const response = await fetch(`${apiUrl}/matches/1/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: profile.id }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.chat_room_id) {
          setMatchStatus("matched");
          setTimeout(() => {
            if (window.onMatchUnlocked) {
              window.onMatchUnlocked(data.chat_room_id);
            }
          }, 1500);
          return;
        }
      }

      alert("On-chain stake succeeded but backend match provisioning failed.");
      setMatchStatus("idle");
    } catch (err) {
      console.error("Stake flow error:", err);
      alert(err.message || "Staking failed. Ensure Fuji testnet AVAX in your wallet.");
      setMatchStatus("idle");
    }
  };

  const handleCallClick = async () => {
    if (callStatus === "active" || callStatus === "connecting") {
      vapiInstance?.stop();
      setCallStatus("inactive");
    } else {
      setCallStatus("connecting");
      try {
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        if (!assistantId) {
          alert('Please add NEXT_PUBLIC_VAPI_ASSISTANT_ID to Trisphere-Frontend/.env.local');
          setCallStatus("inactive");
          return;
        }
        await vapiInstance?.start(assistantId, {
          variableValues: {
            wallet_address: profile.id
          }
        });
      } catch (err) {
        console.error("Vapi Error:", err);
        setCallStatus("inactive");
      }
    }
  };

  return (
    <div className="glass-card animate-in" style={{ maxWidth: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 className="title" style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Welcome, {profile?.name?.split(' ')[0] || 'Professional'}</h2>
          <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {profile?.role || 'Verified User'}
          </span>
        </div>
        <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '1.5rem' }}>👋</span>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.03)' }}>
        {profile?.offer_text ? (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Your Professional Summary</h3>
            <div className="custom-scrollbar" style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', maxHeight: '150px', overflowY: 'auto', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>Your Offer:</strong> 
                {profile.offer_text}
              </p>
              <p style={{ color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>Your Need:</strong> 
                {profile.need_text}
              </p>
            </div>
            
            <h3 style={{ fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Ready to Find Your Match?</h3>
            
            {matchStatus === "idle" && (
              <>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  Stake {contracts.boardyStakeAmountAvax || '0.01'} AVAX on Avalanche Fuji via BoardyMatchStaking. Both sides stake to unlock the match.
                </p>
                {contracts.boardyMatchStaking ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Contract: {contracts.boardyMatchStaking.slice(0, 10)}…
                  </p>
                ) : null}
                <button 
                  className="btn-primary" 
                  onClick={handleStakeClick}
                  disabled={isPending}
                  style={{ width: '100%', padding: '1rem', position: 'relative' }}
                >
                  Stake {contracts.boardyStakeAmountAvax || '0.01'} AVAX to Unlock Matches
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                  Funds held in BoardyMatchStaking on Fuji testnet.
                </p>
              </>
            )}

            {matchStatus === "staking" && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1rem', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <h4 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Confirming Fuji Transaction</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Waiting for Avalanche network finality…</p>
              </div>
            )}

            {matchStatus === "queuing" && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(96, 165, 250, 0.05)', borderRadius: '12px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '12px', height: '12px', background: '#60a5fa', borderRadius: '50%', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                  <div style={{ width: '12px', height: '12px', background: '#60a5fa', borderRadius: '50%', animation: 'pulse 1.5s infinite ease-in-out 0.2s' }}></div>
                  <div style={{ width: '12px', height: '12px', background: '#60a5fa', borderRadius: '50%', animation: 'pulse 1.5s infinite ease-in-out 0.4s' }}></div>
                </div>
                <h4 style={{ color: '#60a5fa', marginBottom: '0.5rem', fontSize: '1.1rem' }}>AI Matchmaking in Progress</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  On-chain stake confirmed{txHash ? ` (${txHash.slice(0, 10)}…)` : ''}.<br/>
                  Calculating cosine similarity across pgvector embeddings…
                </p>
              </div>
            )}

            {matchStatus === "matched" && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h4 style={{ color: '#10b981', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Optimal Match Found!</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Routing you to your secure Chat Room…</p>
              </div>
            )}
            
            {matchStatus === "idle" && (
              <button 
                onClick={() => window.location.reload()} 
                style={{ display: 'block', margin: '1.5rem auto 0', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Refresh Status
              </button>
            )}
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Your Next Step</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Boardy.ai uses a voice-first approach to understand what you're building and what you need. Our AI agent will call you to collect this data and match you with the perfect counterpart.
            </p>
            
            <button 
              onClick={handleCallClick}
              disabled={callStatus === "connecting"}
              className="btn-primary" 
              style={{ 
                background: callStatus === "active" ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                boxShadow: callStatus === "active" ? '0 4px 15px rgba(239, 68, 68, 0.2)' : '0 4px 15px rgba(16, 185, 129, 0.2)' 
              }}
            >
              {callStatus === "inactive" && <><span style={{ fontSize: '1.2rem' }}>🎙️</span> Start AI Voice Interview</>}
              {callStatus === "connecting" && "Connecting to AI..."}
              {callStatus === "active" && "⏹️ End AI Voice Interview"}
            </button>
            
            {callStatus === "inactive" && (
              <button 
                onClick={() => window.location.reload()} 
                style={{ display: 'block', margin: '1rem auto 0', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Refresh Data (If you just finished a call)
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={() => disconnect(client)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.target.style.color = 'var(--primary)'}
          onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall, toWei } from "thirdweb";
import { client } from "../client";
import { getBoardyApiUrl } from "../api";
import { avalancheFuji } from "@/lib/chains";
import { getTriSphereContracts } from "@/lib/contracts";
import { BOARDY_MILESTONE_ESCROW_ABI, MilestoneStatus } from "@/lib/abis/boardyMilestoneEscrow";

const STATUS_LABELS = ["Proposed", "Funded", "Completed", "Released", "Refunded", "Disputed"];

export default function ChatRoomView({ roomId, profile, onBack }) {
  const activeAccount = useActiveAccount();
  const { mutateAsync: sendTx, isPending } = useSendTransaction();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [payeeAddress, setPayeeAddress] = useState("");
  const [milestoneAmount, setMilestoneAmount] = useState("0.05");
  const [milestoneDescription, setMilestoneDescription] = useState("MVP deliverable");
  const [busy, setBusy] = useState(false);
  const messagesEndRef = useRef(null);
  const contracts = getTriSphereContracts();

  const loadMessages = useCallback(async () => {
    const apiUrl = getBoardyApiUrl();
    try {
      const res = await fetch(`${apiUrl}/chat_rooms/${roomId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  }, [roomId]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const appendSystemMessage = (content) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        type: "system",
        content,
        inserted_at: new Date().toISOString(),
      },
    ]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile?.id) return;

    const apiUrl = getBoardyApiUrl();
    const res = await fetch(`${apiUrl}/chat_rooms/${roomId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage.trim(), sender_id: profile.id }),
    });

    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    }
  };

  const handleCreateMilestone = async () => {
    if (!activeAccount?.address) {
      alert("Connect your Avalanche Fuji wallet first.");
      return;
    }
    if (!payeeAddress || !milestoneAmount) {
      alert("Enter payee wallet address and AVAX amount.");
      return;
    }
    if (!contracts.boardyMilestoneEscrow) {
      alert("BoardyMilestoneEscrow address is not configured.");
      return;
    }

    setBusy(true);
    try {
      const prep = await fetch("/api/boardy/chain/prepare-milestone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payerAddress: activeAccount.address,
          payeeAddress,
          amountAvax: milestoneAmount,
          description: milestoneDescription,
          roomId,
        }),
      });

      if (!prep.ok) {
        const err = await prep.json().catch(() => ({}));
        throw new Error(err.error || "Failed to prepare milestone");
      }

      const { milestoneId, amountAvax, amountWei } = await prep.json();
      setMilestones((prev) => [
        ...prev,
        {
          milestoneId,
          amountAvax,
          amountWei,
          description: milestoneDescription,
          payeeAddress,
          status: MilestoneStatus.Proposed,
        },
      ]);

      appendSystemMessage(
        `Escrow milestone proposed on Avalanche: ${amountAvax} AVAX — ${milestoneDescription}`,
      );
      setShowMilestoneForm(false);
    } catch (err) {
      alert(err.message || "Milestone creation failed");
    } finally {
      setBusy(false);
    }
  };

  const fundMilestone = async (milestone) => {
    if (!activeAccount?.address) return;
    setBusy(true);
    try {
      const contract = getContract({
        client,
        chain: avalancheFuji,
        address: contracts.boardyMilestoneEscrow,
        abi: BOARDY_MILESTONE_ESCROW_ABI,
      });

      const tx = prepareContractCall({
        contract,
        method: "fundMilestone",
        params: [milestone.milestoneId],
        value: BigInt(milestone.amountWei),
      });

      await sendTx(tx);
      setMilestones((prev) =>
        prev.map((m) =>
          m.milestoneId === milestone.milestoneId ? { ...m, status: MilestoneStatus.Funded } : m,
        ),
      );
      appendSystemMessage(`Milestone funded on-chain (${milestone.amountAvax} AVAX locked in escrow).`);
    } catch (err) {
      alert(err.message || "Funding failed");
    } finally {
      setBusy(false);
    }
  };

  const markCompleted = async (milestone) => {
    setBusy(true);
    try {
      const contract = getContract({
        client,
        chain: avalancheFuji,
        address: contracts.boardyMilestoneEscrow,
        abi: BOARDY_MILESTONE_ESCROW_ABI,
      });

      const tx = prepareContractCall({
        contract,
        method: "markCompleted",
        params: [milestone.milestoneId],
      });

      await sendTx(tx);
      setMilestones((prev) =>
        prev.map((m) =>
          m.milestoneId === milestone.milestoneId ? { ...m, status: MilestoneStatus.Completed } : m,
        ),
      );
      appendSystemMessage("Payee marked deliverable complete on Avalanche.");
    } catch (err) {
      alert(err.message || "Mark complete failed");
    } finally {
      setBusy(false);
    }
  };

  const releaseMilestone = async (milestone) => {
    setBusy(true);
    try {
      const contract = getContract({
        client,
        chain: avalancheFuji,
        address: contracts.boardyMilestoneEscrow,
        abi: BOARDY_MILESTONE_ESCROW_ABI,
      });

      const tx = prepareContractCall({
        contract,
        method: "release",
        params: [milestone.milestoneId],
      });

      await sendTx(tx);
      setMilestones((prev) =>
        prev.map((m) =>
          m.milestoneId === milestone.milestoneId ? { ...m, status: MilestoneStatus.Released } : m,
        ),
      );
      appendSystemMessage("Funds released to creator — payment settled on Avalanche.");
    } catch (err) {
      alert(err.message || "Release failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass-card animate-in" style={{ maxWidth: '900px', width: '100%', height: '85vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={onBack}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', marginRight: '1rem' }}
          >
            ←
          </button>
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--text-main)' }}>Professional Match #{roomId}</h2>
            <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              Avalanche escrow · Fuji testnet
            </span>
          </div>
        </div>
      </div>

      {milestones.length > 0 && (
        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {milestones.map((m) => (
            <div key={m.milestoneId} style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
              <strong>{m.description}</strong> — {m.amountAvax} AVAX · {STATUS_LABELS[m.status]}
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {m.status === MilestoneStatus.Proposed && (
                  <button type="button" disabled={busy || isPending} onClick={() => fundMilestone(m)} className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                    Fund escrow
                  </button>
                )}
                {m.status === MilestoneStatus.Funded && activeAccount?.address?.toLowerCase() === m.payeeAddress?.toLowerCase() && (
                  <button type="button" disabled={busy || isPending} onClick={() => markCompleted(m)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                    Mark deliverable complete
                  </button>
                )}
                {m.status === MilestoneStatus.Completed && (
                  <button type="button" disabled={busy || isPending} onClick={() => releaseMilestone(m)} className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                    Release payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Match unlocked on Avalanche</p>
            <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
              Discuss terms and create AVAX escrow milestones secured by BoardyMilestoneEscrow on Fuji.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            if (msg.type === "system") {
              return (
                <div key={msg.id || i} style={{ textAlign: 'center', margin: '1rem 0' }}>
                  <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    {msg.content}
                  </span>
                </div>
              );
            }

            const isMe = String(msg.sender_id) === String(profile?.id);
            return (
              <div key={msg.id || i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                <div style={{
                  background: isMe ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '16px',
                  borderBottomRightRadius: isMe ? '4px' : '16px',
                  borderBottomLeftRadius: isMe ? '16px' : '4px',
                  fontSize: '0.95rem',
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: isMe ? 'right' : 'left' }}>
                  {new Date(msg.inserted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {showMilestoneForm && (
        <div style={{ marginBottom: '0.75rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'grid', gap: '0.5rem' }}>
          <input
            placeholder="Creator / payee wallet (0x…)"
            value={payeeAddress}
            onChange={(e) => setPayeeAddress(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white' }}
          />
          <input
            placeholder="Amount AVAX"
            value={milestoneAmount}
            onChange={(e) => setMilestoneAmount(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white' }}
          />
          <input
            placeholder="Description"
            value={milestoneDescription}
            onChange={(e) => setMilestoneDescription(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" disabled={busy} onClick={handleCreateMilestone} className="btn-primary" style={{ flex: 1 }}>
              Register on-chain
            </button>
            <button type="button" onClick={() => setShowMilestoneForm(false)} style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setShowMilestoneForm(true)}
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#f59e0b', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Create AVAX escrow milestone
        </button>
      </div>

      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Discuss project terms, deliverables..."
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '1rem',
            color: 'white',
            outline: 'none',
            fontSize: '0.95rem',
          }}
        />
        <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem', height: '100%', borderRadius: '12px' }} disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

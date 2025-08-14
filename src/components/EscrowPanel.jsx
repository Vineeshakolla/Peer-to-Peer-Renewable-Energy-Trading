import React, { useState } from "react";
import { createEscrow, releaseEscrow, refundEscrow } from "../lib/contracts.js";

export default function EscrowPanel({ pushToast }) {
  const [seller, setSeller] = useState("");
  const [listingId, setListingId] = useState("");
  const [amountAPT, setAmountAPT] = useState("");
  const [escrowId, setEscrowId] = useState("");
  const [busy, setBusy] = useState(false);

  const onCreate = async () => {
    if (!seller) return pushToast("⚠ Enter seller address.");
    if (!listingId) return pushToast("⚠ Enter listing id.");
    if (!amountAPT) return pushToast("⚠ Enter APT amount.");
    try {
      setBusy(true);
      const hash = await createEscrow(seller, parseInt(listingId), parseFloat(amountAPT));
      pushToast(`✅ Escrow created (tx: ${hash.slice(0, 10)}…)`);
    } catch (e) {
      pushToast(`❌ Escrow create failed: ${e.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  const onRelease = async () => {
    if (!escrowId) return pushToast("⚠ Enter escrow id.");
    try {
      setBusy(true);
      const hash = await releaseEscrow(parseInt(escrowId));
      pushToast(`✅ Escrow released (tx: ${hash.slice(0, 10)}…)`);
    } catch (e) {
      pushToast(`❌ Release failed: ${e.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  const onRefund = async () => {
    if (!escrowId) return pushToast("⚠ Enter escrow id.");
    try {
      setBusy(true);
      const hash = await refundEscrow(parseInt(escrowId));
      pushToast(`✅ Escrow refunded (tx: ${hash.slice(0, 10)}…)`);
    } catch (e) {
      pushToast(`❌ Refund failed: ${e.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h3>🔒 Escrow (Optional)</h3>
      <div className="row">
        <div>
          <label className="label">Seller Address (0x…)</label>
          <input className="input" value={seller} onChange={e => setSeller(e.target.value.trim())} placeholder="0xSeller" />
        </div>
        <div>
          <label className="label">Listing ID</label>
          <input className="input" type="number" min="0" value={listingId} onChange={e => setListingId(e.target.value)} placeholder="0" />
        </div>
      </div>

      <label className="label">Amount (APT)</label>
      <input className="input" type="number" min="0" step="0.00000001" value={amountAPT} onChange={e => setAmountAPT(e.target.value)} placeholder="1.0" />

      <button className="btn" onClick={onCreate} disabled={busy}>💰 Create Escrow (Deposit)</button>

      <div className="row" style={{ marginTop: 12 }}>
        <div>
          <label className="label">Escrow ID</label>
          <input className="input" type="number" min="0" value={escrowId} onChange={e => setEscrowId(e.target.value)} placeholder="e.g., 1" />
        </div>
      </div>
      <div className="row">
        <button className="btn" onClick={onRelease} disabled={busy}>✅ Release to Seller</button>
        <button className="btn" onClick={onRefund} disabled={busy}>↩️ Refund to Buyer</button>
      </div>

      <div className="footer-note">These call entry functions in your <code>EscrowPlatform</code> module.</div>
    </div>
  );
}

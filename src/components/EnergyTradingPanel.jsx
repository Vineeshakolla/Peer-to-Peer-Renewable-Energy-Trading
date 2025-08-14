import React, { useState } from "react";
import { listEnergyForSale, buyEnergy } from "../lib/contracts.js";

export default function EnergyTradingPanel({ role, updateStats, pushToast }) {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [producerAddr, setProducerAddr] = useState("");
  const [listingIndex, setListingIndex] = useState("");
  const [busy, setBusy] = useState(false);

  const onList = async () => {
    const kwh = parseFloat(amount);
    const p = parseFloat(price);
    if (!kwh || !p || kwh <= 0 || p <= 0) return pushToast("⚠ Enter valid amount and price.");

    try {
      setBusy(true);
      const hash = await listEnergyForSale(kwh, p);
      updateStats((s) => ({
        ...s,
        sold: s.sold + kwh,
        earnings: s.earnings + p * kwh
      }));
      pushToast(`✅ Listed ${kwh} kWh @ ${p} APT/kWh (tx: ${hash.slice(0, 10)}…)`);
      setAmount(""); setPrice("");
    } catch (e) {
      pushToast(`❌ List failed: ${e.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  const onBuy = async () => {
    if (!producerAddr) return pushToast("⚠ Select/enter a producer address.");
    const idx = parseInt(listingIndex);
    if (isNaN(idx) || idx < 0) return pushToast("⚠ Enter a valid listing index (0,1,2,…)");

    try {
      setBusy(true);
      const hash = await buyEnergy(producerAddr, idx);
      updateStats((s) => ({
        ...s,
        bought: s.bought + 10,
        spent: s.spent + 5
      }));
      pushToast(`✅ Bought energy (tx: ${hash.slice(0, 10)}…)`);
      setProducerAddr(""); setListingIndex("");
    } catch (e) {
      pushToast(`❌ Buy failed: ${e.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h3>🔋 {role === "producer" ? "Sell Energy" : "Buy Energy"}</h3>

      {role === "producer" ? (
        <>
          <div className="row">
            <div>
              <label className="label">Energy Amount (kWh)</label>
              <input className="input" type="number" min="0" step="0.1"
                value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 25" />
            </div>
            <div>
              <label className="label">Price per kWh (APT)</label>
              <input className="input" type="number" min="0" step="0.00000001"
                value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 0.1" />
            </div>
          </div>
          <button className="btn" onClick={onList} disabled={busy}>⚡ List Energy for Sale</button>
          <div className="footer-note">Sends an entry function to your <code>EnergyTrading</code> module.</div>
        </>
      ) : (
        <>
          <label className="label">Producer Address (0x…)</label>
          <input className="input" value={producerAddr} onChange={e => setProducerAddr(e.target.value.trim())} placeholder="0xProducer" />

          <label className="label">Listing Index</label>
          <input className="input" type="number" min="0" value={listingIndex} onChange={e => setListingIndex(e.target.value)} placeholder="0" />

          <button className="btn" onClick={onBuy} disabled={busy}>💳 Buy Energy (Direct)</button>
          <div className="footer-note">Calls <code>buy_energy</code> in your module.</div>
        </>
      )}
    </div>
  );
}

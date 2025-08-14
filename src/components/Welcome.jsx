import React, { useState } from "react";

export default function Welcome({ onEnter, wallet }) {
  const [val, setVal] = useState("");

  return (
    <div className="card">
      <h3>👋 Welcome!</h3>
      <p className="footer-note">Enter your name to continue.</p>
      <label className="label">Your name</label>
      <input
        className="input"
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="e.g., Aditi"
        onKeyDown={(e) => { if (e.key === "Enter") onEnter(val.trim()); }}
      />
      <button className="btn" onClick={() => onEnter(val.trim())} disabled={!wallet.connected || !val.trim()}>
        Enter Platform →
      </button>
      {!wallet.connected && <div className="status">Connect wallet to proceed.</div>}
    </div>
  );
}

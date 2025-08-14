import React from "react";

export default function Header({ wallet, onConnect, toast }) {
  return (
    <header className="header">
      <h1>⚡ P2P Energy Trading (Aptos)</h1>
      <p>Trade renewable energy directly — powered by your Move smart contracts</p>

      {wallet.connected ? (
        <p className="footer-note">
          <strong>Connected:</strong> {wallet.address}
        </p>
      ) : (
        <button className="btn" onClick={onConnect}>🔗 Connect Petra Wallet</button>
      )}

      <div className="output" style={{ marginTop: 10 }}>{toast || "—"}</div>
    </header>
  );
}

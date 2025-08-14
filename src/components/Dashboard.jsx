import React, { useState } from "react";
import EnergyTradingPanel from "./EnergyTradingPanel.jsx";
import EscrowPanel from "./EscrowPanel.jsx";

export default function Dashboard({ role, name, wallet, onBack, pushToast }) {
  const [stats, setStats] = useState({ sold: 0, bought: 0, earnings: 0, spent: 0 });

  return (
    <>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ marginBottom: 4 }}>
              {role === "producer" ? `${name}'s Solar Farm` : `${name}'s Green Home`}
            </h3>
            <div className="badge">{role === "producer" ? "Producer Dashboard" : "Consumer Dashboard"}</div>
          </div>
          <button className="btn" onClick={onBack}>← Back</button>
        </div>
      </div>

      <div className="kpi">
        <div className="box">
          <div className="title">Wallet</div>
          <div className="value">{wallet.balance?.toFixed ? wallet.balance.toFixed(4) : wallet.balance} APT</div>
        </div>
        <div className="box">
          <div className="title">{role === "producer" ? "Units Sold" : "Units Bought"}</div>
          <div className="value">{role === "producer" ? stats.sold : stats.bought} kWh</div>
        </div>
        <div className="box">
          <div className="title">Total {role === "producer" ? "Earnings" : "Spent"}</div>
          <div className="value">{(role === "producer" ? stats.earnings : stats.spent).toFixed(2)} APT</div>
        </div>
      </div>

      <div className="grid">
        <EnergyTradingPanel role={role} updateStats={setStats} pushToast={pushToast} />
        <EscrowPanel pushToast={pushToast} />
      </div>
    </>
  );
}

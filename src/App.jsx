import React, { useState } from "react";
import Header from "./components/Header.jsx";
import Welcome from "./components/Welcome.jsx";
import UserSelect from "./components/UserSelect.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { connectWallet } from "./lib/wallet.js";
import { initProducerStorage } from "./lib/contracts.js";

export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | select | dashboard
  const [name, setName] = useState("");
  const [role, setRole] = useState(null); // 'producer' | 'consumer'
  const [wallet, setWallet] = useState({ connected: false, address: "", balance: 0 });
  const [toast, setToast] = useState("");

  const show = (msg) => setToast(msg);

  const onConnect = async () => {
    try {
      const res = await connectWallet();
      setWallet({ connected: true, address: res.address, balance: res.balance });
      show(`✅ Connected: ${res.address.slice(0,8)}…${res.address.slice(-6)}`);
    } catch (e) {
      show(e.message || "❌ Wallet connection failed.");
    }
  };

  const onEnter = async (userName) => {
    if (!wallet.connected) return show("Please connect your Aptos wallet first.");
    setName(userName);
    setScreen("select");
  };

  const chooseRole = async (r) => {
    setRole(r);
    if (r === "producer") {
      try {
        await initProducerStorage();
        show("💾 Producer storage initialized (or already present).");
      } catch (e) {
        // often already initialized; not fatal
        show("ℹ️ Producer storage may already be initialized.");
      }
    }
    setScreen("dashboard");
  };

  return (
    <div className="app-body">
      <div className="container">
        <Header wallet={wallet} onConnect={onConnect} toast={toast} />
        {screen === "welcome" && <Welcome onEnter={onEnter} wallet={wallet} />}
        {screen === "select" && <UserSelect name={name} onBack={() => setScreen("welcome")} onChoose={chooseRole} />}
        {screen === "dashboard" && (
          <Dashboard
            role={role}
            name={name}
            wallet={wallet}
            onBack={() => {
              setRole(null);
              setScreen("select");
            }}
            pushToast={show}
          />
        )}
      </div>
    </div>
  );
}

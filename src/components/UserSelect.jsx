import React from "react";

export default function UserSelect({ name, onBack, onChoose }) {
  return (
    <div className="grid">
      <div className="card full">
        <h3>Hello, {name}! Choose your role</h3>
      </div>

      <div className="card">
        <h3>🏭 Producer</h3>
        <p className="footer-note">List excess renewable energy for sale.</p>
        <button className="btn" onClick={() => onChoose("producer")}>
          I want to sell energy
        </button>
      </div>

      <div className="card">
        <h3>🏠 Consumer</h3>
        <p className="footer-note">Buy clean energy from local producers.</p>
        <button className="btn" onClick={() => onChoose("consumer")}>
          I want to buy energy
        </button>
      </div>

      <div className="card full">
        <button className="btn" onClick={onBack}>← Change Name</button>
      </div>
    </div>
  );
}

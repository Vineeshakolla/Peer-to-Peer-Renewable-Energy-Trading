import React from "react";
export default function Status({ kind = "ok", children }) {
  return <div className={`status ${kind === "error" ? "error" : ""}`}>{children}</div>;
}

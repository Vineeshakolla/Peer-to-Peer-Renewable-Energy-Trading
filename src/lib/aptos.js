export async function signAndSubmit(payload) {
  if (!window.aptos) throw new Error("Petra wallet not found.");
  const tx = await window.aptos.signAndSubmitTransaction(payload);
  return tx.hash;
}

export function u64(n) {
  // accept number | string | bigint
  const bi = BigInt(n);
  if (bi < 0n) throw new Error("u64 must be >= 0");
  return bi.toString();
}

export function aptToOctas(v) {
  const [wh = "0", frRaw = ""] = String(v ?? "0").split(".");
  const fr = (frRaw + "00000000").slice(0, 8);
  return (BigInt(wh) * 100000000n + BigInt(fr)).toString();
}

export function moduleFun(mod, fun) {
  return `${mod}::${fun}`;
}

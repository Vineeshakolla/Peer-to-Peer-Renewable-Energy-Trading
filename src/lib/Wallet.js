const NODE_URL = import.meta.env.VITE_APTOS_NODE_URL || "https://fullnode.testnet.aptoslabs.com/v1";

export async function connectWallet() {
  if (!window.aptos) {
    throw new Error("Petra wallet not found. Install https://petra.app/");
  }
  const res = await window.aptos.connect();
  const address = res.address;

  // fetch APT balance (AptosCoin)
  let balance = 0;
  try {
    const typeTag = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
    const url = `${NODE_URL}/accounts/${address}/resource/${encodeURIComponent(typeTag)}`;
    const r = await fetch(url);
    if (r.ok) {
      const j = await r.json();
      balance = Number(j.data.coin.value) / 1e8;
    }
  } catch (_e) {
    // ignore
  }

  return { address, balance };
}

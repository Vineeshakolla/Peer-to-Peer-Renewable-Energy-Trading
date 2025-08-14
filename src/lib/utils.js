export const short = (addr) => (addr ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : "");

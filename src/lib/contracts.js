import { signAndSubmit, u64, aptToOctas, moduleFun } from "./aptos.js";

const NODE = import.meta.env.VITE_APTOS_NODE_URL || "https://fullnode.testnet.aptoslabs.com/v1";
const ADDR = import.meta.env.VITE_MODULE_ADDR || "1f35f31c2e91a3c88252a4882cefb0732f7de5c7d84571d123d3867a08f3bb29";

// EnergyTrading
const ENERGY_MOD_NAME = import.meta.env.VITE_ENERGY_MODULE_NAME || "EnergyTrading";
const ENERGY_MODULE = `${ADDR}::${ENERGY_MOD_NAME}`;
const FN_INIT_PRODUCER = import.meta.env.VITE_FN_INIT_PRODUCER || "init_producer_storage";
const FN_LIST_ENERGY = import.meta.env.VITE_FN_LIST_ENERGY || "list_energy_for_sale";
const FN_BUY_ENERGY = import.meta.env.VITE_FN_BUY_ENERGY || "buy_energy";

// EscrowPlatform
const ESCROW_MOD_NAME = import.meta.env.VITE_ESCROW_MODULE_NAME || "EscrowPlatform";
const ESCROW_MODULE = `${ADDR}::${ESCROW_MOD_NAME}`;
const FN_CREATE_ESCROW = import.meta.env.VITE_FN_CREATE_ESCROW || "create_escrow";
const FN_RELEASE = import.meta.env.VITE_FN_RELEASE_ESCROW || "release";
const FN_REFUND = import.meta.env.VITE_FN_REFUND_ESCROW || "refund";

/** -------- EnergyTrading entry calls -------- */

export async function initProducerStorage() {
  const payload = {
    type: "entry_function_payload",
    function: moduleFun(ENERGY_MODULE, FN_INIT_PRODUCER),
    type_arguments: [],
    arguments: []
  };
  return signAndSubmit(payload);
}

/**
 * List energy for sale.
 * @param {number} kwh - energy amount (kWh)
 * @param {number} pricePerKwhAPT - price per kWh (APT)
 * NOTE: Adjust arguments order/types to match your .move entry function.
 */
export async function listEnergyForSale(kwh, pricePerKwhAPT) {
  const payload = {
    type: "entry_function_payload",
    function: moduleFun(ENERGY_MODULE, FN_LIST_ENERGY),
    type_arguments: [],
    // Common patterns: (kwh: u64, price_per_kwh_octas: u64)
    arguments: [u64(kwh), aptToOctas(pricePerKwhAPT)]
  };
  return signAndSubmit(payload);
}

/**
 * Buy energy from a producer listing.
 * @param {string} producerAddr - 0x...
 * @param {number} listingIndex - u64 index
 */
export async function buyEnergy(producerAddr, listingIndex) {
  const payload = {
    type: "entry_function_payload",
    function: moduleFun(ENERGY_MODULE, FN_BUY_ENERGY),
    type_arguments: [],
    // Common patterns: (producer: address, index: u64)
    arguments: [producerAddr, u64(listingIndex)]
  };
  return signAndSubmit(payload);
}

/** -------- Escrow entry calls -------- */

/**
 * Create escrow / deposit funds.
 * @param {string} sellerAddr
 * @param {number} listingId
 * @param {number} amountAPT
 */
export async function createEscrow(sellerAddr, listingId, amountAPT) {
  const payload = {
    type: "entry_function_payload",
    function: moduleFun(ESCROW_MODULE, FN_CREATE_ESCROW),
    type_arguments: [],
    // Common patterns: (seller: address, listing_id: u64, amount_octas: u64)
    arguments: [sellerAddr, u64(listingId), aptToOctas(amountAPT)]
  };
  return signAndSubmit(payload);
}

export async function releaseEscrow(escrowId) {
  const payload = {
    type: "entry_function_payload",
    function: moduleFun(ESCROW_MODULE, FN_RELEASE),
    type_arguments: [],
    arguments: [u64(escrowId)]
  };
  return signAndSubmit(payload);
}

export async function refundEscrow(escrowId) {
  const payload = {
    type: "entry_function_payload",
    function: moduleFun(ESCROW_MODULE, FN_REFUND),
    type_arguments: [],
    arguments: [u64(escrowId)]
  };
  return signAndSubmit(payload);
}

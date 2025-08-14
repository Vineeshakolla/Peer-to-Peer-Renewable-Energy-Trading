import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

export const useBlockchain = () => {
  const [blockchain, setBlockchain] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const { connected, account, connect } = useWallet();

  const connectWallet = async () => {
    try {
      await connect();
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const updateWalletDisplay = async () => {
    // Mock function for now
    setWalletBalance(1.234);
  };

  return {
    blockchain: { walletAddress: account?.address },
    walletBalance,
    isConnected: connected,
    connectWallet,
    updateWalletDisplay
  };
};

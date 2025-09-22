import { FAKE_ADDRESS } from '@/constant';
import { create } from 'zustand';

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  isConnecting: false,
  address: null,

  connect: async () => {
    set({ isConnecting: true });

    // Simulate async wallet connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    set({
      isConnected: true,
      isConnecting: false,
      address: FAKE_ADDRESS,
    });
  },

  disconnect: () => {
    set({
      isConnected: false,
      isConnecting: false,
      address: null,
    });
  },
}));

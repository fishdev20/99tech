import { FAKE_ADDRESS } from '@/constant';
import { create } from 'zustand';

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  address: null,

  connect: async () => {
    set({ isConnecting: true, connectionError: null });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const scenarios = ['success', 'rejected', 'timeout'] as const;
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    try {
      switch (scenario) {
        case 'success':
          set({
            isConnected: true,
            isConnecting: false,
            address: FAKE_ADDRESS,
            connectionError: null,
          });
          break;

        case 'rejected':
          throw new Error('Connection rejected by user.');

        case 'timeout':
        default:
          throw new Error('Connection timed out. Please try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      set({
        isConnected: false,
        isConnecting: false,
        address: null,
        connectionError: message,
      });
    }
  },

  disconnect: () => {
    set({
      isConnected: false,
      isConnecting: false,
      address: null,
    });
  },
}));

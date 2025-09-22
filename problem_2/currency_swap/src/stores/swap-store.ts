import { FAKE_TXHASH } from '@/constant';
import { create } from 'zustand';

interface SwapState {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;

  isSwapping: boolean;
  transactionError: string | null;
  status: 'idle' | 'pending' | 'success' | 'failed';
  transactionHash: string | null;

  setFromToken: (token: string) => void;
  setToToken: (token: string) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  revertTokens: () => void;
  resetTransaction: () => void;
  executeSwap: () => Promise<void>;
}

export const useSwapStore = create<SwapState>((set, get) => ({
  fromToken: 'ETH',
  toToken: 'USDC',
  fromAmount: '',
  toAmount: '',
  isConnected: false,
  isSwapping: false,
  transactionError: null,
  status: 'idle',
  transactionHash: null,

  setFromToken: (fromToken) => set({ fromToken }),
  setToToken: (toToken) => set({ toToken }),
  setFromAmount: (fromAmount) => set({ fromAmount }),
  setToAmount: (toAmount) => set({ toAmount }),

  revertTokens: () => {
    const { fromToken, toToken, toAmount } = get();
    set({
      fromToken: toToken,
      toToken: fromToken,
      fromAmount: toAmount,
      toAmount: '',
    });
  },

  resetTransaction: () =>
    set({
      transactionError: null,
      status: 'idle',
      transactionHash: null,
    }),

  executeSwap: async () => {
    const { fromAmount } = get();

    // Early exit if input is invalid
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      return;
    }

    set({
      isSwapping: true,
      transactionError: null,
      status: 'pending',
    });

    try {
      const scenarios = ['success', 'network_error', 'unknown_error'] as const;
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

      // Simulate random network delay (2–5s)
      const delay = 2000 + Math.random() * 3000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      switch (scenario) {
        case 'success': {
          set({
            transactionHash: FAKE_TXHASH,
            status: 'success',
            fromAmount: '',
            toAmount: '',
          });
          break;
        }

        case 'network_error':
          throw new Error('Network congestion detected. Please retry in a few moments.');

        case 'unknown_error':
        default:
          throw new Error('Unexpected error while processing your swap. Please try again later.');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Transaction failed due to an unknown error.';

      console.error('Swap failed:', message);

      set({
        transactionError: message,
        status: 'failed',
      });
    } finally {
      set({ isSwapping: false });
    }
  },
}));

import { fetchTokensAPI } from '@/api';
import type { Token } from '@/types';
import { create } from 'zustand';

interface TokensState {
  tokens: Token[];
  isLoading: boolean;
  initialLoading: boolean;
  error: string | null;
  lastUpdated: number | null;

  getTokens: (withBalance?: boolean) => Promise<void>;
  refreshPrices: () => Promise<void>;
  getTokenByName: (currency: string) => Token | undefined;
}

export const useTokensStore = create<TokensState>((set, get) => ({
  tokens: [],
  isLoading: false,
  initialLoading: false,
  error: null,
  lastUpdated: null,

  getTokens: async (withBalance = false) => {
    const isInitial = !withBalance;
    if (isInitial) {
      set({ initialLoading: true, error: null });
    } else {
      set({ isLoading: true, error: null });
    }
    try {
      const data = await fetchTokensAPI();

      const enriched = withBalance
        ? data.map((token) => ({
            ...token,
            balance: Number((Math.random() * 10000).toFixed(6)),
          }))
        : data.map((token) => ({
            ...token,
            balance: 0,
          }));

      set({ tokens: enriched });
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ isLoading: false, initialLoading: false });
    }
  },

  refreshPrices: async () => {
    const { tokens } = get();
    if (tokens.length === 0) return;

    try {
      const updatedTokens = await fetchTokensAPI();
      set({
        tokens: updatedTokens,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      console.error('Failed to refresh prices:', error);
    }
  },

  getTokenByName: (currency: string) => {
    return get().tokens.find((token) => token.currency === currency);
  },
}));

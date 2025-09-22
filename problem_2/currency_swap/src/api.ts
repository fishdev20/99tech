import type { Token } from './types';

const ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export const fetchTokensAPI = async (): Promise<Token[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const resp = await fetch('https://interview.switcheo.com/prices.json');
  if (!resp.ok) throw new Error('Failed to fetch prices');

  const rawData: Token[] = await resp.json();

  // Deduplicate by currency, keeping the latest one by timestamp
  const latestTokensMap = new Map<string, Token>();

  for (const token of rawData) {
    const existing = latestTokensMap.get(token.currency);
    if (!existing || token.date > existing.date) {
      latestTokensMap.set(token.currency, token);
    }
  }

  const latestTokens = Array.from(latestTokensMap.values()).map((token) => ({
    ...token,
    logoURI: `${ICON_BASE_URL}/${token.currency}.svg`,
  }));

  return latestTokens;
};

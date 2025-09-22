export const FEE_PERCENT = 0.005;
export const NETWORK_COST = Number((Math.random() * 5 + 1).toFixed(2)); // $1 - $6
export const PRICE_IMPACT = Number((Math.random() * 0.5).toFixed(2)); // 0.00% - 0.50%
export const MAX_SLIPPAGE = 0.5;
export const FAKE_ADDRESS = '0x' + Math.random().toString(16).slice(2, 42);
export const FAKE_TXHASH =
  '0x' +
  [...crypto.getRandomValues(new Uint8Array(32))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

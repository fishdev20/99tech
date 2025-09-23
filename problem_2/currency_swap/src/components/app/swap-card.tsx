import { Button } from '@/components/ui/button';
import { MAX_SLIPPAGE } from '@/constant';
import { useSwapStore } from '@/stores/swap-store';
import { useTokensStore } from '@/stores/tokens-store';
import { useWalletStore } from '@/stores/wallet-store';
import { ArrowUpDown, Loader } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import PriceDetails from './price-details';
import SwapStatus from './swap-status';
import TokenInput from './token-input';
import WalletStatus from './wallet-status';

export default function SwapCard() {
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    isSwapping,
    transactionError,
    status,
    transactionHash,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    revertTokens,
    resetTransaction,
    executeSwap,
  } = useSwapStore();
  const { getTokenByName } = useTokensStore();
  const { isConnected, isConnecting, connect } = useWalletStore();
  const [focusedInput, setFocusedInput] = useState<'pay' | 'receive' | null>(null);

  const fromTokenData = getTokenByName(fromToken);
  const toTokenData = getTokenByName(toToken);

  useEffect(() => {
    if (!fromTokenData || !toTokenData) return;
    if (!fromAmount && !toAmount) return;

    const rate = fromTokenData.price / toTokenData.price;
    const reverseRate = toTokenData.price / fromTokenData.price;

    if (focusedInput === 'pay') {
      const value = Number(fromAmount);
      if (isNaN(value)) return setToAmount('');
      const calculated = (value * rate * 0.997).toFixed(6);
      if (calculated !== toAmount) setToAmount(calculated);
    }

    if (focusedInput === 'receive') {
      const value = Number(toAmount);
      if (isNaN(value)) return setFromAmount('');
      const calculated = ((value * reverseRate) / 0.997).toFixed(6);
      if (calculated !== fromAmount) setFromAmount(calculated);
    }
  }, [fromAmount, toAmount, fromTokenData, toTokenData, focusedInput]);

  const handleFromAmountChange = useCallback((value: string) => {
    setFromAmount(value);
  }, []);

  const handleToAmountChange = useCallback((value: string) => {
    setToAmount(value);
  }, []);

  const handlePercentageClick = useCallback(
    (percent: number) => {
      if (!fromTokenData || typeof fromTokenData.balance !== 'number') return;

      const amount = ((fromTokenData.balance * percent) / 100).toFixed(6);
      setFromAmount(amount);
      setFocusedInput('pay');
    },
    [fromTokenData, setFromAmount],
  );

  const fromBalance = fromTokenData?.balance ?? 0;
  const exceedsBalance = Number(fromAmount) > fromBalance;

  const toAmountNumber = Number(toAmount);
  const minimumReceive =
    !isNaN(toAmountNumber) && toAmountNumber > 0 ? toAmountNumber * (1 - MAX_SLIPPAGE / 100) : 0;

  return (
    <div className="w-full">
      <div className="relative flex flex-col gap-8">
        <TokenInput
          value={fromAmount}
          balance={fromTokenData?.balance ?? 0}
          onValueChange={handleFromAmountChange}
          onFocus={() => setFocusedInput('pay')}
          onBlur={() => setFocusedInput(null)}
          type="pay"
          currency={fromToken}
          onCurrencyChange={setFromToken}
          onPercentageClick={handlePercentageClick}
          error={exceedsBalance ? 'Insufficient balance' : undefined}
        />
        <div className="absolute left-1/2 top-[57%] z-10 -translate-x-1/2 -translate-y-1/2 bg-card rounded-full shadow-md">
          <Button
            size="icon"
            className="rounded-full m-2 bg-input/30 hover:bg-input/50"
            onClick={revertTokens}
          >
            <ArrowUpDown className="text-white" />
          </Button>
        </div>
        <TokenInput
          value={toAmount}
          balance={toTokenData?.balance ?? 0}
          onValueChange={handleToAmountChange}
          onFocus={() => setFocusedInput('receive')}
          onBlur={() => setFocusedInput(null)}
          currency={toToken}
          onCurrencyChange={setToToken}
          type="receive"
        />
      </div>

      <Button
        className="w-full mt-2"
        onClick={() => {
          if (!isConnected) connect();
          else executeSwap();
        }}
        disabled={
          isConnected && (isSwapping || exceedsBalance || !fromAmount || Number(fromAmount) <= 0)
        }
      >
        {isConnecting ? (
          <div className="flex gap-1">
            <Loader className="animate-spin flex justify-center" /> Connecting...
          </div>
        ) : !isConnected ? (
          'Connect Wallet'
        ) : isSwapping ? (
          <div className="flex gap-1">
            <Loader className="animate-spin flex justify-center" /> Swapping...
          </div>
        ) : (
          'Swap'
        )}
      </Button>

      <WalletStatus />
      <SwapStatus />

      <PriceDetails />
      <Separator className="my-2" />
      <div className="flex justify-between text-white text-sm font-semibold">
        <div>Minimum received</div>
        <div>
          {minimumReceive.toFixed(6)} {toToken}
        </div>
      </div>
    </div>
  );
}

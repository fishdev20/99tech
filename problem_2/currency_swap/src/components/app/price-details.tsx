import { FEE_PERCENT, MAX_SLIPPAGE, NETWORK_COST, PRICE_IMPACT } from '@/constant';
import { useSwapStore } from '@/stores/swap-store';
import { useTokensStore } from '@/stores/tokens-store';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

const PriceDetails = ({ minimumReceived }: { minimumReceived: number }) => {
  const { toToken, fromToken } = useSwapStore();
  const { getTokenByName } = useTokensStore();
  const [showDetails, setShowDetails] = useState(false);

  const fromTokenData = getTokenByName(fromToken);
  const toTokenData = getTokenByName(toToken);
  const exchangeRate =
    fromTokenData && toTokenData ? (fromTokenData.price / toTokenData.price).toFixed(6) : '0';

  const exchangeRateDisplay =
    fromToken && toToken && exchangeRate !== '0'
      ? `1 ${fromToken} = ${exchangeRate} ${toToken}`
      : 'Fetching rate...';
  return (
    <>
      <div className="text-xs text-left text-gray-500 flex justify-between items-center">
        {exchangeRateDisplay}
        <Button
          size={'icon'}
          variant={'ghost'}
          className="hover:bg-card hover:text-white justify-end"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
      {showDetails && (
        <div className="text-xs text-gray-500 flex flex-col gap-0.5">
          <div className="flex justify-between">
            <div className="flex items-center justify-center gap-1">
              Fee ({(FEE_PERCENT * 100).toFixed(1)}%) <Info className="w-2.5 h-2.5" />
            </div>
            <div>Included</div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center justify-center gap-1">
              Network cost <Info className="w-2.5 h-2.5" />
            </div>
            <div>${NETWORK_COST}</div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center justify-center gap-1">
              Price impact <Info className="w-2.5 h-2.5" />
            </div>
            <div>-{PRICE_IMPACT.toFixed(2)}%</div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center justify-center gap-1">
              Max slippage <Info className="w-2.5 h-2.5" />
            </div>
            <div>{MAX_SLIPPAGE}%</div>
          </div>
        </div>
      )}
    </>
  );
};
export default PriceDetails;

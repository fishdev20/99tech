import { CircleX } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import TokensSelector from './tokens-selector';

interface TokenInputProps {
  value: string;
  currency: string;
  balance: number;
  onValueChange: (value: string) => void;
  onCurrencyChange: (currency: string) => void;
  type: 'pay' | 'receive';
  onFocus?: () => void;
  onBlur?: () => void;
  onPercentageClick?: (percent: number) => void;
  error?: string;
}
const TokenInput = ({
  value,
  currency,
  balance = 0,
  type,
  onValueChange,
  onCurrencyChange,
  onBlur,
  onFocus,
  onPercentageClick,
  error,
}: TokenInputProps) => {
  const preventInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };
  return (
    <div className="bg-input/30 rounded-xl p-4 space-y-2">
      <div className="flex justify-between text-sm text-gray-400">
        <span>You {type}</span>
        <span>
          Balance: {balance} {currency}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <Input
          className="no-spinner bg-transparent text-2xl border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          type="number"
          placeholder="0.00"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={preventInvalidKeys}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        <TokensSelector currency={currency} onCurrencyChange={onCurrencyChange} />
      </div>
      {error ? (
        <p className="text-xs text-red-500 text-left flex gap-1 items-center h-3">
          <CircleX className="w-3 h-3" />
          {error}
        </p>
      ) : (
        <p className="h-3" />
      )}

      {type === 'pay' && onPercentageClick && (
        <div className="grid grid-cols-5 gap-1 mt-2">
          {[15, 25, 50, 75, 100].map((percent) => (
            <Button
              key={percent}
              variant="outline"
              size={'sm'}
              className="text-sm text-white bg-input/30 border-input hover:bg-input/50"
              onClick={() => onPercentageClick(percent)}
            >
              {percent}%
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenInput;

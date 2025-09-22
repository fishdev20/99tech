import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTokensStore } from '@/stores/tokens-store';

interface TokensSelectorProps {
  currency: string;
  onCurrencyChange: (value: string) => void;
  className?: string;
}

const TokensSelector = ({ currency, onCurrencyChange }: TokensSelectorProps) => {
  const { tokens } = useTokensStore();

  const selectedToken = tokens.find((token) => token.currency === currency);

  return (
    <Select value={currency} onValueChange={onCurrencyChange}>
      <SelectTrigger
        className={
          'border-input bg-input/30 hover:bg-input/50 focus-visible:ring-[1px] w-[70%] text-sm rounded-full'
        }
      >
        <SelectValue>
          {selectedToken ? (
            <div className="flex items-center space-x-2">
              <img src={selectedToken.logoURI} alt={selectedToken.currency} className="w-4 h-4" />
              <span>{selectedToken.currency}</span>
              <span className="text-xs text-muted-foreground">
                ${selectedToken.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span>Select a token</span>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {tokens.map((token) => (
          <SelectItem key={token.currency} value={token.currency}>
            <div className="flex items-center space-x-2">
              <img src={token.logoURI} alt={token.currency} className="w-4 h-4" />
              <div className="flex flex-col">
                <span>{token.currency}</span>
                <span className="text-xs text-muted-foreground">
                  ${token.price.toLocaleString()}
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TokensSelector;

import { useSwapStore } from '@/stores/swap-store';
import { AlertCircleIcon, CheckCircle2Icon, CopyIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';

const SwapStatus = () => {
  const { transactionError, status, transactionHash } = useSwapStore();

  const handleCopy = () => {
    if (transactionHash) {
      navigator.clipboard.writeText(transactionHash);
    }
  };

  if (status === 'failed' && transactionError) {
    return (
      <Alert variant="destructive" className="text-left bg-input/30 mt-2">
        <AlertCircleIcon />
        <AlertTitle>Transaction Failed</AlertTitle>
        <AlertDescription>{transactionError}</AlertDescription>
      </Alert>
    );
  }

  if (status === 'success' && transactionHash) {
    return (
      <Alert className="border border-green-400 text-left text-green-400 bg-input/30 mt-2">
        <CheckCircle2Icon />
        <AlertTitle>Swap Successful!</AlertTitle>
        <AlertDescription>
          <div className="flex gap-1 text-xs bg-input px-2 py-0.5 rounded font-mono items-center">
            <span>
              {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="text-green-400 hover:text-green-500"
              onClick={handleCopy}
            >
              <CopyIcon size={12} />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default SwapStatus;

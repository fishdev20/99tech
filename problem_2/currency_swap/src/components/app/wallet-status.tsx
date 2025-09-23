import { useWalletStore } from '@/stores/wallet-store';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const WalletStatus = () => {
  const { connectionError } = useWalletStore();

  if (!connectionError) return null;
  return (
    <Alert variant="destructive" className="text-left bg-input/30 mt-2">
      <AlertCircleIcon />
      <AlertTitle>Connect Wallet Failed.</AlertTitle>
      <AlertDescription>
        <p>{connectionError}</p>
      </AlertDescription>
    </Alert>
  );
};

export default WalletStatus;

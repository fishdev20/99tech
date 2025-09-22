import { Dot, Loader, Settings, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import './App.css';
import LimitCard from './components/app/limit-card';
import SwapCard from './components/app/swap-card';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from './components/ui/motion-tabs';
import { useTokensStore } from './stores/tokens-store';
import { useWalletStore } from './stores/wallet-store';

function App() {
  const [tab, setTab] = useState<'swap' | 'limit'>('swap');

  const { isLoading, error, getTokens } = useTokensStore();
  const { isConnected, isConnecting, address, connect } = useWalletStore();

  useEffect(() => {
    getTokens();
  }, []);

  useEffect(() => {
    if (isConnected) {
      getTokens(true); // Re-fetch with balance once wallet connects
    }
  }, [isConnected]);

  return (
    <div className="flex flex-col gap-2 relative w-full max-w-md mx-auto">
      <div className="flex justify-end">
        {(!isConnected || isConnecting) && (
          <Button size={'sm'} onClick={connect} disabled={isConnected || isConnecting}>
            {isConnecting ? (
              <div className="flex gap-1">
                <Loader className="animate-spin flex justify-center" /> Connecting...
              </div>
            ) : (
              'Connect Wallet'
            )}
          </Button>
        )}
        {isConnected && (
          <div className="border border-red-500 p-2 rounded-xl bg-card text-red-500 flex">
            <Dot className="text-red-500" />
            {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
          </div>
        )}
      </div>

      <Card className="relative w-full max-w-md mx-auto text-white shadow-xl rounded-xl p-6 space-y-6 border border-input">
        {/* <Backdrop
          open={isLoading}
          variant="blur"
          className="absolute items-center justify-center rounded-xl"
        >
          <div className="animate-pulse flex gap-2">
            <Loader className="animate-spin text-primary flex justify-center" /> Loading tokens...
          </div>
        </Backdrop> */}
        <Tabs value={tab} onValueChange={(value) => setTab(value as 'swap' | 'limit')}>
          <div className="flex items-center justify-between mb-2">
            <TabsList className="rounded-full">
              <TabsTrigger value="swap">Swap</TabsTrigger>
              <TabsTrigger value="limit">Limit</TabsTrigger>
            </TabsList>
            {tab === 'swap' && (
              <div className="flex gap-2">
                <Button size="icon" variant="destructive" className="bg-input/30 hover:bg-input/50">
                  <Settings size={18} />
                </Button>
                <Button size="icon" variant="secondary">
                  <SlidersHorizontal size={18} />
                </Button>
              </div>
            )}
          </div>
          <TabsContents className="py-6">
            <TabsContent value="swap" className="flex flex-col gap-6">
              <SwapCard />
            </TabsContent>
            <TabsContent value="limit" className="flex flex-col gap-6">
              <LimitCard />
            </TabsContent>
          </TabsContents>
        </Tabs>
      </Card>
    </div>
  );
}

export default App;

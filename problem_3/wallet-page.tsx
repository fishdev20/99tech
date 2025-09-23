interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string; //
}
// interface FormattedWalletBalance {
//     currency: string;
//     amount: number;
//     formatted: string;
// }

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo' | string; // fallback for unknown blockchains;

const PRIORITY_MAP: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  };


interface Props extends BoxProps {

}

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props; // children is not used anywhere
    const balances = useWalletBalances();
    const prices = usePrices();

    const getPriority = (blockchain: Blockchain): number => {
        return PRIORITY_MAP[blockchain] ?? -99;
    };

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (lhsPriority > -99) { // lhsPriority is undefined
                if (balance.amount <= 0) {
                    return true;    // Keeping balances with amount ≤ 0 is likely unintentional
                }
            }
            return false
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }
            // Doesn’t return 0 for equal priorities (although usually fine).
        });
    }, [balances, prices]); //price is unused, may causes unnecessary rerender when price change

    const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
        return balances
          .filter((balance) => {
            const priority = getPriority(balance.blockchain);
            return priority > -99 && balance.amount > 0;
          })
          .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain)) //combine soft with formatting
          .map((balance) => ({
            ...balance,
            formatted: balance.amount.toFixed(2),
          }));
      }, [balances]);

    const rows = useMemo(() => { return formattedBalances.map((balance: FormattedWalletBalance) => {
        const usdValue = (prices[balance.currency] ?? 0) * balance.amount; // add fallback
        return (
            <WalletRow
                className={classes.row} // style reference is undefined
                key={`${balance.blockchain}-${balance.currency}`} // use this instead of index
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        )
    })
    }, [formattedBalances, prices]); //memoization of rendered rows

    //Fallback
    if (!balances || !prices) return <div>Loading...</div>
    if (balances.length === 0) return <div>No balances available</div>

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}

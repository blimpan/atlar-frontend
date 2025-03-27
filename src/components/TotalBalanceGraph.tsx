import { useEffect, useState } from 'react';
import { convertCurrency } from '../util/Currency';
import LineChart from './LineChart';
import LoadingGif from './LoadingGif';
import { getHistoricalBalance, getAccounts } from '../util/ApiHandler';
import { Account, Balance } from '../types';

interface ComponentProps {
    setCurrency: (newCurrency: string) => void;
    currentCurrency: string;
};

export default function TotalBalanceGraph({ currentCurrency }: Readonly<ComponentProps>) {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalBalancesByDate, setTotalBalancesByDate] = useState<Record<string, number>>({});
    const [localTargetCurrency, setLocalTargetCurrency] = useState<string>(currentCurrency);
    const [graphLabels, setGraphLabels] = useState<string[]>([]);
    const [graphValues, setGraphValues] = useState<number[]>([]);
    

    function updateGraph() {

        // Convert the object to a sorted array (oldest to newest)
        const sortedEntries = Object.entries(totalBalancesByDate).sort(
            (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
        );
        
        setGraphLabels(sortedEntries.map(([date]) => {

            const formattedDate = date.split('-').reverse().join('/').slice(0, 5); // turn a date like "2022-03-15" into "15/03"
            return formattedDate;
          }));

        setGraphValues(sortedEntries.map(([, value]) => {
            // return ( (Math.random() * 0.1) + 0.9) * value; // Use this for a line with random variations
            return value; // Use this for actual line
        }));;
    }

    async function getBalancesByDate(accountId: string) {

        const balances = await getHistoricalBalance(accountId, 14);
        
        let balancesByDate: Record<string, number> = {};

        balances.forEach((balance:Balance) => {
            const date = balance.localDate;
            const type = balance.reportedType;
            if (type === "OPEN") {
                const amount = convertCurrency(balance.amount.value/100, balance.amount.currency, currentCurrency);
                balancesByDate[date] = amount;
            }
        });

        return balancesByDate;
    };


    useEffect(() => {

        setLoading(true);
        setError(null);

            (async () => {
                try {

                    const storageBalances = sessionStorage.getItem('totalBalancesByDate');
                    let localTotalBalancesByDate: Record<string, number> = {};

                    if (storageBalances) { // We already have total balances by date

                        localTotalBalancesByDate = await JSON.parse(storageBalances) as Record<string, number>;

                    } else {
    
                        const storageAccounts = sessionStorage.getItem('accounts');
                        let allAccounts: Account[] = [];
                        
                        if (storageAccounts) {
                            allAccounts = JSON.parse(storageAccounts) as Account[];
        
                        } else {
                            allAccounts = await getAccounts();
                            sessionStorage.setItem('accounts', JSON.stringify(allAccounts));
                        }
        
                        for (const account of allAccounts) {
                            const balancesByDateForAccount = await getBalancesByDate(account.id);
        
                            for (const date in balancesByDateForAccount) {
                                localTotalBalancesByDate[date] = (localTotalBalancesByDate[date] || 0) + balancesByDateForAccount[date];
                            }
                        }
                        sessionStorage.setItem('totalBalancesByDate', JSON.stringify(localTotalBalancesByDate));
                    }
    
                    setTotalBalancesByDate( {...localTotalBalancesByDate} );
                    
                } catch (err) {
                    setError('Failed to fetch total balances by date.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            })();

        setLoading(false);

    }, []);

    useEffect(() => {
        const updatedBalances = { ...totalBalancesByDate };
        for (const date in updatedBalances) {
            const convertedBalance = convertCurrency(updatedBalances[date], localTargetCurrency, currentCurrency); 
            updatedBalances[date] = convertedBalance;
        }
        setTotalBalancesByDate(updatedBalances);
        setLocalTargetCurrency(currentCurrency);


    }, [currentCurrency]);

    useEffect(() => {
        updateGraph();
    }, [totalBalancesByDate]);

    // if (loading) return <LoadingGif/>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='flex min-w-0 w-full widget-border'>

            <LineChart labels={graphLabels} values={graphValues} />

        </div>
    );
};
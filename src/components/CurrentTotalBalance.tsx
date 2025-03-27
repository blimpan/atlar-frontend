import React, { useEffect, useState } from 'react';
import { convertAndSumBalances, formatCurrencyString, convertCurrency } from '../util/Currency';
import LoadingGif from './LoadingGif';
import { getCurrentBalanceForAll } from '../util/ApiHandler'; 


interface ComponentProps {
    setCurrency: (newCurrency: string) => void;
    currentCurrency: string;
};


export default function CurrentTotalBalance({ setCurrency, currentCurrency}: Readonly<ComponentProps>) {
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [balanceType, setBalanceType] = useState<string>('AVAILABLE');


    function onTypeClick(e: React.MouseEvent<HTMLButtonElement>) {
        setBalanceType(e.currentTarget.value);        
    }


    async function fetchBalances() {

        setLoading(true);
        setError(null);

        try {
                    
            const balancesResponse = await getCurrentBalanceForAll(balanceType, 20);

            const total = convertAndSumBalances(balancesResponse, currentCurrency);
            setTotalBalance(total / 100); // Divide by 100 since the API returns the amount in cents
        
        } catch (err) {
            setError('Failed to fetch balances.');
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalances();
    }, []);

    useEffect(() => {
        fetchBalances();
    }, [balanceType]);


    function changeTargetCurrency(newTarget:string) {
        setTotalBalance(convertCurrency(totalBalance, currentCurrency, newTarget));
        setCurrency(newTarget);
    }
    
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='flex flex-col gap-5 min-w-fit min-h-fit grow widget-border'>
            
            <div className='flex flex-row gap-2 w-fit'>
                <button className={`py-1 px-2 border border-gray-300 rounded-xl text-xs ${balanceType == 'AVAILABLE' ? 'bg-gray-100' : 'hover:shadow-sm'} `} value='AVAILABLE' onClick={onTypeClick}>
                        
                    Available
                </button>
                
                <button className={`py-1 px-2 border border-gray-300 rounded-xl text-xs ${balanceType == 'BOOKED' ? 'bg-gray-100' : 'hover:shadow-sm'} `} value='BOOKED' onClick={onTypeClick}>
                    Booked
                </button>
            </div>

            <div className='flex flex-col gap-2 w-fit'>
                <p className='text-4xl font-semibold'>
                    {totalBalance !== null
                    ? `${formatCurrencyString(totalBalance)}`
                    : 'No data available'}
                </p>

                <div className='flex items-center gap-1.5'>
                    <p className='text-sm font-semibold text-gray-500'>
                        Current cash in
                    </p>

                    <select // Using static list because using every currency in Currency.tsx would be too much
                        className='border border-gray-300 rounded-md text-sm px-1 py-0.5'
                        value={currentCurrency}
                        onChange={(e) => changeTargetCurrency(e.target.value)}
                    >
                        <option value="EUR">EUR</option> 
                        <option value="SEK">SEK</option>
                        <option value="USD">USD</option>
                        <option value="BGN">BGN</option>
                    </select>
                </div>

            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import { Account, Balance, Transaction } from "../types";
import { getAccounts, getSpecificCurrentBalance } from "../util/ApiHandler";
import { checkTransactions, keepOnlyLatest } from "../util/Transaction";
import { useNavigate } from "react-router-dom";


/**
 * @component
 * Displays an overview of alerts related to accounts,
 * including the number of accounts with negative balances and the count of suspicious transactions.
 * It fetches account data, balances, and suspicious transactions on mount and caches the data in session storage.
 *
 * @returns {JSX.Element} A React component that displays alerts and provides navigation to the payments page.
 *
 * @example
 * // Example usage of the component:
 * <AlertsOverview />
 */
export default function AlertsOverview() {

    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [availableBalances, setAvailableBalances] = useState<Balance[]>([]);
    const [susTransactions, setSusTransactions] = useState<Transaction[]>([]); // <accountId, number of suspicious transactions>


    function checkBalances(threshold: number = 1) {
        let underFundedAccs: Account[] = [];

        for (const [index, balance] of availableBalances.entries()) {
            if (balance.amount.value/100 < threshold) {
                underFundedAccs.push(accounts[index]);
            }
        }

        return underFundedAccs.length;
    }

    useEffect(() => {
    
        (async () => {

            setIsLoading(true);

            try {

                const storageItem = sessionStorage.getItem('accounts');
                let allAccounts: Account[] = [];
                
                if (storageItem) {
                    allAccounts = await JSON.parse(storageItem) as Account[];

                } else {
                    allAccounts = await getAccounts();
                    sessionStorage.setItem('accounts', JSON.stringify(allAccounts));

                }

                setAccounts(allAccounts);
    
                let tempAvailableBalances: Balance[] = [];
                let tempSusTransactions: Transaction[] = [];

                for (const account of allAccounts) {

                    const bookedBal: Balance = await getSpecificCurrentBalance(account.id, "BOOKED");
                    tempAvailableBalances.push(bookedBal);

                    const newSusTransactions: Transaction[] = await checkTransactions(account.id);
                    tempSusTransactions.push(...newSusTransactions);

                }

                tempSusTransactions = keepOnlyLatest(tempSusTransactions);

                setAvailableBalances(tempAvailableBalances);
                setSusTransactions(tempSusTransactions);

                sessionStorage.setItem('susTransactions', JSON.stringify(tempSusTransactions));

            } catch (err) {
                setError('Failed to fetch accounts.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }

        })();
    
    }, []);
    
    
    return (
            <div className='flex flex-col gap-4 min-w-fit min-h-fit grow widget-border'>
               
                <div className="flex flex-row gap-1 w-fit items-center">
                    <img src="images/alert.svg" alt="Alert" width={25} className="" />
                    <p className="font-semibold">Alerts</p>
                </div>
                
                <div className="flex flex-col">
                    <p> {!isLoading ? `${checkBalances(0)} accounts are negative!`
                    : `?? accounts are negative!` } </p>

                    <div className="flex flex-row gap-1.5">
                        <p className="whitespace-nowrap"> {!isLoading ? `Found ${susTransactions.length} suspicious transactions!`
                        : `Found ?? suspicious transaction!` } </p>
                        <button className="flex items-center" onClick={() => {navigate('/payments')}}>
                            <img src="images/arrow-right.svg" alt="Right arrow" width={23} className="hover:drop-shadow-lg"/>
                        </button>
                    </div>
                </div>

            </div>
        );
};

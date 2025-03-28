import "./componentStyling.css";
import { getAccounts, getSpecificEntity, getSpecifcAccount, getSpecificCurrentBalance } from "../util/ApiHandler";
import { useEffect, useState } from "react";
import { Account, Entity, Balance } from "../types";
import LoadingGif from "./LoadingGif";
import { convertCurrency, formatCurrencyString } from "../util/Currency";

interface ComponentProps {
    setCurrency: (newCurrency: string) => void;
    currentCurrency: string;
};


/**
 * @component
 * A React functional component that displays a list of bank accounts along with their associated entities,
 * booked balances, and converted balances in the specified currency. The component fetches data from
 * session storage or makes API calls to retrieve the necessary information.
 *
 * @param {Readonly<ComponentProps>} props - The component props.
 * @param {string} props.currentCurrency - The currency in which the balances should be displayed.
 *
 * @returns {JSX.Element} A table displaying the list of accounts and their details.
 * 
 * @example
 * ```tsx
 * <AccountsList currentCurrency="USD" />
 * ```
 */
export default function AccountsList({ currentCurrency }: Readonly<ComponentProps>) {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [bookedBalances, setBookedBalances] = useState<Balance[]>([]);

    
    useEffect(() => {
        setIsLoading(true);

        (async () => {
            try {

                const storageAccounts = sessionStorage.getItem('accounts');
                let allAccounts: Account[] = [];
                
                if (storageAccounts) {
                    allAccounts = await JSON.parse(storageAccounts) as Account[];

                } else {
                    allAccounts = await getAccounts();
                    sessionStorage.setItem('accounts', JSON.stringify(allAccounts));
                }

                setAccounts(allAccounts);

                const storageEntities = sessionStorage.getItem('entities');
                let tempEntities: Entity[] = [];

                const storageBookedBalances = sessionStorage.getItem('bookedBalances');
                let tempBookedBalances: Balance[] = [];

                if (storageEntities && storageBookedBalances) { // We already have entities and balances

                    tempEntities = await JSON.parse(storageEntities) as Entity[];
                    tempBookedBalances = await JSON.parse(storageBookedBalances) as Balance[];

                } else {

                    for (const account of allAccounts) {
                        const entity: Entity = await getSpecificEntity(account.entityId);
                        tempEntities.push(entity);
    
                        const bookedBal: Balance = await getSpecificCurrentBalance(account.id, "BOOKED");
                        tempBookedBalances.push(bookedBal);
                    }

                    sessionStorage.setItem('entities', JSON.stringify(tempEntities));
                    sessionStorage.setItem('bookedBalances', JSON.stringify(tempBookedBalances));
                }

                setEntities(tempEntities);
                setBookedBalances(tempBookedBalances);

            } catch (err) {
                setError(`Initial fetch failed: ${err}`);
                console.error(err);
            } finally {
                setIsLoading(false);
            }

        })();

    }, []);


    return (
        <div className="flex flex-col w-full widget-border">

            <div className="flex flex-row px-4 gap-2 py-1 font-semibold"> {/* Header */}
                <p className="">Bank accounts</p>
                <p className="self-center text-gray-500 text-sm ">{accounts.length} accounts</p>
            </div>

            <table className="table-fixed lg:table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="custom-table-cell font-medium">Bank</th>
                        <th className="custom-table-cell font-medium">Entity</th>
                        <th className="custom-table-cell font-medium">Account name</th>
                        <th className="custom-table-cell font-medium">Booked balance</th>
                        <th className="custom-table-cell font-medium">in {currentCurrency}</th>
                    </tr>
                </thead>

                {!isLoading ? (
                     <tbody>
                     {accounts.map((account, index) => {
                         return (
                             <tr key={account.id}>
                                <td className="custom-table-cell">
                                    <div className="flex flex-row items-center">
                                        <img src="/images/stripe.svg" alt="Stripe logo" width={30}/>
                                        <p>Sample bank</p>
                                    </div>
                                </td>
                                 <td className="custom-table-cell">{entities[index].legalName || "Sample entity" }</td>
                                 <td className="custom-table-cell">{account.name || "Unknown name"}</td>
                                 <td className={`custom-table-cell ${bookedBalances[index].amount.value < 0 ? 'bg-red-300' : ''}`}>{formatCurrencyString(bookedBalances[index].amount.value/100)} {bookedBalances[index].amount.currency}</td>
                                 <td className="custom-table-cell">{formatCurrencyString(convertCurrency(bookedBalances[index].amount.value/100, bookedBalances[index].amount.currency, currentCurrency))} {currentCurrency}</td>
                             </tr>
                         );
                     })}
                 </tbody>
                ) : (
                    <tbody>
                        <tr>
                            <td colSpan={5}>
                                {!error && <LoadingGif/> } 
                            </td>
                        </tr>
                    </tbody>  
                )}
                
            </table>
        </div>
    );
};

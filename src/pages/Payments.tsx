import { useEffect, useState } from "react";
import SidePanel from "../components/SidePanel";
import { Account, Balance, Transaction } from "../types";
import LoadingGif from "../components/LoadingGif";
import { getAccounts, getTransactions } from "../util/ApiHandler";
import {
  checkTransactions,
  isSuspicious,
  keepOnlyLatest,
} from "../util/Transaction";
import { convertCurrency, formatCurrencyString } from "../util/Currency";

export default function Payments() {
  const [showSidePanel, setShowSidePanel] = useState<boolean>(true);
  const [susTransactions, setSusTransactions] = useState<Transaction[]>([]);
  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [targetCurrency, setTargetCurrency] = useState<string>("EUR");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  function onTogglePanel() {
    setShowSidePanel(!showSidePanel);
  }

  async function onSelectAccount(e: any) {
    // TODO: Fix type. Using any for now since it can be both a click and a select event
    const selected =
      accounts.find((account) => account.id === e.target.value) ?? null;

    if (selected) {
      setIsLoading(true);

      const accountTransactions = await getTransactions(
        selected.id,
        "RECONCILED",
        25
      );

      const selectElement = document.querySelector("select"); // Set the drown-down menu to the selected account
      if (selectElement) {
        selectElement.value = selected.id;
      }

      setDisplayedTransactions(accountTransactions);
      setIsLoading(false);
    } else {
      setDisplayedTransactions(susTransactions);
    }

    setSelectedAccount(selected);
  }

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      try {
        const storageSus = sessionStorage.getItem("susTransactions");
        let allSusTransactions: Transaction[] = [];

        const storageAccounts = sessionStorage.getItem("accounts");
        let allAccounts: Account[] = [];

        if (storageAccounts) {
          allAccounts = (await JSON.parse(storageAccounts)) as Account[];
        } else {
          allAccounts = await getAccounts();
          sessionStorage.setItem("accounts", JSON.stringify(allAccounts));
        }

        if (storageSus) {
          // We already have suspicious transactions and dont need to check again
          allSusTransactions = (await JSON.parse(storageSus)) as Transaction[];
        } else {
          // We need to check for suspicious transactions

          for (const account of allAccounts) {
            const tempSusTransaction: Transaction[] = await checkTransactions(
              account.id
            );
            allSusTransactions.push(...tempSusTransaction);
          }
        }

        allSusTransactions = keepOnlyLatest(allSusTransactions);

        setAccounts(allAccounts);
        setSusTransactions(allSusTransactions);
        setDisplayedTransactions(allSusTransactions);
      } catch (error) {
        setError(`Something in inital fetch went wrong: ${error}`);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex w-full h-full">
      <div
        className={`flex left-0 max-w-max transform transition-transform duration-200 ease-in-out ${
          showSidePanel ? "translate-x-0" : "-translate-x-[110%]"
        } `}
      >
        {showSidePanel && (
          <SidePanel
            isVisible={showSidePanel}
            toggleVisibility={onTogglePanel}
          />
        )}
      </div>

      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row w-full h-fit border-b border-gray-300">

          {/* Header */}
          {!showSidePanel && (
            <button
              className="mx-4 my-1.5 px-2 border rounded-lg border-gray-300 flex flex-row items-center gap-2 font-semibold hover:shadow-sm"
              onClick={onTogglePanel}
            >
              <img
                src="/images/show-sidepanel.svg"
                alt="Side panel"
                width={30}
              />
              Menu
            </button>
          )}
          <p className="font-semibold p-4">Payments</p>
        </div>

        <div className="flex flex-col w-full h-full gap-4 p-4 fade-in">

          {/* Widgets */}
          <div className="flex flex-row gap-6 w-fit h-fit">

            {/* Settings */}
            <div className="flex items-center">

              {/* Account selector */}
              <select
                className="text-lg font-semibold px-1 py-0.5"
                onChange={onSelectAccount}
                defaultValue=""
              >
                <option value="" disabled>
                  Select account
                </option>
                <option value="">All (suspicious)</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name || `Account ${account.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1.5">

              {/* Currency selector */}
              <p className="text-sm">Show in</p>
              <select // Using static list because using every currency in Currency.tsx would be too much
                className="border border-gray-300 rounded-md text-sm px-1 py-0.5"
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value)}
              >
                <option value="EUR">EUR</option>
                <option value="SEK">SEK</option>
                <option value="USD">USD</option>
                <option value="BGN">BGN</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col w-full widget-border fade-in">

            {/* Transactions table */}
            <div className="flex flex-row px-4 gap-2 py-1 font-semibold">

              {/* Table header */}
              <p className="">

                {selectedAccount ? "Account" : "All suspicious"} transactions
              </p>
              <p className="self-center text-gray-500 text-sm ">

                Showing {displayedTransactions.length} most recent
                transaction(s)
              </p>
            </div>
            <table className="table-fixed lg:table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="custom-table-cell font-medium">Date</th>
                  <th className="custom-table-cell font-medium">
                    Transaction ID
                  </th>
                  <th className="custom-table-cell font-medium">Amount</th>
                  <th className="custom-table-cell font-medium">
                    in {targetCurrency}
                  </th>
                  <th className="custom-table-cell font-medium">Status</th>
                  {!selectedAccount && (
                    <th className="custom-table-cell font-medium">Account</th>
                  )}
                </tr>
              </thead>

              {!isLoading ? (
                <tbody>
                  {displayedTransactions.map(
                    (transaction: Transaction, index: number) => {
                      return (
                        <tr key={transaction.id}>
                          <td className="custom-table-cell">
                            {transaction.date || "YYYY-MM-DD"}
                          </td>
                          <td className="custom-table-cell">
                            {transaction.id || "Unknown account"}
                          </td>
                          <td
                            className={`custom-table-cell ${
                              isSuspicious(transaction) && "bg-red-300"
                            } `}
                          >
                            {formatCurrencyString(
                              transaction.amount.value / 100
                            )}
                            {transaction.amount.currency}
                          </td>
                          <td className="custom-table-cell">
                            {formatCurrencyString(
                              convertCurrency(
                                transaction.amount.value / 100,
                                transaction.amount.currency,
                                targetCurrency
                              )
                            )}
                            {targetCurrency}
                          </td>
                          <td className="custom-table-cell">

                            <p
                              className={`w-fit font-semibold text-sm ${
                                transaction.reconciliationStatus == "RECONCILED"
                                  ? "bg-green-300 "
                                  : "bg-red-300"
                              }`}
                            >
                              {transaction.reconciliationStatus}
                            </p>
                          </td>
                          {!selectedAccount && (
                            <td className="custom-table-cell">

                              <button
                                className="w-full h-full border border-gray-300 rounded-lg p-1 hover:shadow-sm"
                                value={transaction.accountId}
                                onClick={onSelectAccount}
                              >
                                Go to
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    }
                  )}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={5}>{!error && <LoadingGif />}</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

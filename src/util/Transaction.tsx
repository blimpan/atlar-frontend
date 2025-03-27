import { Transaction } from "../types";
import { getTransactions } from "./ApiHandler";
import { convertCurrency } from "./Currency";


export async function checkTransactions(accountId: string, threshold: number = 10000): Promise<Transaction[]> {
        let tempAllTransactions: Transaction[] = [];

        const reconciledTransactions: Transaction[] = await getTransactions(accountId, "RECONCILED");

        tempAllTransactions.push(...reconciledTransactions);

        /*
        const notReconciledTransactions: Transaction[] = await getTransactions(accountId, "NOT_RECONCILED");
        tempAllTransactions.push(...notReconciledTransactions);
        */

        let susTransactions: Transaction[] = [];

        for (const transaction of tempAllTransactions) {
            if (Math.abs(convertCurrency(transaction.amount.value/100, transaction.amount.currency, "EUR")) > threshold) {
                susTransactions.push(transaction);
            }
        }

        return susTransactions;
}


export function isSuspicious(transaction: Transaction, threshold: number = 10000): boolean {
    return Math.abs(convertCurrency(transaction.amount.value/100, transaction.amount.currency, "EUR")) > threshold;
    
}


export function keepOnlyLatest(transactions: Transaction[]): Transaction[] {
    const transactionMap: { [id: string]: Transaction } = {};

    for (const newTransaction of transactions) {
        if (transactionMap[newTransaction.id]) { // We already have a transaction with this id
            
            const oldTransaction = transactionMap[newTransaction.id];
            
            if (new Date(newTransaction.created) > new Date(oldTransaction.created)) { // The new transaction is more recent
                transactionMap[newTransaction.id] = newTransaction;
            }

        } else {
            transactionMap[newTransaction.id] = newTransaction;
        }
    }

    return Object.values(transactionMap);
}
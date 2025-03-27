import axios from 'axios';
import { Account, Transaction } from '../types';


const apiBaseUrl = import.meta.env.VITE_ATLAR_API_URL as string;
const apiAuth = import.meta.env.VITE_ATLAR_AUTH as string;

const apiOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: apiAuth
    }
};


/**
 * Fetches all available account balances.
 *
 * @param {string} balanceType - The type of balances to retrieve (e.g., "AVAILABLE", "BOOKED").
 * @param {number} [limit=20] - The maximum number of balances to fetch. Defaults to 20.
 * @returns {Promise<any[]>} A promise that resolves to an array of balance items.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getCurrentBalanceForAll(balanceType: string, limit: number = 20) {

    const balancesUrl = `${apiBaseUrl}accounts/-/balances?type=${balanceType}&mostRecent=true&limit=${limit}`;
    const response = await axios.get(`${balancesUrl}`, apiOptions);
    return response.data.items;
}


/**
 * Fetches all available accounts.
 *
 * @async
 * @function
 * @returns {Promise<Account[]>} A promise that resolves to an array of account objects.
 * @throws {AxiosError} Throws an error if the API request fails.
 */
export async function getAccounts(limit: number = 100) {
    const accountsUrl = `${apiBaseUrl}accounts?limit=${limit}`;
    const accountsResponse = await axios.get(accountsUrl, apiOptions);
    return accountsResponse.data.items;
}


/**
 * Fetches the historical balances for a specific account.
 *
 * @param accountId - The unique identifier of the account for which to retrieve balances.
 * @returns A promise that resolves to an array of balance items.
 * @throws An error if the API request fails.
 */
export async function getHistoricalBalance(accountId: string, days: number = 14) {
    const limit = days * 2; // multiply days by 2 since we get two balances per day
    const balancesUrl = `${apiBaseUrl}accounts/${accountId}/balances?type=AVAILABLE&mostRecent=false&limit=${limit}`;
    const balancesResponse = await axios.get(balancesUrl, apiOptions);
    return balancesResponse.data.items;
}


/**
 * Fetches the current balances for a specific account.
 *
 * @param accountId - The unique identifier of the account for which to retrieve balances.
 * @returns A promise that resolves to an array of balance items.
 * @throws An error if the API request fails.
 */
export async function getSpecificCurrentBalance(accountId: string, balanceType: string) {
    const balanceUrl = `${apiBaseUrl}accounts/${accountId}/balances?type=${balanceType}&mostRecent=true&limit=1`;
    const balanceResponse = await axios.get(balanceUrl, apiOptions);
    return balanceResponse.data.items[0];
}


/**
 * Fetches account details for a given account ID.
 *
 * @param accountId - The unique identifier of the account to retrieve.
 * @returns A promise that resolves to the account data.
 * @throws Will throw an error if the request fails.
 */
export async function getSpecifcAccount(accountId: string) {
    const accountUrl = `${apiBaseUrl}accounts/${accountId}`;
    const accountResponse = await axios.get(accountUrl, apiOptions);
    return accountResponse.data;
}


/**
 * Fetches an entity details for a given entity ID.
 *
 * @param entityId - The unique identifier of the entity to retrieve.
 * @returns A promise that resolves to the data of the requested entity.
 * @throws Will throw an error if the API request fails.
 */
export async function getSpecificEntity(entityId: string) {
    const entityUrl = `${apiBaseUrl}entities/${entityId}`;
    const entityResponse = await axios.get(entityUrl, apiOptions);
    return entityResponse.data;
}


export async function getTransactions(accountId: string, reconciliationStatus: string, limit: number = 25): Promise<Transaction[]> {
    const transactionsUrl = `${apiBaseUrl}transactions?accountId=${accountId}&reconciliationStatus=${reconciliationStatus}&limit=${limit}`;
    const transactionsResponse = await axios.get(transactionsUrl, apiOptions);
    return transactionsResponse.data.items;
    
}
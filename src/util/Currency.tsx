
import { Balance } from '../types';

const exchangeRates: Record<string, number> = {
    EUR: 1,
    USD: 1,
    GBP: 1,
    SEK: 10,
    NOK: 10,
    DKK: 10,
    BGN: 2,
    IQD: 1422,
};


export function convertAndSumBalances(
    balances: Balance[],
    targetCurrency: string,
): number {
    return balances.reduce((sum, item) => {
        const convertedValue = convertCurrency(item.amount.value, item.amount.currency, targetCurrency);
        // console.log(`${item.amount.value} in ${item.amount.currency} is allegedly ${convertedValue} in ${targetCurrency}`);
        return sum + convertedValue;
    }, 0);
}

export function convertCurrency(
    value: number,
    fromCurrency: string,
    toCurrency: string
): number {

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
    }

    const valueInBaseCurrency = value / exchangeRates[fromCurrency];
    return Math.round(valueInBaseCurrency * exchangeRates[toCurrency] * 100) / 100;
}

export function formatCurrencyString(
    value: number,
) {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(value)
    .replace(',', '.')
};
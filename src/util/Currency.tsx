import { Balance } from "../types";

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

/**
 * Converts and sums an array of balances into a target currency.
 *
 * @param balances - An array of balance objects, each containing an amount and its currency.
 * @param targetCurrency - The currency to which all balances should be converted.
 * @returns The total sum of all balances converted to the target currency.
 */
export function convertAndSumBalances(
  balances: Balance[],
  targetCurrency: string
): number {
  return balances.reduce((sum, item) => {
    const convertedValue = convertCurrency(
      item.amount.value,
      item.amount.currency,
      targetCurrency
    );
    // console.log(`${item.amount.value} in ${item.amount.currency} is allegedly ${convertedValue} in ${targetCurrency}`);
    return sum + convertedValue;
  }, 0);
}

/**
 * Converts a monetary value from one currency to another based on the set exchange rates.
 *
 * @param value - The monetary value to be converted.
 * @param fromCurrency - The currency code of the original currency (e.g., "USD").
 * @param toCurrency - The currency code of the target currency (e.g., "EUR").
 * @returns The converted monetary value rounded to two decimal places.
 * @throws {Error} If either the `fromCurrency` or `toCurrency` is not supported.
 */
export function convertCurrency(
  value: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
    throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
  }

  const valueInBaseCurrency = value / exchangeRates[fromCurrency];
  return (
    Math.round(valueInBaseCurrency * exchangeRates[toCurrency] * 100) / 100
  );
}

/**
 * Formats a numeric value into a currency string using French locale formatting.
 * The formatted string will have exactly two decimal places and use a period (.)
 * as the decimal separator instead of a comma (,).
 *
 * @param value - The numeric value to be formatted as a currency string.
 * @returns A string representing the formatted currency value.
 */
export function formatCurrencyString(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace(",", ".");
}

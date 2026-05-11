export const CURRENCIES = {
  TND: { symbol: "TND", label: "TND (د.ت)", locale: "en-US" },
  USD: { symbol: "$", label: "USD ($)", locale: "en-US" },
  EUR: { symbol: "\u20AC", label: "EUR (\u20AC)", locale: "en-US" },
  GBP: { symbol: "\u00A3", label: "GBP (\u00A3)", locale: "en-US" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export function formatBalance(amount: number, currencyCode: CurrencyCode = "TND"): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.TND;
  const formatted = Math.abs(amount).toLocaleString(config.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${config.symbol}${formatted}`;
}

export function formatAmount(amount: number, currencyCode: CurrencyCode = "TND"): string {
  if (amount === 0) return `+${formatBalance(0, currencyCode)}`;
  const abs = formatBalance(Math.abs(amount), currencyCode);
  return amount > 0 ? `+${abs}` : `-${abs}`;
}

export function formatShort(amount: number, currencyCode: CurrencyCode = "TND"): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.TND;
  if (Math.abs(amount) >= 1000) {
    return `${config.symbol}${(Math.abs(amount) / 1000).toFixed(0)}k`;
  }
  const formatted = Math.abs(amount).toLocaleString(config.locale);
  return `${config.symbol}${formatted}`;
}

export const CURRENCIES = ['MYGG', 'GRANDO', 'TICKET'] as const;

export type Currency = (typeof CURRENCIES)[number];
export type SpendableCurrency = Extract<Currency, 'MYGG' | 'GRANDO'>;

export type Balances = Record<Currency, number>;
export type BalanceChange = Partial<Record<Currency, number>>;

export const CURRENCY_INFO: Record<Currency, { name: string; unit: string; category: string }> = {
  MYGG: { name: 'MYGG Coins', unit: 'MYGG', category: 'currency' },
  GRANDO: { name: 'Grando', unit: 'Grando', category: 'currency' },
  TICKET: { name: 'Ticket', unit: 'Ticket', category: 'item' },
};

export const WALLET_COLUMN: Record<Currency, 'mygg_coins' | 'grando' | 'tickets'> = {
  MYGG: 'mygg_coins',
  GRANDO: 'grando',
  TICKET: 'tickets',
};

export const isCurrency = (value: string): value is Currency =>
  (CURRENCIES as readonly string[]).includes(value);

export const formatCount = (value: number): string => Math.abs(value).toLocaleString('en-US');

export const formatBaht = (satang: number): string =>
  `฿${(satang / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const signedAmount = (amount: number, currency: Currency): string =>
  `${amount < 0 ? '-' : '+'} ${formatCount(amount)} ${CURRENCY_INFO[currency].unit}`;

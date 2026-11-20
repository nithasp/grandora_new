export const MYGG_COINS_METHOD = 'mygg_coins';

export const MIN_CHARGE_SATANG = 2_000;
export const MAX_CHARGE_SATANG = 15_000_000;

export interface OmiseMethod {
  label: string;
  group: 'card' | 'qr' | 'wallet' | 'banking';
  mobileOnly?: boolean;
  requiresPhone?: boolean;
  maxSatang?: number;
}

export const OMISE_METHODS: Record<string, OmiseMethod> = {
  card: { label: 'Credit / Debit Card', group: 'card' },
  promptpay: { label: 'PromptPay QR', group: 'qr' },
  truemoney_jumpapp: { label: 'TrueMoney Wallet', group: 'wallet', maxSatang: 5_000_000 },
  truemoney: { label: 'TrueMoney Wallet (OTP)', group: 'wallet', requiresPhone: true, maxSatang: 10_000_000 },
  rabbit_linepay: { label: 'Rabbit LINE Pay', group: 'wallet' },
  shopeepay: { label: 'ShopeePay', group: 'wallet' },
  shopeepay_jumpapp: { label: 'ShopeePay App', group: 'wallet', mobileOnly: true },
  alipay: { label: 'Alipay', group: 'wallet', maxSatang: 4_900_000 },
  wechat_pay: { label: 'WeChat Pay', group: 'qr' },
  mobile_banking_kbank: { label: 'K PLUS (KBank)', group: 'banking', mobileOnly: true },
  mobile_banking_scb: { label: 'SCB EASY', group: 'banking', mobileOnly: true },
  mobile_banking_bbl: { label: 'Bualuang mBanking', group: 'banking', mobileOnly: true },
  mobile_banking_bay: { label: 'KMA (Krungsri)', group: 'banking', mobileOnly: true },
  mobile_banking_ktb: { label: 'Krungthai NEXT', group: 'banking', mobileOnly: true },
};

export type PackageKind = 'coins' | 'grando';

export interface PackageItem {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  priceSatang: number;
  priceCoins: number | null;
  currency: string;
  kind: PackageKind;
  grantCurrency: 'MYGG' | 'GRANDO';
  grantAmount: number;
  bonusTickets: number;
  image: string | null;
  badge: string | null;
  savePercent: number | null;
  theme: string;
  game: string;
  featured: boolean;
}

export interface PaymentMethod {
  type: string;
  label: string;
  group: 'coins' | 'card' | 'qr' | 'wallet' | 'banking';
  online: boolean;
  mobileOnly: boolean;
  requiresPhone: boolean;
  maxAmountSatang: number | null;
}

export interface PaymentConfig {
  enabled: boolean;
  testMode: boolean;
  publicKey: string | null;
  currency: string;
  minAmountSatang: number;
  methods: PaymentMethod[];
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded' | 'disputed';

export interface Order {
  id: string;
  status: OrderStatus;
  method: string;
  packageId: number;
  packageName: string;
  amountSatang: number;
  amount: number;
  amountCoins: number;
  currency: string;
  grantCurrency: 'MYGG' | 'GRANDO';
  grantAmount: number;
  bonusTickets: number;
  authorizeUri: string | null;
  qrCodeUri: string | null;
  failureCode: string | null;
  failureMessage: string | null;
  expiresAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface CheckoutResult {
  order: Order;
  nextAction: 'none' | 'redirect' | 'qr' | 'wait';
  authorizeUri: string | null;
  qrCodeUri: string | null;
}

export interface Transaction {
  id: string;
  type: string;
  title: string;
  description: string;
  point: string;
  currency: string;
  date: string;
  createdAt: string;
  orderId: string | null;
  method: string | null;
}

export interface TransactionPage {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StoreItem {
  id: number;
  code: string;
  name: string;
  description: string;
  category: 'avatars' | 'accessories' | 'equipments';
  image: string;
  priceGrando: number | null;
  priceMygg: number | null;
  promoted: boolean;
  owned: boolean;
}

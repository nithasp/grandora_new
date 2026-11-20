import { Currency } from '../modules/wallet/currency';

export interface SeedPackage {
  code: string;
  name: string;
  description: string;
  grantCurrency: 'MYGG' | 'GRANDO';
  grantAmount: number;
  bonusTickets: number;
  priceBaht: number;
  priceCoins: number | null;
  image: string;
  badge: string | null;
  savePercent: number | null;
  theme: string;
  featured: boolean;
}

const art = (file: string) => `/assets/images/package/art/${file}`;
const MYGG_COIN = '/assets/images/package/Polygon 3.png';

export const PACKAGES: SeedPackage[] = [
  {
    code: 'grando-1850',
    name: 'Package 1',
    description: '1,850 Grando + 2 Tickets',
    grantCurrency: 'GRANDO',
    grantAmount: 1850,
    bonusTickets: 2,
    priceBaht: 620,
    priceCoins: 620,
    image: art('grando-1850.png'),
    badge: null,
    savePercent: 20,
    theme: 'gold',
    featured: false,
  },
  {
    code: 'grando-2850',
    name: 'Package 2',
    description: '2,850 Grando + 3 Tickets',
    grantCurrency: 'GRANDO',
    grantAmount: 2850,
    bonusTickets: 3,
    priceBaht: 1050,
    priceCoins: 1050,
    image: art('grando-2850.png'),
    badge: 'MOST POPULAR',
    savePercent: 33,
    theme: 'blue',
    featured: false,
  },
  {
    code: 'grando-4850',
    name: 'Package 3',
    description: '4,850 Grando + 7 Tickets',
    grantCurrency: 'GRANDO',
    grantAmount: 4850,
    bonusTickets: 7,
    priceBaht: 1590,
    priceCoins: 1590,
    image: art('grando-4850.png'),
    badge: 'TIME LIMITED',
    savePercent: 44,
    theme: 'green',
    featured: false,
  },
  {
    code: 'grando-8850',
    name: 'Package 4',
    description: '8,850 Grando + 9 Tickets',
    grantCurrency: 'GRANDO',
    grantAmount: 8850,
    bonusTickets: 9,
    priceBaht: 3250,
    priceCoins: 3250,
    image: art('grando-8850.png'),
    badge: 'TIME LIMITED',
    savePercent: 55,
    theme: 'green',
    featured: false,
  },
  {
    code: 'grando-10850',
    name: 'Package 5',
    description: '10,850 Grando + 9 Tickets',
    grantCurrency: 'GRANDO',
    grantAmount: 10850,
    bonusTickets: 9,
    priceBaht: 3600,
    priceCoins: 3600,
    image: art('grando-10850.png'),
    badge: 'TIME LIMITED',
    savePercent: 66,
    theme: 'pink',
    featured: false,
  },
  {
    code: 'grando-20888',
    name: 'Package 6',
    description: '20,888 Grando + 32 Tickets',
    grantCurrency: 'GRANDO',
    grantAmount: 20888,
    bonusTickets: 32,
    priceBaht: 6550,
    priceCoins: 6550,
    image: art('grando-20888.png'),
    badge: 'RECOMMENDED',
    savePercent: 77,
    theme: 'indigo',
    featured: true,
  },
  {
    code: 'mygg-20',
    name: 'Test Top-up',
    description: '20 MYGG Coins for a real ฿20 payment test',
    grantCurrency: 'MYGG',
    grantAmount: 20,
    bonusTickets: 0,
    priceBaht: 20,
    priceCoins: null,
    image: MYGG_COIN,
    badge: 'TEST',
    savePercent: null,
    theme: 'gold',
    featured: false,
  },
  {
    code: 'mygg-100',
    name: '100 MYGG Coins',
    description: 'Top up 100 MYGG Coins',
    grantCurrency: 'MYGG',
    grantAmount: 100,
    bonusTickets: 0,
    priceBaht: 100,
    priceCoins: null,
    image: MYGG_COIN,
    badge: null,
    savePercent: null,
    theme: 'gold',
    featured: false,
  },
  {
    code: 'mygg-300',
    name: '300 MYGG Coins',
    description: 'Top up 300 MYGG Coins',
    grantCurrency: 'MYGG',
    grantAmount: 300,
    bonusTickets: 0,
    priceBaht: 300,
    priceCoins: null,
    image: MYGG_COIN,
    badge: null,
    savePercent: null,
    theme: 'blue',
    featured: false,
  },
  {
    code: 'mygg-500',
    name: '500 MYGG Coins',
    description: 'Top up 500 MYGG Coins',
    grantCurrency: 'MYGG',
    grantAmount: 500,
    bonusTickets: 0,
    priceBaht: 500,
    priceCoins: null,
    image: MYGG_COIN,
    badge: 'MOST POPULAR',
    savePercent: null,
    theme: 'green',
    featured: false,
  },
  {
    code: 'mygg-1000',
    name: '1,000 MYGG Coins',
    description: 'Top up 1,000 MYGG Coins',
    grantCurrency: 'MYGG',
    grantAmount: 1000,
    bonusTickets: 0,
    priceBaht: 1000,
    priceCoins: null,
    image: MYGG_COIN,
    badge: null,
    savePercent: null,
    theme: 'pink',
    featured: false,
  },
  {
    code: 'mygg-3000',
    name: '3,000 MYGG Coins',
    description: 'Top up 3,000 MYGG Coins',
    grantCurrency: 'MYGG',
    grantAmount: 3000,
    bonusTickets: 0,
    priceBaht: 3000,
    priceCoins: null,
    image: MYGG_COIN,
    badge: 'RECOMMENDED',
    savePercent: null,
    theme: 'indigo',
    featured: true,
  },
];

export interface SeedStoreItem {
  code: string;
  name: string;
  category: 'avatars' | 'accessories' | 'equipments';
  image: number;
  priceGrando: number;
  priceMygg: number;
  promoted: boolean;
  description: string;
}

const item = (
  code: string,
  name: string,
  category: SeedStoreItem['category'],
  image: number,
  priceGrando: number,
  priceMygg: number,
  promoted: boolean,
  description: string,
): SeedStoreItem => ({ code, name, category, image, priceGrando, priceMygg, promoted, description });

export const STORE_ITEMS: SeedStoreItem[] = [
  item('neon-rider', 'Neon Rider', 'avatars', 1, 360, 120, true, 'A street racer who glows after dark.'),
  item('cyber-kitsune', 'Cyber Kitsune', 'avatars', 2, 360, 120, true, 'A fox spirit rebuilt with chrome.'),
  item('street-samurai', 'Street Samurai', 'avatars', 3, 450, 150, false, 'Honour, a blade and a hoodie.'),
  item('pixel-pilot', 'Pixel Pilot', 'avatars', 4, 450, 150, false, 'Flies anything with a joystick.'),
  item(
    'moonlight-mage',
    'Moonlight Mage',
    'avatars',
    5,
    600,
    200,
    true,
    'Casts spells by the light of the moon.',
  ),
  item('arcade-hero', 'Arcade Hero', 'avatars', 6, 750, 250, false, 'Holds the high score on every cabinet.'),
  item('shadow-ranger', 'Shadow Ranger', 'avatars', 7, 900, 300, true, 'Never seen, always one step ahead.'),
  item('halo-visor', 'Halo Visor', 'accessories', 1, 240, 80, true, 'A visor that shows a soft halo.'),
  item('glow-sneakers', 'Glow Sneakers', 'accessories', 2, 240, 80, false, 'Every step lights up the floor.'),
  item('hologram-cap', 'Hologram Cap', 'accessories', 3, 300, 100, false, 'A cap with a spinning hologram.'),
  item(
    'crystal-earrings',
    'Crystal Earrings',
    'accessories',
    4,
    300,
    100,
    false,
    'They chime when you level up.',
  ),
  item('pulse-gloves', 'Pulse Gloves', 'accessories', 5, 360, 120, true, 'Gloves that pulse with the music.'),
  item('comet-scarf', 'Comet Scarf', 'accessories', 6, 420, 140, false, 'Leaves a trail of stardust.'),
  item('echo-headset', 'Echo Headset', 'accessories', 7, 480, 160, false, 'Crystal-clear squad voice chat.'),
  item('plasma-blade', 'Plasma Blade', 'equipments', 1, 450, 150, true, 'A blade of pure plasma.'),
  item(
    'aurora-shield',
    'Aurora Shield',
    'equipments',
    2,
    600,
    200,
    false,
    'Shimmers in every colour of the sky.',
  ),
  item(
    'thunder-bow',
    'Thunder Bow',
    'equipments',
    3,
    540,
    180,
    false,
    'Each arrow lands with a thunderclap.',
  ),
  item('quantum-staff', 'Quantum Staff', 'equipments', 4, 660, 220, false, 'Exists in two places at once.'),
  item('nova-hammer', 'Nova Hammer', 'equipments', 5, 720, 240, true, 'Strikes with the force of a star.'),
  item('frost-gauntlet', 'Frost Gauntlet', 'equipments', 6, 780, 260, false, 'Freezes whatever it touches.'),
  item('solar-lance', 'Solar Lance', 'equipments', 7, 900, 300, false, 'Forged in the heart of the sun.'),
];

export const REDEEM_CODES = [
  {
    code: 'GRANDORA2026',
    grantCurrency: 'GRANDO' as Currency,
    grantAmount: 500,
    maxUses: null,
    expiresInDays: null,
  },
  {
    code: 'MYGGWELCOME',
    grantCurrency: 'MYGG' as Currency,
    grantAmount: 100,
    maxUses: 1000,
    expiresInDays: 365,
  },
  {
    code: 'TICKET5',
    grantCurrency: 'TICKET' as Currency,
    grantAmount: 5,
    maxUses: null,
    expiresInDays: null,
  },
  {
    code: 'EXPIRED2025',
    grantCurrency: 'GRANDO' as Currency,
    grantAmount: 1000,
    maxUses: null,
    expiresInDays: -30,
  },
];

export const DEMO_PROFILE = {
  username: 'grandora_demo',
  firstName: 'Demo',
  lastName: 'Player',
  description:
    'Explorer of the Grandora universe. This is a shared demo account, so feel free to look around.',
  country: 'Thailand',
  city: 'Bangkok',
  gender: 'unspecified',
  dateOfBirth: '1998-04-12',
  exp: 2450,
  avatarUrl: '/assets/images/mockup/profile/Group 28491.png',
  coverUrl: '/assets/images/mockup/setting/Screenshot 2022-12-30 at 18.50 1.jpg',
  facebook: 'grandora.games',
  twitter: 'grandoragames',
  instagram: 'grandora.games',
};

export type HistoryEvent =
  | { daysAgo: number; kind: 'bonus'; changes: Partial<Record<Currency, number>>; description: string }
  | { daysAgo: number; kind: 'order'; packageCode: string; method: string }
  | { daysAgo: number; kind: 'store'; itemCode: string; currency: 'GRANDO' | 'MYGG' }
  | { daysAgo: number; kind: 'redeem'; code: string }
  | {
      daysAgo: number;
      kind: 'failed';
      packageCode: string;
      method: string;
      failureCode: string;
      failureMessage: string;
    };

export const DEMO_HISTORY: HistoryEvent[] = [
  { daysAgo: 120, kind: 'bonus', changes: { GRANDO: 100, TICKET: 1 }, description: 'Welcome bonus' },
  { daysAgo: 118, kind: 'order', packageCode: 'mygg-3000', method: 'card' },
  { daysAgo: 116, kind: 'order', packageCode: 'grando-2850', method: 'mygg_coins' },
  { daysAgo: 110, kind: 'store', itemCode: 'neon-rider', currency: 'GRANDO' },
  { daysAgo: 104, kind: 'redeem', code: 'GRANDORA2026' },
  { daysAgo: 98, kind: 'order', packageCode: 'grando-8850', method: 'promptpay' },
  {
    daysAgo: 95,
    kind: 'failed',
    packageCode: 'grando-4850',
    method: 'card',
    failureCode: 'insufficient_fund',
    failureMessage: 'insufficient funds in the account or the card has reached the credit limit',
  },
  { daysAgo: 92, kind: 'order', packageCode: 'mygg-1000', method: 'truemoney_jumpapp' },
  { daysAgo: 85, kind: 'store', itemCode: 'halo-visor', currency: 'MYGG' },
  { daysAgo: 80, kind: 'order', packageCode: 'grando-1850', method: 'card' },
  { daysAgo: 74, kind: 'order', packageCode: 'mygg-3000', method: 'promptpay' },
  { daysAgo: 66, kind: 'store', itemCode: 'plasma-blade', currency: 'GRANDO' },
  { daysAgo: 60, kind: 'order', packageCode: 'grando-10850', method: 'card' },
  { daysAgo: 52, kind: 'redeem', code: 'TICKET5' },
  { daysAgo: 45, kind: 'store', itemCode: 'cyber-kitsune', currency: 'MYGG' },
  { daysAgo: 38, kind: 'order', packageCode: 'grando-4850', method: 'mygg_coins' },
  { daysAgo: 30, kind: 'order', packageCode: 'mygg-500', method: 'rabbit_linepay' },
  { daysAgo: 24, kind: 'store', itemCode: 'aurora-shield', currency: 'GRANDO' },
  { daysAgo: 18, kind: 'order', packageCode: 'mygg-1000', method: 'card' },
  { daysAgo: 12, kind: 'order', packageCode: 'grando-1850', method: 'mygg_coins' },
  { daysAgo: 9, kind: 'store', itemCode: 'glow-sneakers', currency: 'GRANDO' },
  { daysAgo: 6, kind: 'order', packageCode: 'mygg-1000', method: 'promptpay' },
  { daysAgo: 3, kind: 'redeem', code: 'MYGGWELCOME' },
  { daysAgo: 1, kind: 'store', itemCode: 'pixel-pilot', currency: 'GRANDO' },
];

export const BETA_SIGNUPS = [
  {
    email: 'katherine.janney@example.com',
    firstName: 'Katherine',
    lastName: 'Janney',
    age: 24,
    region: 'Asia',
    favoriteGame: 'Genshin Impact',
    genres: ['RPG', 'Adventure'],
    channel: 'KatPlays',
  },
  {
    email: 'john.sandiana@example.com',
    firstName: 'John',
    lastName: 'Sandiana',
    age: 31,
    region: 'Europe',
    favoriteGame: 'Minecraft',
    genres: ['Simulation', 'Casual'],
    channel: 'SandBuilds',
  },
  {
    email: 'sam.yong@example.com',
    firstName: 'Sam',
    lastName: 'Yong',
    age: 19,
    region: 'NorthAmerica',
    favoriteGame: 'Valorant',
    genres: ['Action', 'Strategy'],
    channel: null,
  },
];

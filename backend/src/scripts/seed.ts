import { randomBytes, randomUUID } from 'crypto';
import { config } from '../config/config';
import { createPool, inTransaction, Tx } from '../database/pool';
import { CURRENT_PASSWORD_VERSION, hashPassword } from '../modules/auth/password';
import { BalanceChange, Balances, CURRENCIES, Currency } from '../modules/wallet/currency';
import { LedgerReason } from '../modules/wallet/wallet.repository';
import {
  BETA_SIGNUPS,
  DEMO_HISTORY,
  DEMO_PROFILE,
  HistoryEvent,
  PACKAGES,
  REDEEM_CODES,
  SeedPackage,
  SeedStoreItem,
  STORE_ITEMS,
} from './seed-data';

const DAY_MS = 24 * 60 * 60 * 1000;
const ifEmpty = process.argv.includes('--if-empty');

type PackageRow = SeedPackage & { id: number };
type ItemRow = SeedStoreItem & { id: number };

async function seedPackages(tx: Tx): Promise<Map<string, PackageRow>> {
  const rows = new Map<string, PackageRow>();
  for (const [index, pkg] of PACKAGES.entries()) {
    const { rows: inserted } = await tx.query(
      `INSERT INTO packages (code, name, description, grant_currency, grant_amount, bonus_tickets, price_satang,
                             price_coins, image, badge, save_percent, theme, featured, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id`,
      [
        pkg.code,
        pkg.name,
        pkg.description,
        pkg.grantCurrency,
        pkg.grantAmount,
        pkg.bonusTickets,
        pkg.priceBaht * 100,
        pkg.priceCoins,
        pkg.image,
        pkg.badge,
        pkg.savePercent,
        pkg.theme,
        pkg.featured,
        index + 1,
      ],
    );
    rows.set(pkg.code, { ...pkg, id: inserted[0]!.id as number });
  }
  return rows;
}

async function seedStore(tx: Tx): Promise<Map<string, ItemRow>> {
  const rows = new Map<string, ItemRow>();
  for (const [index, item] of STORE_ITEMS.entries()) {
    const { rows: inserted } = await tx.query(
      `INSERT INTO store_items (code, name, description, category, image, price_grando, price_mygg, promoted, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        item.code,
        item.name,
        item.description,
        item.category,
        `/assets/images/official-store/avatar/${item.image}.png`,
        item.priceGrando,
        item.priceMygg,
        item.promoted,
        index + 1,
      ],
    );
    rows.set(item.code, { ...item, id: inserted[0]!.id as number });
  }
  return rows;
}

async function seedRedeemCodes(tx: Tx): Promise<void> {
  for (const code of REDEEM_CODES) {
    await tx.query(
      `INSERT INTO redeem_codes (code, grant_currency, grant_amount, max_uses, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        code.code,
        code.grantCurrency,
        code.grantAmount,
        code.maxUses,
        code.expiresInDays === null ? null : new Date(Date.now() + code.expiresInDays * DAY_MS),
      ],
    );
  }
}

async function seedDemoUser(tx: Tx, passwordHash: string): Promise<number> {
  const p = DEMO_PROFILE;
  const { rows } = await tx.query(
    `INSERT INTO users (email, password_hash, password_version, is_demo, username, first_name, last_name,
                        description, country, city, gender, date_of_birth, exp, avatar_url, cover_url,
                        facebook, twitter, instagram, created_at)
     VALUES ($1, $2, $3, TRUE, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
     RETURNING id`,
    [
      config.demo.email,
      passwordHash,
      CURRENT_PASSWORD_VERSION,
      p.username,
      p.firstName,
      p.lastName,
      p.description,
      p.country,
      p.city,
      p.gender,
      p.dateOfBirth,
      p.exp,
      p.avatarUrl,
      p.coverUrl,
      p.facebook,
      p.twitter,
      p.instagram,
      new Date(Date.now() - 121 * DAY_MS),
    ],
  );
  return rows[0]!.id as number;
}

async function seedHistory(
  tx: Tx,
  userId: number,
  packages: Map<string, PackageRow>,
  items: Map<string, ItemRow>,
): Promise<Balances> {
  const balances: Balances = { MYGG: 0, GRANDO: 0, TICKET: 0 };
  let chargeNumber = 0;

  const ledger = async (
    changes: BalanceChange,
    reason: LedgerReason,
    description: string,
    orderId: string | null,
    at: Date,
  ) => {
    const group = randomUUID();
    for (const currency of CURRENCIES) {
      const amount = changes[currency];
      if (!amount) continue;
      balances[currency] += amount;
      if (balances[currency] < 0)
        throw new Error(`the demo history overdraws ${currency} at "${description}"`);
      await tx.query(
        `INSERT INTO ledger (entry_group, user_id, currency, amount, balance_after, reason, order_id, description, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [group, userId, currency, amount, balances[currency], reason, orderId, description, at],
      );
    }
  };

  const order = async (
    pkg: PackageRow,
    method: string,
    at: Date,
    failure?: { code: string; message: string },
  ): Promise<string> => {
    const coins = method === 'mygg_coins';
    const { rows } = await tx.query(
      `INSERT INTO orders (user_id, package_id, method, amount_satang, amount_coins, grant_currency, grant_amount,
                           bonus_tickets, status, omise_charge_id, failure_code, failure_message, paid_at,
                           last_checked_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $14, $14)
       RETURNING id`,
      [
        userId,
        pkg.id,
        method,
        coins ? 0 : pkg.priceBaht * 100,
        coins ? pkg.priceCoins : 0,
        pkg.grantCurrency,
        pkg.grantAmount,
        pkg.bonusTickets,
        failure ? 'failed' : 'paid',
        coins ? null : `chrg_test_seed${String(++chargeNumber).padStart(4, '0')}`,
        failure?.code ?? null,
        failure?.message ?? null,
        failure ? null : at,
        at,
      ],
    );
    return rows[0]!.id as string;
  };

  const now = Date.now();
  for (const [index, event] of DEMO_HISTORY.entries()) {
    const at = new Date(
      now - event.daysAgo * DAY_MS - ((index * 7) % 11) * 60 * 60 * 1000 - ((index * 13) % 60) * 60 * 1000,
    );
    await applyEvent(event, at);
  }

  async function applyEvent(event: HistoryEvent, at: Date): Promise<void> {
    switch (event.kind) {
      case 'bonus':
        await ledger(event.changes, 'bonus', event.description, null, at);
        return;
      case 'order': {
        const pkg = packages.get(event.packageCode)!;
        const orderId = await order(pkg, event.method, at);
        const changes: BalanceChange = { [pkg.grantCurrency]: pkg.grantAmount };
        if (pkg.bonusTickets) changes.TICKET = pkg.bonusTickets;
        if (event.method === 'mygg_coins') changes.MYGG = -pkg.priceCoins!;
        await ledger(changes, pkg.grantCurrency === 'MYGG' ? 'topup' : 'package', pkg.name, orderId, at);
        return;
      }
      case 'failed': {
        const pkg = packages.get(event.packageCode)!;
        await order(pkg, event.method, at, { code: event.failureCode, message: event.failureMessage });
        return;
      }
      case 'store': {
        const item = items.get(event.itemCode)!;
        const price = event.currency === 'GRANDO' ? item.priceGrando : item.priceMygg;
        await tx.query(
          `INSERT INTO user_items (user_id, item_id, paid_currency, paid_amount, acquired_at) VALUES ($1, $2, $3, $4, $5)`,
          [userId, item.id, event.currency, price, at],
        );
        await ledger({ [event.currency]: -price }, 'store_purchase', item.name, null, at);
        return;
      }
      case 'redeem': {
        const code = REDEEM_CODES.find((entry) => entry.code === event.code)!;
        await ledger({ [code.grantCurrency]: code.grantAmount }, 'redeem', `Code ${code.code}`, null, at);
        return;
      }
    }
  }

  await tx.query('INSERT INTO wallets (user_id, mygg_coins, grando, tickets) VALUES ($1, $2, $3, $4)', [
    userId,
    balances.MYGG,
    balances.GRANDO,
    balances.TICKET,
  ]);
  return balances;
}

async function seedBetaSignups(tx: Tx): Promise<void> {
  for (const signup of BETA_SIGNUPS) {
    await tx.query(
      `INSERT INTO beta_signups (email, event_name, first_name, last_name, age, region, favorite_game,
                                 favorite_game_genre, channel_name)
       VALUES ($1, 'creator_cbt', $2, $3, $4, $5, $6, $7, $8)`,
      [
        signup.email,
        signup.firstName,
        signup.lastName,
        signup.age,
        signup.region,
        signup.favoriteGame,
        signup.genres,
        signup.channel,
      ],
    );
  }
}

async function main(): Promise<void> {
  const pool = createPool();
  try {
    if (ifEmpty) {
      const { rows } = await pool.query('SELECT COUNT(*) AS total FROM packages');
      if (Number(rows[0]?.total ?? 0) > 0) {
        console.log('[seed] Data is already present. Nothing to do.');
        return;
      }
    }

    const demoPassword = config.demo.password ?? randomBytes(24).toString('base64url');
    const passwordHash = await hashPassword(demoPassword);

    const { balances } = await inTransaction(pool, async (tx) => {
      await tx.query(
        `TRUNCATE beta_signups, redeem_code_uses, redeem_codes, user_items, store_items, ledger, orders,
                  packages, wallets, refresh_tokens, users RESTART IDENTITY CASCADE`,
      );
      const packages = await seedPackages(tx);
      const items = await seedStore(tx);
      await seedRedeemCodes(tx);
      const demoId = await seedDemoUser(tx, passwordHash);
      const seeded = await seedHistory(tx, demoId, packages, items);
      await seedBetaSignups(tx);
      return { balances: seeded };
    });

    const format = (currency: Currency) => balances[currency].toLocaleString('en-US');
    console.log(
      `[seed] ${PACKAGES.length} packages, ${STORE_ITEMS.length} store items, ${REDEEM_CODES.length} redeem codes.`,
    );
    console.log(
      `[seed] Demo account ${config.demo.email}: ${format('MYGG')} MYGG Coins, ${format('GRANDO')} Grando, ` +
        `${format('TICKET')} Tickets, ${DEMO_HISTORY.length} history entries.`,
    );
    if (!config.demo.password)
      console.log('[seed] Demo password is random (set DEMO_PASSWORD to choose one).');
    console.log(`[seed] Redeem codes: ${REDEEM_CODES.map((code) => code.code).join(', ')}`);
  } finally {
    await pool.end();
  }
}

main().catch((err: Error) => {
  console.error(`[seed] ${err.message}`);
  process.exitCode = 1;
});

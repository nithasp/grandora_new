CREATE TABLE wallets (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  mygg_coins BIGINT NOT NULL DEFAULT 0,
  grando BIGINT NOT NULL DEFAULT 0,
  tickets BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(500) NOT NULL DEFAULT '',
  grant_currency VARCHAR(10) NOT NULL,
  grant_amount INTEGER NOT NULL,
  bonus_tickets INTEGER NOT NULL DEFAULT 0,
  price_satang INTEGER NOT NULL,
  price_coins INTEGER,
  image TEXT,
  badge VARCHAR(30),
  save_percent SMALLINT,
  theme VARCHAR(20) NOT NULL DEFAULT 'gold',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  game VARCHAR(40) NOT NULL DEFAULT 'grandora',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT packages_grant_currency_check CHECK (grant_currency IN ('MYGG', 'GRANDO')),
  CONSTRAINT packages_grant_amount_check CHECK (grant_amount > 0),
  CONSTRAINT packages_bonus_tickets_check CHECK (bonus_tickets >= 0),
  CONSTRAINT packages_price_satang_check CHECK (price_satang BETWEEN 2000 AND 15000000),
  CONSTRAINT packages_price_coins_check CHECK (price_coins IS NULL OR price_coins > 0),
  CONSTRAINT packages_coin_price_scope_check CHECK (grant_currency = 'GRANDO' OR price_coins IS NULL),
  CONSTRAINT packages_save_percent_check CHECK (save_percent IS NULL OR save_percent BETWEEN 1 AND 99)
);

-- The price and what the order grants are copied in when the order is created, so editing a
-- package later never changes what an existing order pays or receives.
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT NOT NULL REFERENCES users(id),
  package_id INTEGER NOT NULL REFERENCES packages(id),
  method VARCHAR(40) NOT NULL,
  amount_satang INTEGER NOT NULL DEFAULT 0,
  amount_coins INTEGER NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'THB',
  grant_currency VARCHAR(10) NOT NULL,
  grant_amount INTEGER NOT NULL,
  bonus_tickets INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  omise_charge_id VARCHAR(64) UNIQUE,
  authorize_uri TEXT,
  qr_code_uri TEXT,
  failure_code VARCHAR(100),
  failure_message VARCHAR(500),
  expires_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'refunded', 'disputed')),
  CONSTRAINT orders_grant_currency_check CHECK (grant_currency IN ('MYGG', 'GRANDO')),
  CONSTRAINT orders_amount_check CHECK (
    amount_satang >= 0 AND amount_coins >= 0 AND (amount_satang > 0 OR amount_coins > 0)
  )
);

CREATE INDEX orders_user_id_created_at_idx ON orders (user_id, created_at DESC);
CREATE INDEX orders_pending_idx ON orders (created_at) WHERE status = 'pending';

CREATE TABLE ledger (
  id BIGSERIAL PRIMARY KEY,
  entry_group UUID NOT NULL,
  user_id BIGINT NOT NULL REFERENCES users(id),
  currency VARCHAR(10) NOT NULL,
  amount BIGINT NOT NULL,
  balance_after BIGINT NOT NULL,
  reason VARCHAR(30) NOT NULL,
  order_id UUID REFERENCES orders(id),
  description VARCHAR(200) NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ledger_currency_check CHECK (currency IN ('MYGG', 'GRANDO', 'TICKET')),
  CONSTRAINT ledger_amount_check CHECK (amount <> 0),
  CONSTRAINT ledger_reason_check CHECK (
    reason IN ('topup', 'package', 'store_purchase', 'redeem', 'refund', 'chargeback', 'bonus')
  )
);

CREATE INDEX ledger_user_id_idx ON ledger (user_id, id DESC);
CREATE INDEX ledger_entry_group_idx ON ledger (entry_group);
CREATE INDEX ledger_order_id_idx ON ledger (order_id) WHERE order_id IS NOT NULL;

-- The ledger is the audit trail for every coin, so rows can only ever be added
CREATE FUNCTION ledger_append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'ledger rows are append-only';
END;
$$;

CREATE TRIGGER ledger_append_only
  BEFORE UPDATE OR DELETE ON ledger
  FOR EACH ROW EXECUTE FUNCTION ledger_append_only();

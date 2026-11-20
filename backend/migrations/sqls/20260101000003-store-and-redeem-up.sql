CREATE TABLE store_items (
  id SERIAL PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(500) NOT NULL DEFAULT '',
  category VARCHAR(20) NOT NULL,
  image TEXT NOT NULL,
  price_grando INTEGER,
  price_mygg INTEGER,
  promoted BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT store_items_category_check CHECK (category IN ('avatars', 'accessories', 'equipments')),
  CONSTRAINT store_items_price_grando_check CHECK (price_grando IS NULL OR price_grando > 0),
  CONSTRAINT store_items_price_mygg_check CHECK (price_mygg IS NULL OR price_mygg > 0),
  CONSTRAINT store_items_has_price_check CHECK (price_grando IS NOT NULL OR price_mygg IS NOT NULL)
);

CREATE INDEX store_items_category_idx ON store_items (category, sort_order) WHERE active;

CREATE TABLE user_items (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES store_items(id),
  paid_currency VARCHAR(10) NOT NULL,
  paid_amount INTEGER NOT NULL,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_items_user_item_key UNIQUE (user_id, item_id),
  CONSTRAINT user_items_paid_currency_check CHECK (paid_currency IN ('MYGG', 'GRANDO')),
  CONSTRAINT user_items_paid_amount_check CHECK (paid_amount > 0)
);

CREATE TABLE redeem_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(40) NOT NULL,
  grant_currency VARCHAR(10) NOT NULL,
  grant_amount INTEGER NOT NULL,
  max_uses INTEGER,
  uses INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT redeem_codes_grant_currency_check CHECK (grant_currency IN ('MYGG', 'GRANDO', 'TICKET')),
  CONSTRAINT redeem_codes_grant_amount_check CHECK (grant_amount > 0),
  CONSTRAINT redeem_codes_uses_check CHECK (uses >= 0 AND (max_uses IS NULL OR uses <= max_uses))
);

CREATE UNIQUE INDEX redeem_codes_code_key ON redeem_codes (UPPER(code));

CREATE TABLE redeem_code_uses (
  id BIGSERIAL PRIMARY KEY,
  code_id INTEGER NOT NULL REFERENCES redeem_codes(id),
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT redeem_code_uses_code_user_key UNIQUE (code_id, user_id)
);

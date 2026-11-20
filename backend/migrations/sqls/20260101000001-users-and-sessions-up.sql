CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(254) NOT NULL,
  password_hash TEXT NOT NULL,
  password_version SMALLINT NOT NULL DEFAULT 2,
  role VARCHAR(20) NOT NULL DEFAULT 'player',
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  is_frozen BOOLEAN NOT NULL DEFAULT FALSE,
  username VARCHAR(30),
  first_name VARCHAR(60),
  last_name VARCHAR(60),
  description VARCHAR(500),
  country VARCHAR(60),
  city VARCHAR(60),
  gender VARCHAR(20),
  date_of_birth DATE,
  exp INTEGER NOT NULL DEFAULT 0,
  avatar_url TEXT,
  avatar_key TEXT,
  cover_url TEXT,
  cover_key TEXT,
  facebook VARCHAR(100),
  twitter VARCHAR(100),
  instagram VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_role_check CHECK (role IN ('player', 'admin')),
  CONSTRAINT users_exp_check CHECK (exp >= 0),
  CONSTRAINT users_gender_check CHECK (gender IS NULL OR gender IN ('male', 'female', 'unspecified'))
);

CREATE UNIQUE INDEX users_email_key ON users (LOWER(email));
CREATE UNIQUE INDEX users_username_key ON users (LOWER(username));

CREATE TABLE refresh_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash CHAR(64) NOT NULL UNIQUE,
  family_id UUID NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX refresh_tokens_user_id_idx ON refresh_tokens (user_id);
CREATE INDEX refresh_tokens_family_id_idx ON refresh_tokens (family_id);
CREATE INDEX refresh_tokens_expires_at_idx ON refresh_tokens (expires_at);

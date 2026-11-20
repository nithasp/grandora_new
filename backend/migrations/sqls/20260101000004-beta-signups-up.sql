CREATE TABLE beta_signups (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(254) NOT NULL,
  event_name VARCHAR(60) NOT NULL,
  first_name VARCHAR(60),
  last_name VARCHAR(60),
  age SMALLINT,
  region VARCHAR(60),
  favorite_game VARCHAR(120),
  favorite_game_genre TEXT[] NOT NULL DEFAULT '{}',
  channel_name VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT beta_signups_age_check CHECK (age IS NULL OR age BETWEEN 1 AND 120)
);

CREATE UNIQUE INDEX beta_signups_email_event_key ON beta_signups (LOWER(email), event_name);

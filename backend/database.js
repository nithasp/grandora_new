require('dotenv').config();

const sslMode = process.env.DATABASE_SSL || (process.env.DATABASE_URL ? 'verify' : 'off');
const sslCa = process.env.DATABASE_SSL_CA;

function ssl() {
  switch (sslMode) {
    case 'off':
      return false;
    case 'no-verify':
      return { rejectUnauthorized: false };
    case 'verify':
      return { rejectUnauthorized: true, ...(sslCa ? { ca: sslCa } : {}) };
    default:
      throw new Error(`[database] DATABASE_SSL must be off, no-verify or verify (got "${sslMode}")`);
  }
}

const local = {
  driver: 'pg',
  host: { ENV: 'POSTGRES_HOST' },
  port: { ENV: 'POSTGRES_PORT' },
  database: { ENV: 'POSTGRES_DB' },
  user: { ENV: 'POSTGRES_USER' },
  password: { ENV: 'POSTGRES_PASSWORD' },
  ssl: ssl(),
};

module.exports = {
  dev: process.env.DATABASE_URL ? { driver: 'pg', url: { ENV: 'DATABASE_URL' }, ssl: ssl() } : local,
  production: { driver: 'pg', url: { ENV: 'DATABASE_URL' }, ssl: ssl() },
};

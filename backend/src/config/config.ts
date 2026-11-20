import 'dotenv/config';
import path from 'path';
import { z } from 'zod';

const MIN_SECRET_LENGTH = 32;
const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

const secret = z.string().min(MIN_SECRET_LENGTH, `must be at least ${MIN_SECRET_LENGTH} characters`);

const envSchema = z
  .object({
    ENV: z.enum(['dev', 'test', 'production']).default('dev'),
    NODE_ENV: z.string().optional(),
    PORT: z.coerce.number().int().positive().default(3000),
    ALLOWED_ORIGIN: z.string().default('http://localhost:4200'),
    FRONTEND_URL: z.url().default('http://localhost:4200'),
    PUBLIC_API_URL: z.url().optional(),
    JSON_BODY_LIMIT: z.string().default('1mb'),
    TRUST_PROXY: z.coerce.number().int().min(0).default(1),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).optional(),
    API_RATE_LIMIT: z.coerce.number().int().positive().default(500),
    AUTH_RATE_LIMIT: z.coerce.number().int().positive().default(20),
    DEMO_RATE_LIMIT: z.coerce.number().int().positive().default(100),
    GRAPHQL_SANDBOX: z.stringbool().optional(),

    TOKEN_SECRET: secret,
    ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
    REFRESH_TOKEN_EXPIRY_DAYS: z.coerce.number().int().positive().max(365).default(7),
    REFRESH_COOKIE_SAMESITE: z.enum(['strict', 'lax', 'none']).optional(),

    PASSWORD_PEPPER: secret,
    SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(10),

    DATABASE_URL: z.string().optional(),
    POSTGRES_HOST: z.string().default('127.0.0.1'),
    POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
    POSTGRES_DB: z.string().default('grandora_dev'),
    POSTGRES_USER: z.string().optional(),
    POSTGRES_PASSWORD: z.string().optional(),
    DATABASE_SSL: z.enum(['off', 'no-verify', 'verify']).optional(),
    DATABASE_SSL_CA: z.string().optional(),

    DEMO_LOGIN_ENABLED: z.stringbool().default(true),
    DEMO_EMAIL: z.email().default('demo@grandora.games'),
    DEMO_PASSWORD: z.string().min(12).optional(),

    OMISE_PUBLIC_KEY: z
      .string()
      .regex(/^pkey_/, 'must start with pkey_')
      .optional(),
    OMISE_SECRET_KEY: z
      .string()
      .regex(/^skey_/, 'must start with skey_')
      .optional(),
    OMISE_WEBHOOK_SECRET: z.string().optional(),
    OMISE_API_VERSION: z.string().default('2019-05-29'),
    OMISE_API_URL: z.url().default('https://api.omise.co'),
    OMISE_PAYMENT_METHODS: z.string().default('card,promptpay'),

    STORAGE_DRIVER: z.enum(['r2', 'local']).optional(),
    R2_ACCOUNT_ID: z.string().optional(),
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    R2_BUCKET: z.string().optional(),
    R2_PUBLIC_URL: z.url().optional(),
    UPLOAD_MAX_MB: z.coerce.number().positive().max(20).default(5),
  })
  .refine((env) => env.DATABASE_URL || (env.POSTGRES_USER && env.POSTGRES_PASSWORD), {
    error: 'set DATABASE_URL, or POSTGRES_USER and POSTGRES_PASSWORD',
    path: ['DATABASE_URL'],
  })
  .refine((env) => env.REFRESH_COOKIE_SAMESITE !== 'none' || env.ENV === 'production', {
    error: "'none' needs the Secure flag, which is only set when ENV=production",
    path: ['REFRESH_COOKIE_SAMESITE'],
  })
  .refine((env) => Boolean(env.OMISE_PUBLIC_KEY) === Boolean(env.OMISE_SECRET_KEY), {
    error: 'set both OMISE_PUBLIC_KEY and OMISE_SECRET_KEY, or neither',
    path: ['OMISE_SECRET_KEY'],
  })
  .refine(
    (env) =>
      !env.OMISE_PUBLIC_KEY ||
      !env.OMISE_SECRET_KEY ||
      env.OMISE_PUBLIC_KEY.startsWith('pkey_test_') === env.OMISE_SECRET_KEY.startsWith('skey_test_'),
    {
      error: 'the public and secret keys must both be test keys or both be live keys',
      path: ['OMISE_SECRET_KEY'],
    },
  )
  .refine(
    (env) =>
      env.STORAGE_DRIVER !== 'r2' ||
      Boolean(
        env.R2_ACCOUNT_ID &&
        env.R2_ACCESS_KEY_ID &&
        env.R2_SECRET_ACCESS_KEY &&
        env.R2_BUCKET &&
        env.R2_PUBLIC_URL,
      ),
    {
      error:
        'STORAGE_DRIVER=r2 needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET and R2_PUBLIC_URL',
      path: ['STORAGE_DRIVER'],
    },
  );

type Env = z.infer<typeof envSchema>;

function readEnv(): Env {
  const present = Object.fromEntries(
    Object.entries(process.env).filter(([, value]) => value !== undefined && value.trim() !== ''),
  );

  const parsed = envSchema.safeParse(present);
  if (!parsed.success) {
    const problems = parsed.error.issues.map(
      (issue) => `  ${issue.path.join('.') || 'env'}: ${issue.message}`,
    );
    throw new Error(`[config] The environment is not usable:\n${problems.join('\n')}`);
  }
  return parsed.data;
}

const list = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const withoutTrailingSlash = (url: string): string => url.replace(/\/+$/, '');

const env = readEnv();
const isProduction = env.ENV === 'production';

const r2Ready = Boolean(
  env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET && env.R2_PUBLIC_URL,
);
const storageDriver = env.STORAGE_DRIVER ?? (r2Ready ? 'r2' : 'local');

export const API_PREFIX = '/api/v1';

export const config = {
  env: env.ENV,
  isProduction,
  isTest: env.ENV === 'test',
  port: env.PORT,
  allowedOrigins: list(env.ALLOWED_ORIGIN),
  frontendUrl: withoutTrailingSlash(env.FRONTEND_URL),
  publicApiUrl: withoutTrailingSlash(env.PUBLIC_API_URL ?? `http://localhost:${env.PORT}`),
  jsonBodyLimit: env.JSON_BODY_LIMIT,
  trustProxy: env.TRUST_PROXY,
  logLevel: env.LOG_LEVEL ?? (env.ENV === 'test' ? 'silent' : 'info'),
  prettyLogs: env.ENV === 'dev' && env.NODE_ENV !== 'production',

  graphql: {
    path: `${API_PREFIX}/graph`,
    sandbox: env.GRAPHQL_SANDBOX ?? !isProduction,
  },

  rateLimit: {
    windowMs: 15 * MINUTE_MS,
    api: env.API_RATE_LIMIT,
    auth: env.AUTH_RATE_LIMIT,
    demo: env.DEMO_RATE_LIMIT,
  },

  auth: {
    tokenSecret: env.TOKEN_SECRET,
    accessTokenExpiry: env.ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiryMs: env.REFRESH_TOKEN_EXPIRY_DAYS * DAY_MS,
    passwordPepper: env.PASSWORD_PEPPER,
    saltRounds: env.SALT_ROUNDS,
  },

  // The website and the API sit on different sites in production, so a Strict cookie would never
  // reach the refresh call; None keeps it cross-site while Secure and the path keep it contained
  refreshCookie: {
    name: 'refreshToken',
    path: `${API_PREFIX}/auth`,
    sameSite: env.REFRESH_COOKIE_SAMESITE ?? (isProduction ? 'none' : 'strict'),
    httpOnly: true,
    secure: isProduction,
    maxAgeMs: env.REFRESH_TOKEN_EXPIRY_DAYS * DAY_MS,
  },

  database: {
    url: env.DATABASE_URL,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    name: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    sslMode: env.DATABASE_SSL ?? (env.DATABASE_URL ? 'verify' : 'off'),
    sslCa: env.DATABASE_SSL_CA,
  },

  demo: {
    loginEnabled: env.DEMO_LOGIN_ENABLED,
    email: env.DEMO_EMAIL.toLowerCase(),
    password: env.DEMO_PASSWORD,
  },

  omise: {
    enabled: Boolean(env.OMISE_PUBLIC_KEY && env.OMISE_SECRET_KEY),
    publicKey: env.OMISE_PUBLIC_KEY,
    secretKey: env.OMISE_SECRET_KEY,
    webhookSecret: env.OMISE_WEBHOOK_SECRET,
    apiVersion: env.OMISE_API_VERSION,
    apiUrl: withoutTrailingSlash(env.OMISE_API_URL),
    testMode: env.OMISE_SECRET_KEY?.startsWith('skey_test_') ?? true,
    methods: list(env.OMISE_PAYMENT_METHODS),
  },

  storage: {
    driver: storageDriver,
    uploadsEnabled: storageDriver === 'r2' || !isProduction,
    maxBytes: Math.round(env.UPLOAD_MAX_MB * 1024 * 1024),
    localDir: path.resolve(process.cwd(), 'uploads'),
    r2: {
      accountId: env.R2_ACCOUNT_ID,
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      bucket: env.R2_BUCKET,
      publicUrl: env.R2_PUBLIC_URL ? withoutTrailingSlash(env.R2_PUBLIC_URL) : undefined,
    },
  },
};

export type AppConfig = typeof config;

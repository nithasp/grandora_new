import { Pool, PoolClient, QueryResult, QueryResultRow, types } from 'pg';
import { config } from '../config/config';

// BIGINT ids, balances and COUNT(*) stay far below 2^53, so they are read as plain numbers
types.setTypeParser(types.builtins.INT8, (value: string) => Number(value));
types.setTypeParser(types.builtins.DATE, (value: string) => value);

export type Tx = PoolClient;

export interface Queryable {
  query<R extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<QueryResult<R>>;
}

function ssl(): false | { rejectUnauthorized: boolean; ca?: string } {
  const { sslMode, sslCa } = config.database;
  if (sslMode === 'off') return false;
  if (sslMode === 'no-verify') return { rejectUnauthorized: false };
  return { rejectUnauthorized: true, ...(sslCa ? { ca: sslCa } : {}) };
}

export function createPool(): Pool {
  const { url, host, port, name, user, password } = config.database;
  return new Pool(
    url ? { connectionString: url, ssl: ssl() } : { host, port, database: name, user, password, ssl: ssl() },
  );
}

export async function inTransaction<T>(pool: Pool, fn: (tx: Tx) => Promise<T>): Promise<T> {
  const tx = await pool.connect();
  try {
    await tx.query('BEGIN');
    const result = await fn(tx);
    await tx.query('COMMIT');
    return result;
  } catch (err) {
    await tx.query('ROLLBACK').catch(() => undefined);
    throw err;
  } finally {
    tx.release();
  }
}

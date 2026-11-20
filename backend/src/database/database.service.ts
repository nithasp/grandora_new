import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { QueryResult, QueryResultRow } from 'pg';
import { createPool, inTransaction, Queryable, Tx } from './pool';

@Injectable()
export class DatabaseService implements Queryable, OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseService.name);
  readonly pool = createPool();

  constructor() {
    this.pool.on('error', (err) => this.logger.error({ err }, 'idle database client error'));
  }

  query<R extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: unknown[],
  ): Promise<QueryResult<R>> {
    return this.pool.query<R>(text, values);
  }

  transaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
    return inTransaction(this.pool, fn);
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch (err) {
      this.logger.error({ err }, 'database health check failed');
      return false;
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}

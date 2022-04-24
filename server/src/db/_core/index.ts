import {
  Pool, PoolClient, PoolConfig
} from 'pg';
import { Db, DbClient } from './types';

const config: PoolConfig = {
  user: process.env.POSTGRES_USER || 'sample_user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || 'sample_db',
};

const db = new Pool(config);

const makeDbClient = (client: PoolClient): DbClient => {
  return Object.freeze({
    begin: async () => {
      await client.query('BEGIN');
    },
    commit: async () => {
      await client.query('COMMIT');
    },
    rollback: async () => {
      await client.query('ROLLBACK');
    },
    query: async (query, values) => {
      const { rows, rowCount, } = await db.query(query, values);
      return {
        rows,
        count: rowCount,
      };
    },
    close: () => {
      client.release();
    },
  });
};

export const makeDb = (): Db => {
  return Object.freeze({
    query: async (query, values) => {
      const { rows, rowCount, } = await db.query(query, values);
      return {
        rows,
        count: rowCount,
      };
    },

    transaction: async () => {
      const client = await db.connect();
      return makeDbClient(client);
    },

    close: async () => {
      await db.end();
    },
  });
};

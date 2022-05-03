import {
  Pool, PoolClient, PoolConfig
} from 'pg';
import {
  Db, DbActionTransform, DbClient, DbConfig, TransactionDb
} from './types';

const config: PoolConfig = {
  user: process.env.POSTGRES_USER || 'sample_user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || 'sample_db',

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const db = new Pool(config);

const makeDbClient = (client: PoolClient): DbClient => {
  return Object.freeze({
    query: async (query, values) => {
      const { rows, rowCount, } = await client.query(query, values);
      return {
        rows,
        count: rowCount,
      };
    },
  });
};

export const makeDb = ({ client, }: DbConfig): Db => {
  switch (client) {
  case 'pg':
    return Object.freeze({
      query: async (query, values) => {
        const { rows, rowCount, } = await db.query(query, values);
        return {
          rows,
          count: rowCount,
        };
      },

      transaction: async (cb) => {
        const client = await db.connect();

        try {
          await client.query('BEGIN');
          await cb(makeDbClient(client));
          await client.query('COMMIT');
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        } finally {
          client.release(true);
        }
      },

      close: async () => {
        await db.end();
      },
    });
  default:
    throw new Error('Invalid client value for makeDb');
  }
};

export const makeTransactionWrapper = (db: Db) => {
  return async <T extends (...args: any[]) => any>(
    func: T,
    ...args: any[]
  ): Promise<Awaited<ReturnType<T>>> => {
    let ret: any;
    await db.transaction(async (client) => {
      ret = await func(client, ...args);
    });
    return ret;
  };
};

export const makeDbAdapter = <T>(dbLocal: Db, dbClient: DbActionTransform<T>, trx?: (keyof T)[]): TransactionDb<T> => {
  const unitDb = {} as any;
  if (!trx) {
    trx = [];
  }

  const trxWrapper = makeTransactionWrapper(dbLocal);

  for (const key in dbClient) {
    if (trx.findIndex((i) => i === key) > -1) {
      unitDb[key] = (...args: any) => trxWrapper(dbClient[key], ...args);
    } else {
      unitDb[key] = (...args: any) => dbClient[key](dbLocal, ...args);
    }
  }
  unitDb.transaction = (client) => {
    const trx = {} as any;
    for (const key in dbClient) {
      trx[key] = (...args: any) => dbClient[key](client, ...args);
    }
    return Object.freeze(trx);
  };
  return unitDb as TransactionDb<T>;
};

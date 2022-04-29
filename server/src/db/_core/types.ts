export interface QueryResult<T> {
  rows: T[];
  count: number;
}

export interface Db {
  query: <T>(query: string, values?: any[]) => Promise<QueryResult<T>>;
  transaction: (cb: (client: DbClient) => Promise<void>) => Promise<void>;
  close: () => Promise<void>;
}

export interface DbClient {
  query: <T>(query: string, values?: any[]) => Promise<QueryResult<T>>;
}

export type DbActionTransform<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? (db: Db | DbClient, ...args: Parameters<T[K]>) => ReturnType<T[K]>
    : never;
}

export type TransactionDb<T> = T & { transaction: () => T }

export interface QueryResult<T> {
  rows: T[];
  count: number;
}

export interface Db {
  query: <T>(query: string, values?: any[]) => Promise<QueryResult<T>>;
  transaction: () => Promise<DbClient>;
  close: () => Promise<void>;
}

export interface DbClient {
  begin: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  query: <T>(query: string, values?: any[]) => Promise<QueryResult<T>>;
  close: () => void;
}

export interface EntityDbConfig {
  db: Db;
  table: string;
  schema: string;
}

export interface TransactionDb<T> {
  transaction: () => Partial<T>;
}

export type DbActionTransform<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? (db: Db | DbClient, ...args: Parameters<T[K]>) => ReturnType<T[K]>
    : never;
}

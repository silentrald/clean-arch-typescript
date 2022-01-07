import { Pool, PoolClient, PoolConfig, QueryConfig, QueryResult } from 'pg';

const config: PoolConfig = {
  user: process.env.POSTGRES_USER || 'sample_user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || 'sample_db'
};

const pool = new Pool(config);

export default {
  query: (text: string | QueryConfig<any>, values?: any[]): Promise<QueryResult<any>> => pool.query(text, values),
  connect: (): Promise<PoolClient> => pool.connect(),
  end: (): Promise<void> => pool.end()
};
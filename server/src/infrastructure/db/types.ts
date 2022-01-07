import { PoolClient, QueryConfig, QueryResult } from 'pg';

interface DB {
    query: (text: string | QueryConfig<any>, values?: any[]) => Promise<QueryResult<any>>;
    connect: () => Promise<PoolClient>;
    end: () => Promise<void>;
}

export default DB;
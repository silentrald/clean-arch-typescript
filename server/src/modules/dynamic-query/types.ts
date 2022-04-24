
export interface Query {
  query: string;
  values?: any[];
}

export type QueryConditional = '=' | '!=' | '>=' | '>' | '<=' | '<' | 'in'

interface QueryFilterOperator<S> {
  col: keyof S;
  condition: '=' | '!=' | '>=' | '>' | '<=' | '<';
  value: any;
}

interface QueryFilterIn<S> {
  col: keyof S;
  condition: 'in';
  value: any[];
}

export type QueryFilter<S> = QueryFilterOperator<S> | QueryFilterIn<S>

export type DynamicQuery<E, S> = {
  dynamicInsert: (entity: E) => Query;
  dynamicInsertMany: (entities: E[]) => Query;
  dynamicSelectOne: (col: (keyof S), id: string | number, columns?: (keyof S)[]) => Query;
  dynamicSelectAll: (columns?: (keyof S)[], order?: { [K in keyof S]: 'asc' | 'desc' }) => Query;
  dynamicSelectFilter: (
    filters: QueryFilter<S>[],
    columns?: (keyof S)[],
    order?: { [K in keyof S]: 'asc' | 'desc' }
  ) => Query;
  dynamicUpdate: (entity: E) => Query;
  dynamicDelete: (id: string | number) => Query;
}

export type DynamicQueryClients = 'pg' | 'mysql' | 'sqlite3';

export interface DynamicQueryBuilderConfig {
  client: DynamicQueryClients;
}

export interface DynamicQueryConfig<E, S> {
  columns: { [K in keyof Partial<S>]: keyof E };
  primary: keyof S;
  table: string;
  schema: string;
}
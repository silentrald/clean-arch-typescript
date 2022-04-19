
export interface Query {
  query: string;
  values?: any[];
}

export type QueryConditional = '=' | '!=' | '>=' | '>' | '<=' | '<'

export interface QueryFilter<S> {
  field: keyof S;
  condition: QueryConditional;
  value: any;
}

export type DynamicQuery<E, S> = {
  dynamicInsert: (entity: E) => Query;
  dynamicSelectOne: (field: (keyof S), id: string | number, fields?: (keyof S)[]) => Query;
  dynamicSelectAll: (fields?: (keyof S)[]) => Query;
  dynamicSelectFilter: (filters: QueryFilter<S>[], fields?: (keyof S)[]) => Query;
  dynamicUpdate: (entity: E) => Query;
  dynamicDelete: (id: string | number) => Query;
}

export type DynamicQueryClients = 'pg' | 'mysql' | 'sqlite3';

export interface DynamicQueryBuilderConfig {
  client: DynamicQueryClients;
}

export interface DynamicQueryConfig<E, S> {
  fields: { [K in keyof S]: keyof E };
  primary: keyof S;
  table: string;
  schema: string;
}
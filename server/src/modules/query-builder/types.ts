export interface QueryResult {
  query: string;
  values: any[];
}

type JoinType = 'cross' | 'inner' | 'left' | 'right' | 'full';

interface Join {
  table: string;
  condition: string;
  type: JoinType;
}

export interface Where {
  condition: string;
  operator: 'and' | 'or';
}

interface QueryObjectCommon {
  type?: 'select' | 'insert' | 'update' | 'delete';
  schema?: string;
  from?: string;

  values?: any[];
}

export interface QueryObjectSelect extends QueryObjectCommon {
  // type?: 'select';
  select?: string | Record<string, string>;
  joins?: Join[];
  wheres?: Where[];
  orders?: Record<string, 'asc' | 'desc'>;
  limit?: number;
  offset?: number;
}

// TODO: On Conflict
export interface QueryObjectInsert extends QueryObjectCommon {
  // type?: 'insert';
  columns?: string[];
  inserts?: Record<string, any>[];
  returning?: string | Record<string, string>;
}

// TODO: On Conflict
export interface QueryObjectUpdate extends QueryObjectCommon {
  // type?: 'update';
  update?: Record<string, any>;
  wheres?: Where[];
  returning?: string | Record<string, string>;
}

export interface QueryObjectDelete extends QueryObjectCommon {
  // type?: 'delete';
  wheres?: Where[];
}

export type QueryObject = QueryObjectSelect &
  QueryObjectInsert &
  QueryObjectUpdate &
  QueryObjectDelete;

export interface QueryBuilder {
  // COMMON
  schema: (s: string) => QueryBuilder;
  from: (table: string) => QueryBuilder;
  where: (condition: string, operator?: 'and' | 'or') => QueryBuilder;

  // SELECT
  select: (sel?: Record<string, string>) => QueryBuilder;
  join: (table: string, condition: string, type?: JoinType) => QueryBuilder;
  orderBy: (orders: Record<string, 'asc' | 'desc'>) => QueryBuilder;
  limit: (lmt: number) => QueryBuilder;
  offset: (off: number) => QueryBuilder;

  // INSERT
  insert: (inserts: Record<string, any>[], columns?: string[]) => QueryBuilder;
  returning: (ret?: string | Record<string, string>) => QueryBuilder;

  // UPDATE
  update: (up: Record<string, any>) => QueryBuilder;

  // DELETE
  del: () => QueryBuilder;

  // FUNCTIONS
  value: (val: any) => string;
  reset: () => void;
  toQuery: () => QueryResult;
}

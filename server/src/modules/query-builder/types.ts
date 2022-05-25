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

interface Where {
  condition: string;
  operator: 'and' | 'or';
}

interface QueryObjectCommon {
  type?: 'select' | 'insert';
  schema?: string;
  from?: string;

  values?: any[];
}

export interface QueryObjectSelect extends QueryObjectCommon {
  type?: 'select';
  select?: string | Record<string, string>;
  joins?: Join[];
  wheres?: Where[];
  orders?: Record<string, 'asc' | 'desc'>;
  limit?: number;
  offset?: number;
}

export interface QueryObjectInsert extends QueryObjectCommon {
  type?: 'insert';
  columns?: string[];
  inserts?: Record<string, any>[];
  returning?: string | Record<string, string>;
}

export type QueryObject = QueryObjectSelect & QueryObjectInsert;

export interface QueryBuilder {
  // COMMON
  schema: (s: string) => QueryBuilder;
  from: (table: string) => QueryBuilder;

  // SELECT
  select: (sel?: Record<string, string>) => QueryBuilder;
  join: (table: string, condition: string, type?: JoinType) => QueryBuilder;
  where: (condition: string, operator?: 'and' | 'or') => QueryBuilder;
  orderBy: (orders: Record<string, 'asc' | 'desc'>) => QueryBuilder;
  limit: (lmt: number) => QueryBuilder;
  offset: (off: number) => QueryBuilder;

  // INSERT
  insert: (inserts: Record<string, any>[], columns?: string[]) => QueryBuilder;
  returning: (ret?: string | Record<string, string>) => QueryBuilder;

  // FUNCTIONS
  value: (val: any) => string;
  reset: () => void;
  toQuery: () => QueryResult;
}

export interface Column {
  type: string;
  default?: string | number | boolean;
  nullable?: true;
  references?: {
    col: string;
    table: string;
    name?: string;
    del?: 'cascade';
  }
}

export interface StringColumn extends Column {
  type: 'string';
  empty?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface UUIDColumn extends Column {
  type: 'uuid';
}

export interface EmailColumn extends Column {
  type: 'email';
}

export interface URIColumn extends Column {
  type: 'uri';
  max: number;
}

export interface SerialColumn extends Column {
  type: 'serial';
}

interface NumberColumn extends Column {
  min?: number;
  max?: number;
}

export interface IntColumn extends NumberColumn {
  type: 'int';
}

export interface FloatColumn extends NumberColumn {
  type: 'float';
  precision?: number;
  scale?: number;
}

export interface DecimalColumn extends NumberColumn {
  type: 'decimal';
  precision?: number;
  scale?: number;
}

export interface BooleanColumn extends Column {
  type: 'boolean';
}

export interface DateColumn extends Column {
  type: 'date';
}

export interface TimeColumn extends Column {
  type: 'time';
}

export interface TimestampColumn extends Column {
  type: 'timestamp';
}

export interface ArrayColumn extends Column {
  type: 'array';
  min?: number;
  max?: number;
  itemType: 'string' | 'number';
  data: 'string' | 'table'; // Save as a string or to another table
}

export interface BinaryColumn extends Column {
  type: 'binary';
}

export interface ObjectColumn<S> extends Column {
  type: 'object';
  properties: {
    [K in keyof Required<S>]
    : S[K] extends string | null | undefined ?
      StringColumn | UUIDColumn | EmailColumn | URIColumn |
      DateColumn | TimeColumn | TimestampColumn | BinaryColumn
    : S[K] extends number | null | undefined ?
      SerialColumn | IntColumn | FloatColumn | DecimalColumn
    : S[K] extends boolean | null | undefined ?
      BooleanColumn
    : S[K] extends any[] | null | undefined ?
      ArrayColumn
    : S[K] extends Record<any, any> | null | undefined ?
      ObjectColumn<S[K]>
    : never;
  }
}

export type Columns<S> = {
  [K in keyof Required<S>]
    : S[K] extends string | null | undefined ?
      StringColumn | UUIDColumn | EmailColumn | URIColumn |
      DateColumn | TimeColumn | TimestampColumn | BinaryColumn
    : S[K] extends number | null | undefined ?
      SerialColumn | IntColumn | FloatColumn | DecimalColumn
    : S[K] extends boolean | null | undefined ?
      BooleanColumn
    : S[K] extends any[] | null | undefined ?
      ArrayColumn
    : S[K] extends Record<any, any> | null | undefined ?
      ObjectColumn<S[K]>
    : never;
}

export interface Constraint<S> {
  primary: {
    col: (keyof S);
    name?: string; // constraint name
  };
  unique?: {
    columns: (keyof S)[];
    name?: string; // constraint name
  }[];
}

export interface ColumnToSchemaConfig {
  camelToSnakeCase: (str: string) => string;
}

export interface Table<S> {
  name: string;
  schema: string;
  columns: Columns<S>;
  constraints: Constraint<S>;
}

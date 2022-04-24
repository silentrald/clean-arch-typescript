import { ColumnConstraint, Columns } from '@modules/columns/types';

export type DynamicMigrationClients = 'pg' | 'mysql' | 'sqlite3';

export interface DynamicMigrationBuilderConfig {
  client: DynamicMigrationClients;
}

export interface DynamicMigrationConfig<S> {
  columns: Columns<S>;
  table: string;
  schema: string;
  constraints: ColumnConstraint<S>;
}

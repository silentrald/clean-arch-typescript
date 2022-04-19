import { Fields } from '@modules/fields/types';

export type DynamicMigrationClients = 'pg' | 'mysql' | 'sqlite3';

export interface DynamicMigrationBuilderConfig {
  client: DynamicMigrationClients;
}

export interface DynamicMigrationConfig<S> {
  fields: Fields<S>;
  table: string;
  schema: string;
}

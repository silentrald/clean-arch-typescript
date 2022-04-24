import { Table } from '@modules/object-table/types';

export type DynamicMigrationClients = 'pg' | 'mysql' | 'sqlite3';

export interface DynamicMigrationBuilderConfig {
  client: DynamicMigrationClients;
  defaults?: {
    float?: {
      precision: number;
      scale?: number;
    };
    decimal?: {
      precision: number;
      scale?: number;
    }
  }
}

export interface DynamicMigrationConfig<S> {
  table: Table<S>;
}

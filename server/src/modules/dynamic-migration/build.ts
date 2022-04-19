import { camelToSnakeCase } from '@helpers/string';
import { StringField, URIField } from '@modules/fields/types';
import knex from 'knex';
import { DynamicMigrationConfig, DynamicMigrationBuilderConfig } from './types';

const buildMakeDynamicMigration = ({ client, }: DynamicMigrationBuilderConfig) => {
  const qb = knex({
    client,
  });

  return <S> ({
    fields,
    table,
    schema = 'public',
  }: DynamicMigrationConfig<S>) => {
    let primary = false;
    const up = qb.schema.withSchema(schema).createTableIfNotExists(table, (t) => {
      for (const field in fields) {
        let tmp: any;
        const val = fields[field];
        const name = camelToSnakeCase(field);
        switch (val.type) {
        case 'string':
          tmp = t.string(name, (val as StringField).max);
          break;
        case 'uuid':
          tmp = t.uuid(name);
          break;
        case 'email':
          tmp = t.string(name, 256);
          break;
        case 'uri':
          tmp = t.string(name, (val as URIField).max);
          break;
        case 'int':
          tmp = t.integer(name);
          break;
        case 'float':
          tmp = t.float(name);
          break;
        case 'decimal':
          tmp = t.decimal(name);
          break;
        case 'boolean':
          tmp = t.boolean(name);
          break;
        case 'date':
          tmp = t.date(name);
          break;
        case 'time':
          tmp = t.time(name);
          break;
        case 'timestamp':
          tmp = t.timestamp(name, {
            useTz: true,
          });
          break;
        default:
          throw new Error(`Invalid type: ${val.type}`); // TODO: Proper error
        }

        if (val.nullable !== true) {
          tmp = tmp.notNullable();
        }

        if (val.references) {
          const { col, table, } = val.references;
          tmp = tmp.references(col).inTable(table);
        }

        if (val.default) {
          if (val.default === true && val.type === 'uuid') {
            tmp = tmp.default(qb.raw('uuid_generate_v4()'));
          } else {
            tmp = val.default;
          }
        }

        if (val.primary) {
          if (primary) {
            throw new Error('Only 1 primary is allowed'); // TODO: Proper error
          }
          primary = true;
          tmp = tmp.primary();
        }

        if (val.unique) {
          tmp = tmp.unique();
        }
      }
    }).toQuery() + ';';

    const insQb = qb.withSchema(schema).from(table);

    const del = qb.withSchema(schema).from(table).del().toQuery() + ';';

    const down = qb.schema.withSchema(schema)
      .dropTableIfExists(table)
      .toQuery() + ';';

    return Object.freeze({
      makeUp: () => up,

      makeIns: (data?: S[]) => {
        if (!data) return '';
        // TODO: Can be optimized but not really that important
        const parsed: { [key: string]: any }[] = [];
        for (const d of data) {
          const p: { [key: string]: any } = {};
          for (const key in d) {
            p[camelToSnakeCase(key)] = d[key];
          }
          parsed.push(p);
        }
        return insQb.insert(parsed).toQuery() + ';';
      },

      makeDel: () => del,

      makeDown: () => down,
    });
  };
};

export default buildMakeDynamicMigration;
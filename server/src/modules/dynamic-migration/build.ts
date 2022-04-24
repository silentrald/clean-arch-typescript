import { camelToSnakeCase } from '@helpers/string';
import knex from 'knex';
import { DynamicMigrationConfig, DynamicMigrationBuilderConfig } from './types';

const buildMakeDynamicMigration = ({ client, }: DynamicMigrationBuilderConfig) => {
  const qb = knex({
    client,
    log: {
      warn() {
        //
      },
    },
  });

  return <S> ({
    columns,
    table,
    schema = 'public',
    constraints,
  }: DynamicMigrationConfig<S>) => {
    const up = qb.schema.withSchema(schema).createTableIfNotExists(table, (t) => {
      for (const col in columns) {
        let tmp: any;
        const val = columns[col];
        const name = camelToSnakeCase(col);
        switch (val.type) {
        case 'string':
          if (val.max)
            tmp = t.string(name, val.max);
          else
            tmp = t.text(name);
          break;
        case 'uuid':
          tmp = t.uuid(name);
          break;
        case 'email':
          tmp = t.string(name, 256);
          break;
        case 'uri':
          tmp = t.string(name, val.max);
          break;
        case 'serial':
          tmp = t.increments(name, {
            primaryKey: false,
          });
          break;
        case 'int':
          tmp = t.integer(name);
          break;
        case 'float':
          if (val.precision && val.scale) {
            tmp = t.float(name, val.precision, val.scale);
          } else if (val.precision) {
            tmp = t.float(name, val.precision);
          } else {
            tmp = t.float(name, 6, 2); // TODO: Changeable
          }
          break;
        case 'decimal':
          if (val.precision && val.scale) {
            tmp = t.decimal(name, val.precision, val.scale);
          } else if (val.precision) {
            tmp = t.decimal(name, val.precision);
          } else {
            tmp = t.decimal(name, 12, 2); // TODO: Changeable
          }
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
        case 'array':
          if (val.data !== 'string')
            continue;
          tmp = t.string(name);
          break;
        case 'binary':
          tmp = t.binary(name);
          break;
        default:
          throw new Error(`Invalid type: ${(val as any).type}`); // TODO: Proper error
        }

        if (val.nullable !== true) {
          tmp = tmp.notNullable();
        }

        if (val.default) {
          if (val.default === true && val.type === 'uuid') {
            tmp = tmp.default(qb.raw('uuid_generate_v4()'));
          } else {
            tmp = val.default;
          }
        }

        // if (val.unique) {
        //   tmp = tmp.unique();
        // }

        // Always last
        if (val.references) {
          const {
            col, table, name: n, del,
          } = val.references;
          tmp = t.foreign(name, n).references(col).inTable(table);
          if (del) {
            tmp = tmp.onDelete('cascade');
          }
        }
      }

      const { primary, unique, } = constraints;
      if (primary) {
        t.primary([ primary.col as string ], {
          constraintName: primary.name,
        });
      }

      if (unique) {
        for (const { columns, name, } of unique) {
          t.unique((columns as string[]).map((c) => camelToSnakeCase(c)), {
            indexName: name,
          });
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
import knex from 'knex';
import { camelToSnakeCase } from '../../helpers/string';

import {
  DynamicQuery, DynamicQueryBuilderConfig, DynamicQueryConfig
} from './types';

const buildMakeDynamicQuery = ({ client, }: DynamicQueryBuilderConfig) => {
  const qb = knex({
    client,
  });

  return <E, S> ({
    mapping,
    table: {
      name,
      schema,
      constraints,
    },
  }: DynamicQueryConfig<E, S>): DynamicQuery<E, S> => {
    const primary = constraints.primary.col;
    const methods: (keyof E)[] = [];
    const prepared: { [key: string]: any } = {};
    let primaryMethod: keyof E | undefined;

    let i = 0;
    if (client === 'pg') {
      for (const key in mapping) {
        if (key === primary) {
          primaryMethod = mapping[key];
          continue;
        }
        methods.push(mapping[key]);
        prepared[camelToSnakeCase(key)] = qb.raw(`$${++i}`);
      }
    } else if (client === 'mysql' || client === 'sqlite3') {
      for (const key of Object.keys(mapping).sort()) {
        methods.push(mapping[key]);
        prepared[camelToSnakeCase(key)] = qb.raw('?');
      }
    }
    const primaryKey = camelToSnakeCase(primary as string);

    // Insert Query
    const insQuery = qb.withSchema(schema)
      .from(name)
      .insert(prepared)
      .returning(primaryKey)
      .toQuery() + ';';

    // Update Query
    const upQuery = qb.withSchema(schema)
      .from(name)
      .update(prepared)
      .where(primaryKey, '=', qb.raw(client === 'pg' ? `$${++i}` : '?'))
      .toQuery() + ';';

    // Delete Query
    const delQuery = qb.withSchema(schema)
      .from(name)
      .del()
      .where(primaryKey, '=', qb.raw(client === 'pg' ? '$1' : '?'))
      .toQuery() + ';';

    return Object.freeze({
      dynamicInsert: (entity) => {
        const values: any[] = [];
        for (const method of methods) {
          values.push((entity[method] as any)());
        }
        return Object.freeze({
          query: insQuery,
          values,
        });
      },

      dynamicInsertMany: (entities) => {
        const insVals: { [key: string]: any }[] = [];
        for (const e of entities) {
          const ins: { [key: string]: any } = {};
          for (const col in mapping) {
            const method = mapping[col];
            ins[camelToSnakeCase(col)] = (e[method] as any)();
          }
          insVals.push(ins);
        }

        return Object.freeze({
          query: qb.withSchema(schema)
            .from(name)
            .insert(insVals)
            .returning(primaryKey)
            .toQuery() + ';',
        });
      },

      dynamicSelectOne: (col, val, cl) => {
        const rename: { [key: string]: string } = {};
        if (cl === undefined) {
          cl = Object.keys(mapping) as (keyof S)[];
        }
        for (const f of cl) {
          rename[f as string] = camelToSnakeCase(f as string);
        }

        return Object.freeze({
          query: qb.withSchema(schema)
            .from(name)
            .select(rename)
            .where(camelToSnakeCase(col as string), '=', qb.raw(client === 'pg' ? '$1' : '?'))
            .limit(1)
            .toQuery() + ';',
          values: [ val ],
        });
      },

      dynamicSelectAll: (cl, order) => {
        const rename: { [key: string]: string } = {};
        if (cl === undefined) {
          cl = Object.keys(mapping) as (keyof S)[];
        }
        for (const f of cl) {
          rename[f as string] = camelToSnakeCase(f as string);
        }

        let sqb = qb.withSchema(schema)
          .from(name)
          .select(rename);
        if (order) {
          for (const o in order) {
            const name = camelToSnakeCase(o as string);
            sqb = sqb.orderBy(name, order[o]);
          }
        }

        return Object.freeze({
          query: sqb.toQuery() + ';',
        });
      },

      dynamicSelectFilter: (filters, cl, order) => {
        const rename: { [key: string]: string } = {};
        if (cl === undefined) {
          cl = Object.keys(mapping) as (keyof S)[];
        }
        for (const f of cl) {
          rename[f as string] = camelToSnakeCase(f as string);
        }

        let sqb = qb.withSchema(schema)
          .from(name)
          .select(rename);
        let i = 0;
        const values: any[] = [];
        for (const {
          col,
          condition,
          value,
        } of filters) {
          const name = camelToSnakeCase(col as string);
          if (condition === 'in') {
            sqb = sqb.whereIn(name, value);
          } else {
            sqb = sqb.where(name, condition, qb.raw(`$${++i}`));
            values.push(value);
          }
        }

        if (order) {
          for (const o in order) {
            const name = camelToSnakeCase(o as string);
            sqb = sqb.orderBy(name, order[o]);
          }
        }

        return Object.freeze({
          query: sqb.toQuery() + ';',
          values,
        });
      },

      dynamicUpdate: (entity) => {
        const values: any[] = [];
        for (const method of methods) {
          values.push((entity[method] as any)());
        }
        values.push((entity[primaryMethod!] as any)());
        return Object.freeze({
          query: upQuery,
          values,
        });
      },

      dynamicDelete: (id) => {
        return Object.freeze({
          query: delQuery,
          values: [ id ],
        });
      },
    });
  };
};

export default buildMakeDynamicQuery;

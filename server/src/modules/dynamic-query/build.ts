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
    fields,
    primary,
    table,
    schema = 'public',
  }: DynamicQueryConfig<E, S>): DynamicQuery<E, S> => {
    const methods: (keyof E)[] = [];
    const prepared: { [key: string]: any } = {};

    let i = 0;
    if (client === 'pg') {
      for (const key in fields) {
        methods.push(fields[key]);
        prepared[camelToSnakeCase(key)] = qb.raw(`$${++i}`);
      }
    } else if (client === 'mysql' || client === 'sqlite3') {
      for (const key of Object.keys(fields).sort()) {
        methods.push(fields[key]);
        prepared[camelToSnakeCase(key)] = qb.raw('?');
      }
    }
    const primaryKey = camelToSnakeCase(primary as string);

    // Insert Query
    const insQuery = qb.withSchema(schema)
      .from(table)
      .insert(prepared)
      .returning(primaryKey)
      .toQuery() + ';';

    // Update Query
    const upQuery = qb.withSchema(schema)
      .from(table)
      .update(prepared)
      .toQuery();

    // Delete Query
    const delQuery = qb.withSchema(schema)
      .from(table)
      .del()
      .where(primaryKey, '=', client === 'pg' ? '$1' : '?')
      .toQuery();

    // Select Query
    // TODO: Change this
    const selQb = qb.withSchema(schema)
      .from(table);

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

      dynamicSelectOne: (field, val, fs) => {
        const rename: { [key: string]: keyof S } = {};
        if (fs === undefined) {
          fs = Object.keys(fields) as (keyof S)[];
        }
        for (const f of fs) {
          rename[camelToSnakeCase(f as string)] = f;
        }

        return Object.freeze({
          query: selQb.select(rename)
            .where(camelToSnakeCase(field as string), '=', qb.raw(client === 'pg' ? '$1' : '?'))
            .limit(1)
            .toQuery() + ';',
          values: [ val ],
        });
      },

      dynamicSelectAll: (fs) => {
        const rename: { [key: string]: keyof S } = {};
        if (fs === undefined) {
          fs = Object.keys(fields) as (keyof S)[];
        }
        for (const f of fs) {
          rename[camelToSnakeCase(f as string)] = f;
        }

        return Object.freeze({
          query: selQb.select(rename).toQuery() + ';',
        });
      },

      dynamicSelectFilter: (filters, fs) => {
        const rename: { [key: string]: keyof S } = {};
        if (fs === undefined) {
          fs = Object.keys(fields) as (keyof S)[];
        }
        for (const f of fs) {
          rename[camelToSnakeCase(f as string)] = f;
        }

        let sqb = selQb.select(rename);
        let i = 0;
        const values: any[] = [];
        for (const {
          field,
          condition,
          value,
        } of filters) {
          sqb = sqb.where(camelToSnakeCase(field as string), condition, qb.raw(`$${++i}`));
          values.push(value);
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

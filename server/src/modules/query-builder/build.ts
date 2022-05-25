import {
  QueryResult,
  QueryBuilder,
  QueryObject,
  QueryObjectSelect,
  QueryObjectInsert,
  QueryObjectDelete,
  QueryObjectUpdate,
  Where
} from './types';

const makeQueryBuilder: (() => () => QueryBuilder) = () => {
  const createWhere = (wheres: Where[]): string => {
    if (wheres.length === 0)
      return '';

    let query = '';
    const first = wheres.shift()!;
    query += ` where ${first.condition}`;
    for (const { condition, operator, } of wheres)
      query += ` ${operator} ${condition}`;
    wheres.unshift(first);

    return query;
  };

  const createSelect = (qo: QueryObjectSelect): QueryResult => {
    if (!qo.from) {
      throw new Error('No table was declared');
    }

    let selectQuery = '';
    if (qo.select === '*') {
      selectQuery = 'select *';
    } else {
      const select = qo.select as Record<string, string>;
      const sel: string[] = [];
      for (const key in select)
        // Note: Should not be user accessible, or input needs sanitation
        // eslint-disable-next-line security/detect-object-injection
        sel.push(`${select[key]} as "${key}"`);
      selectQuery += `select ${sel.join(', ')}`;
    }

    const table = `${qo.schema || 'public'}.${qo.from}`;
    selectQuery += ` from ${table}`;

    if (qo.joins) {
      for (const {
        table, condition, type,
      } of qo.joins) {
        selectQuery += ` ${type} join ${table} on ${condition}`;
      }
    }

    if (qo.wheres) {
      selectQuery += createWhere(qo.wheres);
    }

    // TODO: Group By Clause

    // TODO: Having Clause

    if (qo.orders) {
      const orders: string[] = [];
      for (const order in qo.orders)
        // Note: Should not be user accessible, or input needs sanitation
        // eslint-disable-next-line security/detect-object-injection
        orders.push(`${order} ${qo.orders[order]}`);

      selectQuery += ` order by ${orders.join(', ')}`;
    }

    if (qo.offset)
      selectQuery += ` offset ${qo.offset}`;
    if (qo.limit)
      selectQuery += ` limit ${qo.limit}`;

    return {
      query: selectQuery + ';',
      values: qo.values || [],
    };
  };

  const createInsert = (qo: QueryObjectInsert): QueryResult => {
    const table = `${qo.schema || 'public'}.${qo.from}`;
    let insertQuery = `insert into ${table}(${qo.columns!.join(', ')}) values `;

    const inserts: string[] = [];
    for (const insert of qo.inserts!) {
      const values: any[] = [];
      for (const col of qo.columns!) {
        // Note: Should not be user accessible, or input needs sanitation
        // eslint-disable-next-line security/detect-object-injection
        const val = insert[col];
        values.push(val !== undefined ? val : 'default');
      }
      inserts.push(`(${values.join(', ')})`);
    }
    insertQuery += inserts.join(', ');

    if (qo.returning) {
      if (typeof qo.returning === 'string') {
        insertQuery += ` returning ${qo.returning}`;
      } else if (typeof qo.returning === 'object') {
        const returning = qo.returning;
        const ret: string[] = [];
        for (const key in returning)
          // Note: Should not be user accessible, or input needs sanitation
          // eslint-disable-next-line security/detect-object-injection
          ret.push(`${returning[key]} as "${key}"`);
        insertQuery += ` returning ${ret.join(', ')}`;
      }
    }

    return {
      query: insertQuery + ';',
      values: qo.values || [],
    };
  };

  const createUpdate = (qo: QueryObjectUpdate): QueryResult => {
    const table = `${qo.schema || 'public'}.${qo.from}`;
    let updateQuery = `update ${table} set `;

    const updates: string[] = [];
    for (const key in qo.update!) {
      // Note: Should not be user accessible, or input needs sanitation
      // eslint-disable-next-line security/detect-object-injection
      const val = qo.update[key];
      updates.push(`${key} = ${val}`);
    }
    updateQuery += updates.join(', ');

    if (qo.wheres) {
      updateQuery += createWhere(qo.wheres);
    }

    return {
      query: updateQuery + ';',
      values: qo.values || [],
    };
  };

  const createDelete = (qo: QueryObjectDelete): QueryResult => {
    const table = `${qo.schema || 'public'}.${qo.from}`;
    let deleteQuery = `delete from ${table}`;

    if (qo.wheres) {
      deleteQuery += createWhere(qo.wheres);
    }

    return {
      query: deleteQuery + ';',
      values: qo.values || [],
    };
  };

  const queryBuilderFunction = (qo: QueryObject) => {
    let i = 0;

    const qb: QueryBuilder = {
      schema: (s) => {
        qo.schema = s;
        return qb;
      },

      from: (table) => {
        qo.from = table;
        return qb;
      },

      where: (condition, operator) => {
        if (!qo.wheres)
          qo.wheres = [];

        qo.wheres.push({
          condition,
          operator: operator || 'and',
        });
        return qb;
      },

      // SELECT
      select: (sel) => {
        if (qo.type)
          throw new Error(`Cannot add select within ${qo.type} statement`);

        qo.type = 'select';
        qo.select = sel || '*';
        return qb;
      },

      join: (table, condition, type) => {
        if (!qo.joins) {
          qo.joins = [];
        }

        qo.joins.push({
          table,
          condition,
          type: type || 'inner',
        });
        return qb;
      },

      orderBy: (orders) => {
        qo.orders = orders;
        return qb;
      },

      limit: (lmt) => {
        qo.limit = lmt;
        return qb;
      },

      offset: (off) => {
        qo.offset = off;
        return qb;
      },

      // INSERT
      insert: (inserts, columns) => {
        if (qo.type)
          throw new Error(`Cannot add insert within ${qo.type} statement`);

        qo.type = 'insert';
        qo.inserts = inserts;

        if (!columns)
          columns = inserts.flatMap(Object.keys);
        qo.columns = columns;

        return qb;
      },

      returning: (ret) => {
        qo.returning = ret || '*';
        return qb;
      },

      // UPDATE
      update: (up) => {
        if (qo.type)
          throw new Error(`Cannot add update within ${qo.type} statement`);

        qo.type = 'update';
        qo.update = up;
        return qb;
      },

      // DELETE
      del: () => {
        if (qo.type)
          throw new Error(`Cannot add delete within ${qo.type} statement`);

        qo.type = 'delete';
        return qb;
      },

      // FUNCTIONS
      value: (val) => {
        if (!qo.values)
          qo.values = [];
        qo.values.push(val);
        return `$${++i}`;
      },

      reset: () => {
        qo = {};
        i = 0;
      },

      toQuery: () => {
        switch (qo.type as any) {
        case 'select':
          return createSelect(qo);
        case 'insert':
          return createInsert(qo);
        case 'update':
          return createUpdate(qo);
        case 'delete':
          return createDelete(qo);
        }
        throw new Error('No query function was declared');
      },
    };

    return qb;
  };

  return () => {
    return queryBuilderFunction({});
  };
};

export default makeQueryBuilder;
import {
  QueryResult, QueryBuilder, QueryObjectSelect, QueryObject, QueryObjectInsert
} from './types';

const makeQueryBuilder: (() => () => QueryBuilder) = () => {
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
      const first = qo.wheres.shift()!;
      selectQuery += ` where ${first.condition}`;
      for (const { condition, operator, } of qo.wheres)
        selectQuery += ` ${operator} ${condition}`;
      qo.wheres.unshift(first);
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

      // SELECT
      select: (sel) => {
        if (qo.type)
          throw new Error(`Cannot add select within ${qo.type} statement`);

        (qo as any).type = 'select';
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

      where: (condition, operator) => {
        if (!qo.wheres)
          qo.wheres = [];

        qo.wheres.push({
          condition,
          operator: operator || 'and',
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

        (qo as any).type = 'insert';
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
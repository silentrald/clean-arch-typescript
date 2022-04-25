import { Table } from '@modules/object-table/types';
import { SCHEMA } from '@config';
import { UserSchema } from './types';

const table = 'users';

export const userTable: Table<UserSchema> = {
  name: table,
  schema: SCHEMA,
  columns: {
    id: {
      type: 'uuid',
      nullable: true,
    },
    username: {
      type: 'string',
      min: 8,
      max: 50,
    },
    password: {
      type: 'string',
      min: 8,
      max: 60,
      nullable: true,
    },
    email: { type: 'email', },
    fname: {
      type: 'string',
      min: 1,
      max: 50,
    },
    lname: {
      type: 'string',
      min: 1,
      max: 50,
    },
  },
  constraints: {
    primary: {
      col: 'id',
      name: `${table}_pk`,
    },
  },
};


import { makeDb } from 'db';
import makeUserDb from './build';
import { validate as validateUUID } from 'uuid';
import makeDynamicQuery from '@modules/dynamic-query';
import { User, UserSchema } from '@entities/user/types';

export const TABLE_NAME = 'users';
const SCHEMA = process.env.SCHEMA || 'public';

const db = makeDb();
const {
  dynamicSelectOne,
  dynamicInsert,
  dynamicDelete,
} = makeDynamicQuery<User, UserSchema>({
  fields: {
    id: 'getId',
    username: 'getUsername',
    password: 'getHash',
    email: 'getEmail',
    fname: 'getFname',
    lname: 'getLname',
  },
  primary: 'id',
  table: TABLE_NAME,
  schema: SCHEMA,
});

const { dynamicUpdate, } = makeDynamicQuery<User, UserSchema>({
  fields: {
    id: 'getId',
    username: 'getUsername',
    email: 'getEmail',
    fname: 'getFname',
    lname: 'getLname',
  },
  primary: 'id',
  table: TABLE_NAME,
  schema: SCHEMA,
});

const userDb = makeUserDb({
  db,
  validate: {
    id: validateUUID,
  },
  dynamicQuery: {
    dynamicSelectOne,
    dynamicInsert,
    dynamicDelete,
    dynamicUpdate,
  },
  table: TABLE_NAME,
  schema: SCHEMA,
});

export default userDb;

import { makeDb } from '@db/_core';
import makeUserDb from './build';
import { validate as validateUUID } from 'uuid';
import { userTable } from '@entities/user/table';

const db = makeDb();

const userDb = makeUserDb({
  db,
  validate: { id: validateUUID, },
  table: userTable,
});

export default userDb;
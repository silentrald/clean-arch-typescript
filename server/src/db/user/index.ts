import makeUserDb from './build';
import { validate as validateUUID } from 'uuid';
import { userTable } from '@entities/user/table';
import db from '@db/_core';

const userDb = makeUserDb({
  db,
  validate: { id: validateUUID, },
  table: userTable,
});

export default userDb;
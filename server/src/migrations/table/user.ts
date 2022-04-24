import {
  userConstraint, userColumns, userTable
} from '@entities/user/db';
import { UserSchema } from '@entities/user/types';
import makeDynamicMigration from '@modules/dynamic-migration';

const {
  makeUp, makeIns, makeDel, makeDown,
} = makeDynamicMigration<UserSchema>({
  columns: userColumns,
  constraints: userConstraint,
  table: userTable,
  schema: 'public',
});

const userMigration = {
  up: makeUp(),
  ins: makeIns(),
  del: makeDel(),
  down: makeDown(),
};

export default userMigration;
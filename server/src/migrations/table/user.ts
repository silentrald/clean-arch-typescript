import { userTable } from '@entities/user/table';
import { UserSchema } from '@entities/user/types';
import makeDynamicMigration from '@modules/dynamic-migration';

const {
  makeUp, makeIns, makeDel, makeDown,
} = makeDynamicMigration<UserSchema>({ table: userTable, });

const userMigration = {
  up: makeUp(),
  ins: makeIns(),
  del: makeDel(),
  down: makeDown(),
};

export default userMigration;
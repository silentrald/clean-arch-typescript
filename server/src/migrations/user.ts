import userFields from '@entities/user/fields';
import { UserSchema } from '@entities/user/types';
import makeDynamicMigration from '@modules/dynamic-migration';

const {
  makeUp, makeIns, makeDel, makeDown,
} = makeDynamicMigration<UserSchema>({
  fields: userFields,
  table: 'users',
  schema: 'public',
});

const userMigration = {
  up: makeUp(),
  ins: makeIns(),
  del: makeDel(),
  down: makeDown(),
};

export default userMigration;
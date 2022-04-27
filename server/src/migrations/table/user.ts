import { userTable } from '@entities/user/table';
import { UserSchema } from '@entities/user/types';
import makeDynamicMigration from '@modules/dynamic-migration';

const {
  makeUp, makeIns, makeDel, makeDown,
} = makeDynamicMigration<UserSchema>({ table: userTable, });

const users: UserSchema[] = [ {
  username: 'username',
  password: '$2b$08$sBL5y.wnGa5FsUMp3TKGgetzHAfx2o6AqMbvJRWD7e/Sqoxp3qT5K',
  email: 'sample@example.com',
  fname: 'sample',
  lname: 'sample',
} ];

const userMigration = {
  up: makeUp(),
  ins: makeIns(users),
  del: makeDel(),
  down: makeDown(),
};

export default userMigration;
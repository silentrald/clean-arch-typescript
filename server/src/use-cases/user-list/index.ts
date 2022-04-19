import makeUserList from './build';
import userDb from 'db/user';

const userList = makeUserList({
  userDb,
});

export default userList;
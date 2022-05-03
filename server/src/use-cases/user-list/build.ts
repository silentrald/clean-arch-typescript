import makeUser from '@entities/user';
import { UserList, UserListConfig } from './types';

const makeUserList = ({ userDb, }: UserListConfig): UserList => {

  const userList: UserList = {
    addUser: async (us) => {
      const user = makeUser(us);
      await user.hashPassword();
      return await userDb.add(user);
    },

    getUserById: async (id) => {
      const s = await userDb.getById(id);

      const user = makeUser(s);
      user.passToHash();

      return user;
    },

    getUserByUsername: async (username) => {
      const s = await userDb.getByUsername(username);

      const user = makeUser(s);
      user.passToHash();

      return user;
    },

    getUserByEmail: async (email) => {
      const s = await userDb.getByEmail(email);

      const user = makeUser(s);
      user.passToHash();

      return user;
    },

    updateUserInfoById: async (us) => {
      const user = makeUser(us);
      return await userDb.updateInfo(user);
    },

    updateUserPasswordById: async (id, password) => {
      const user = makeUser({
        id,
        username: 'username',
        password,
        fname: 's',
        lname: 's',
        email: 'none@example.com',
      });
      await user.hashPassword();
      return await userDb.updatePassword(user);
    },

    removeUserById: async (id: string) => {
      return await userDb.del(id);
    },
  };

  return Object.freeze(userList);
};

export default makeUserList;
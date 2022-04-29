import makeUser from '@entities/user';
import { User } from '@entities/user/types';
import { UserList, UserListConfig } from './types';


const makeUserList = ({ userDb, }: UserListConfig) => {

  const userList: UserList = {
    addUser: async (user: User) => {
      await user.hashPassword();
      await userDb.add(user);
    },

    getUserById: async (id: string) => {
      const s = await userDb.getById(id);

      const user = makeUser(s);
      user.passToHash();

      return user;
    },

    getUserByUsername: async (username: string) => {
      const s = await userDb.getByUsername(username);

      const user = makeUser(s);
      user.passToHash();

      return user;
    },

    getUserByEmail: async (email: string) => {
      const s = await userDb.getByEmail(email);

      const user = makeUser(s);
      user.passToHash();

      return user;
    },

    updateUserInfoById: async (user: User) => {
      return await userDb.updateInfo(user);
    },

    updateUserPasswordById: async (id: string, password: string) => {
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
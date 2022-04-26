import makeUser from '@entities/user';
import { User } from '@entities/user/types';
import { UserListConfig } from './types';


const makeUserList = ({ userDb, }: UserListConfig) => {
  const addUser = async (user: User) => {
    await userDb.add(user);
  };

  const getUserById = async (id: string) => {
    const s = await userDb.getById(id);

    const user = makeUser(s);
    user.passToHash();

    return user;
  };

  const getUserByUsername = async (username: string) => {
    const s = await userDb.getByUsername(username);

    const user = makeUser(s);
    user.passToHash();

    return user;
  };

  const getUserByEmail = async (email: string) => {
    const s = await userDb.getByEmail(email);

    const user = makeUser(s);
    user.passToHash();

    return user;
  };

  const updateUser = async (user: User) => {
    return await userDb.updateWithoutPassword(user);
  };

  const updateUserPassword = async (user: User) => {
    return await userDb.updatePassword(user);
  };

  const removeUserById = async (id: string) => {
    return await userDb.del(id);
  };

  return Object.freeze({
    addUser,
    getUserById,
    getUserByUsername,
    getUserByEmail,
    updateUser,
    updateUserPassword,
    removeUserById,
  });
};

export default makeUserList;
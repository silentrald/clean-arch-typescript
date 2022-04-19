import makeUser from '@entities/user';
import { User } from '@entities/user/types';
import { UserListConfig } from './types';


const makeUserList = ({ userDb, }: UserListConfig) => {
  const addUser = async (user: User) => {
    await userDb.add(user);
  };

  const getUserById = async (id: string) => {
    const userSchema = await userDb.getById(id);

    const user = makeUser(userSchema);
    user.setPasswordToHash();

    return user;
  };

  const getUserByUsername = async (username: string) => {
    const userSchema = await userDb.getByUsername(username);

    const user = makeUser(userSchema);
    user.setPasswordToHash();

    return user;
  };

  const getUserByEmail = async (email: string) => {
    const userSchema = await userDb.getByEmail(email);

    const user = makeUser(userSchema);
    user.setPasswordToHash();

    return user;
  };

  const updateUser = async (user: User) => {
    return await userDb.updateWithoutPassword(user);
  };

  const updateUserPassword = async (user: User) => {
    return await userDb.updatePassword(user);
  };

  const delUserById = async (id: string) => {
    return await userDb.del(id);
  };

  return Object.freeze({
    addUser,
    getUserById,
    getUserByUsername,
    getUserByEmail,
    updateUser,
    updateUserPassword,
    delUserById,
  });
};

export default makeUserList;
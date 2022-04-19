import { UserDb } from 'db/user/types';
import { User } from 'entities/user/types';

export interface UserListConfig {
  userDb: UserDb;
}

export interface UserList {
  addUser: (user: User) => Promise<void>;
  getUserById: (id: string) => Promise<User>;
  getUserByUsername: (username: string) => Promise<User>;
  updateUser: (user: User) => Promise<boolean>;
  updateUserPassword: (user: User) => Promise<boolean>;
  deleteUserById: (id: string) => Promise<boolean>;
}
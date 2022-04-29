import { UserDb } from 'db/user/types';
import { User } from 'entities/user/types';

export interface UserListConfig {
  userDb: UserDb;
}

export interface UserList {
  addUser: (user: User) => Promise<void>;
  getUserById: (id: string) => Promise<User>;
  getUserByUsername: (username: string) => Promise<User>;
  getUserByEmail: (email: string) => Promise<User>;
  updateUserInfoById: (user: User) => Promise<boolean>;
  updateUserPasswordById: (id: string, password: string) => Promise<boolean>;
  removeUserById: (id: string) => Promise<boolean>;
}
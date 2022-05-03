import { UserDb } from 'db/user/types';
import { User, UserSchema } from 'entities/user/types';

export interface UserListConfig {
  userDb: UserDb;
}

export interface UserList {
  addUser: (us: UserSchema) => Promise<string>;
  getUserById: (id: string) => Promise<User>;
  getUserByUsername: (username: string) => Promise<User>;
  getUserByEmail: (email: string) => Promise<User>;
  updateUserInfoById: (us: UserSchema) => Promise<boolean>;
  updateUserPasswordById: (id: string, password: string) => Promise<boolean>;
  removeUserById: (id: string) => Promise<boolean>;
}
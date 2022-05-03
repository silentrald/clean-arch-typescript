import { User, UserSchema } from '@entities/user/types';
import {
  Db,
  DbActionTransform, TransactionDb
} from '@db/_core/types';
import { Table } from '@modules/object-table/types';

export interface UserDbConfig<S> {
  validate: {
    id: (id: string) => boolean;
  },
  db: Db;
  table: Table<S>;
}

// Support for joining values, use extends to add other values
// export interface UserJoin extends UserSchema;

export interface UserDbAction {
  add: (user: User) => Promise<string>;
  getById: (id: string) => Promise<UserSchema>;
  getByUsername: (username: string) => Promise<UserSchema>;
  getByEmail: (email: string) => Promise<UserSchema>;
  updateInfoById: (user: User) => Promise<boolean>;
  updatePasswordById: (user: User) => Promise<boolean>;
  removeById: (id: string) => Promise<boolean>;
}

export type UserDbClient = DbActionTransform<UserDbAction>;

export type UserDb = TransactionDb<UserDbAction>;
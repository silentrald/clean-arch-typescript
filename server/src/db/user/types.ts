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

export interface UserDbAction {
  getById: (id: string, columns?: (keyof UserSchema)[]) => Promise<UserSchema>;
  getByUsername: (username: string, columns?: (keyof UserSchema)[]) => Promise<UserSchema>;
  getByEmail: (email: string, columns?: (keyof UserSchema)[]) => Promise<UserSchema>;
  add: (user: User) => Promise<string>;
  updateInfo: (user: User) => Promise<boolean>;
  updatePassword: (user: User) => Promise<boolean>;
  del: (id: string) => Promise<boolean>;
}

export type UserDbClient = DbActionTransform<UserDbAction>;

export type UserDb = TransactionDb<UserDbAction>;
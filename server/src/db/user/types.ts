import { User, UserSchema } from '@entities/user/types';
import { DynamicQuery } from '@modules/dynamic-query/types';
import {
  Db,
  DbActionTransform, DbClient, EntityDbConfig
} from '@db/types';

export interface UserDbConfig<E, S> extends EntityDbConfig {
  validate: {
    id: (id: string) => boolean;
  },
  dynamicQuery: Partial<DynamicQuery<E, S>>;
  db: Db;
}

export interface UserDbAction {
  getById: (id: string, columns?: (keyof UserSchema)[]) => Promise<UserSchema>;
  getByUsername: (username: string, columns?: (keyof UserSchema)[]) => Promise<UserSchema>;
  getByEmail: (email: string, columns?: (keyof UserSchema)[]) => Promise<UserSchema>;
  add: (user: User) => Promise<string>;
  updateWithoutPassword: (user: User) => Promise<boolean>;
  updatePassword: (user: User) => Promise<boolean>;
  del: (id: string) => Promise<boolean>;
}

export type UserDbClient = DbActionTransform<UserDbAction>;

export interface UserDb extends UserDbAction {
  transaction: (client: DbClient) => Partial<UserDbAction>;
}
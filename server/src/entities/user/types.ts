import { Entity } from '@entities/_core/types';

export interface UserSchema {
  id?: string;
  username: string;
  password?: string;
  email: string;
  fname: string;
  lname: string;
}

export interface User extends Entity<UserSchema> {
  getHash: () => string;
  passToHash: () => void;
  removePassword: () => void;

  hashPassword: () => Promise<void>;
  comparePassword: (pass: string) => Promise<boolean>;
}

export interface BuildMakeUserConfig {
  validate: (user: UserSchema) => string[] | undefined;
  sanitize: (user: UserSchema) => UserSchema;
  hash: (pass: string) => Promise<string>;
  compare: (pass: string, hash: string) => Promise<boolean>;
}

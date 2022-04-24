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
  comparePassword: (pass: string) => boolean;
}

export interface BuildMakeUserConfig {
  validate: (user: UserSchema) => string[] | undefined;
  sanitize: (user: UserSchema) => UserSchema;
  hash: (pass: string) => string;
  compare: (pass: string, hash: string) => boolean;
}

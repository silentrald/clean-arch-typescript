import { Entity } from 'entities/types';

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
  setPasswordToHash: () => void;
  removePassword: () => void;
  comparePassword: (pass: string) => boolean;
}

export interface BuildMakeUserConfig {
  validate: (user: UserSchema) => string[] | undefined;
  makeHash: (pass: string) => string;
  compareHash: (pass: string, hash: string) => boolean;
}

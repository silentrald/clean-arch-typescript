
import UserError from './error';
import {
  BuildMakeUserConfig,
  User,
  UserSchema
} from './types';

const buildMakeUser = ({
  validate, makeHash, compareHash,
}: BuildMakeUserConfig) => ({
  id,
  username,
  password,
  email,
  fname,
  lname,
}: UserSchema): User => {
  const user = {
    username,
    password,
    email,
    fname,
    lname,
  };

  const errors = validate(user);
  if (errors) {
    throw new UserError(errors);
  }

  let hash = '';
  return Object.freeze({
    getId: () => id,
    getUsername: () => username,
    getPassword: () => password,
    getEmail: () => email,
    getFname: () => fname,
    getLname: () => lname,

    getHash: () => {
      if (hash) return hash;

      if (!password) {
        throw new UserError([ 'no_password' ]);
      }

      hash = makeHash(password);
      return hash;
    },

    setPasswordToHash: () => {
      if (hash) return;

      if (!password) {
        throw new UserError([ 'no_password' ]);
      }

      hash = password;
      password = undefined;
    },

    removePassword: () => {
      password = undefined;
      hash = '';
    },

    comparePassword: (pass: string) => {
      if (!hash) {
        // throw new UserError([ 'no_hash' ]);
        return false;
      }

      return compareHash(pass, hash);
    },
  });
};

export default buildMakeUser;
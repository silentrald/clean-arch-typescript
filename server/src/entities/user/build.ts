
import UserError from './error';
import {
  BuildMakeUserConfig,
  User,
  UserSchema
} from './types';

const buildMakeUser = ({
  validate, sanitize, hash, compare,
}: BuildMakeUserConfig) => (
  user: UserSchema): User => {
  const errors = validate(user);
  if (errors) {
    throw new UserError(errors);
  }

  user = sanitize(user);
  let hashString = '';

  return Object.freeze({
    getId: () => user.id,
    getUsername: () => user.username,
    getPassword: () => user.password,
    getEmail: () => user.email,
    getFname: () => user.fname,
    getLname: () => user.lname,

    getHash: () => {
      if (hashString) return hashString;

      if (!user.password) {
        throw new UserError([ 'no_password' ]);
      }

      hashString = hash(user.password);
      return hashString;
    },

    passToHash: () => {
      if (hashString) return;

      if (!user.password) {
        throw new UserError([ 'no_password' ]);
      }

      hashString = user.password;
      user.password = undefined;
    },

    removePassword: () => {
      user.password = undefined;
      hashString = '';
    },

    comparePassword: (pass: string) => {
      if (!hashString) {
        // throw new UserError([ 'no_hash' ]);
        return false;
      }

      return compare(pass, hashString);
    },
  });
};

export default buildMakeUser;
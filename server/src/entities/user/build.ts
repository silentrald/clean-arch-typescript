
import UserError from './error';
import {
  BuildMakeUserConfig,
  User,
  UserSchema
} from './types';

const buildMakeUser = ({
  validate, sanitize, makeHash, compareHash,
}: BuildMakeUserConfig) => (
  user: UserSchema): User => {
  const errors = validate(user);
  if (errors) {
    throw new UserError(errors);
  }

  user = sanitize(user);

  let hash = '';
  return Object.freeze({
    getId: () => user.id,
    getUsername: () => user.username,
    getPassword: () => user.password,
    getEmail: () => user.email,
    getFname: () => user.fname,
    getLname: () => user.lname,

    getHash: () => {
      if (hash) return hash;

      if (!user.password) {
        throw new UserError([ 'no_password' ]);
      }

      hash = makeHash(user.password);
      return hash;
    },

    setPasswordToHash: () => {
      if (hash) return;

      if (!user.password) {
        throw new UserError([ 'no_password' ]);
      }

      hash = user.password;
      user.password = undefined;
    },

    removePassword: () => {
      user.password = undefined;
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
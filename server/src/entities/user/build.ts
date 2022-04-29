
import UserError from './error';
import {
  BuildMakeUserConfig,
  User,
  UserSchema
} from './types';

const buildMakeUser = ({
  validate, sanitize, hash, compare,
}: BuildMakeUserConfig) => (
  user: UserSchema
): User => {
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

    getHash: () => hashString,

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

    hashPassword: async () => {
      if (!user.password) {
        throw new UserError([ 'no_password' ]);
      }

      hashString = await hash(user.password);
      user.password = undefined;
    },

    comparePassword: async (pass: string) => {
      if (!hashString) {
        return false;
      }

      return await compare(pass, hashString);
    },
  });
};

export default buildMakeUser;
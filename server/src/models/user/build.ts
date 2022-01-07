import { INVALID_USER } from '@error';

import { User, UserSchema } from './types';

const build = ({ validator }) => ({
  username,
  password,
  email,
  fname,
  lname
}: UserSchema): User => {
  const valid = validator({
    username,
    password,
    email,
    fname,
    lname
  });

  if (!valid)
    throw { error: INVALID_USER };

  return Object.freeze({
    getUsername: () => username,
    getPassword: () => password,
    getEmail: () => email,
    getFname: () => fname,
    getLname: () => lname,

    removePassword: () => password = undefined,
  });
};

export default build;
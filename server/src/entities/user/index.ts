import buildMakeUser from './build';
import { UserSchema } from './types';
import userSchema from './schema';
import { createValidator, parseValidatorErrors } from '@modules/validate';
import bcrypt from 'bcrypt';

const validator = createValidator(userSchema);
const validate = (user: UserSchema): string[] | undefined => {
  const valid = validator(user);

  if (!valid) {
    return parseValidatorErrors(validator.errors!);
  }
};

const sanitize = (user: UserSchema) => {
  user.username = user.username.trim();
  user.email = user.email.trim();
  user.fname = user.fname.trim();
  user.lname = user.lname.trim();

  return user;
};

const hash = (pass: string) => {
  return bcrypt.hashSync(pass, 8);
};

const compare = (pass: string, hash: string) => {
  return bcrypt.compareSync(pass, hash);
};

const makeUser = buildMakeUser({
  validate,
  sanitize,
  hash,
  compare,
});

export default makeUser;

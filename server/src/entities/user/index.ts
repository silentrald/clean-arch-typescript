import buildMakeUser from './build';
import { UserSchema } from './types';
import userSchema from './schema';
import { createValidator, parseValidatorErrors } from 'modules/validate';
import bcrypt from 'bcrypt';

const validator = createValidator(userSchema);
const validate = (user: UserSchema): string[] | undefined => {
  const valid = validator(user);

  if (!valid) {
    return parseValidatorErrors(validator.errors!);
  }
};

const makeHash = (pass: string) => {
  return bcrypt.hashSync(pass, 8);
};

const compareHash = (pass: string, hash: string) => {
  return bcrypt.compareSync(pass, hash);
};

const makeUser = buildMakeUser({
  validate,
  makeHash,
  compareHash,
});

export default makeUser;

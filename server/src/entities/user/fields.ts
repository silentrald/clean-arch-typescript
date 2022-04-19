import { Fields } from '@modules/fields/types';
import { UserSchema } from './types';

const userFields: Fields<UserSchema> = {
  id: {
    type: 'uuid',
    nullable: true,
    required: false,
    primary: true,
  },
  username: {
    type: 'string',
    min: 8,
    max: 50,
  },
  password: {
    type: 'string',
    min: 8,
    max: 60,
    nullable: true,
    required: false,
  },
  email: {
    type: 'email',
  },
  fname: {
    type: 'string',
    min: 1,
    max: 50,
  },
  lname: {
    type: 'string',
    min: 1,
    max: 50,
  },
};

export default userFields;
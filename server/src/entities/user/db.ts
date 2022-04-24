import { ColumnConstraint, Columns } from '@modules/columns/types';
import { UserSchema } from './types';

export const userTable = 'users';

export const userColumns: Columns<UserSchema> = {
  id: {
    type: 'uuid',
    nullable: true,
    required: false,
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

export const userConstraint: ColumnConstraint<UserSchema> = {
  primary: {
    col: 'id',
    name: `${userTable}_pk`,
  },
};

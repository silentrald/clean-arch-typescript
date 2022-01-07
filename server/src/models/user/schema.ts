import { JSONSchemaType } from 'ajv';
import { UserSchema } from './types';

const schema: JSONSchemaType<UserSchema> = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 8,
      maxLength: 50,
    },
    password: {
      type: 'string',
      nullable: true,
      minLength: 8,
      maxLength: 60,
    },
    email: {
      type: 'string',
      format: 'email',
    },
    fname: {
      type: 'string',
      maxLength: 50,
    },
    lname: {
      type: 'string',
      maxLength: 50,
    },
  },
  required: [
    'username',
    'email',
    'fname',
    'lname'
  ]
};

export default schema;

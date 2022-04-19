import fieldsToSchema from '@modules/fields';
import { createValidatorErrors } from 'modules/validate';
import userFields from './fields';

const userSchema = fieldsToSchema(userFields);
createValidatorErrors(userSchema);
console.log(userSchema);

export default userSchema;

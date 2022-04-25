import tableToSchema from '@modules/object-table';
import { createValidatorErrors } from '@modules/validate';
import { userTable } from './table';

const userSchema = tableToSchema(userTable);
createValidatorErrors(userSchema);

export default userSchema;

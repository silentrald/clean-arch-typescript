import columnsToSchema from '@modules/columns';
import { createValidatorErrors } from 'modules/validate';
import { userColumns } from './db';

const userSchema = columnsToSchema(userColumns);
createValidatorErrors(userSchema);

export default userSchema;

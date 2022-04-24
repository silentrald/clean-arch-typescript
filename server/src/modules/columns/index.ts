import makeColumnsToSchema from './build';
import { camelToSnakeCase } from '@helpers/string';

const columnsToSchema = makeColumnsToSchema({
  camelToSnakeCase,
});

export default columnsToSchema;
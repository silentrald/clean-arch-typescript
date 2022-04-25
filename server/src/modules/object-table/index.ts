import makeTableToSchema from './build';
import { camelToSnakeCase } from '@helpers/string';

const tableToSchema = makeTableToSchema({ camelToSnakeCase, });

export default tableToSchema;
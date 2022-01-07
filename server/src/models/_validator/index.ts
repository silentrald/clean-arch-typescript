import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';

const ajv = new Ajv({
  allErrors: true,
});
require('ajv-formats')(ajv);

export const validator = (
  schema: JSONSchemaType<any>
): ValidateFunction<unknown> => {
  return ajv.compile(schema);
};
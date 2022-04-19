import {
  ErrorObject, JSONSchemaType, ValidateFunction
} from 'ajv';

import Ajv from 'ajv';
const ajv = new Ajv({
  allErrors: true,
});
require('ajv-formats')(ajv);
require('ajv-errors')(ajv);

export const createValidator = <T>(schema: JSONSchemaType<T>): ValidateFunction<T> => {
  return ajv.compile<T>(schema);
};

const SHORTEN: { [key: string]: string } = {
  type: 'type',
  format: 'fmt',
  minLength: 'min',
  maxLength: 'max',
  pattern: 'pat',

  minimum: 'min',
  maximum: 'max',
};

export const createValidatorErrors = <T>(schema: JSONSchemaType<T>): void => {
  for (const prop in schema.properties) {
    const val = schema.properties[prop];
    const errorMessage: { [key: string]: any } = {};
    for (const key in val) {
      if (key in SHORTEN)
        errorMessage[key] = `${prop}_${SHORTEN[key]}`;
    }
    val.errorMessage = errorMessage;
  }
};

export const parseValidatorErrors = (
  errors: ErrorObject<string, Record<string, any>, unknown>[]
): string[] => {
  return errors.reduce((arr, { message, }) => {
    arr.push(message || '');
    return arr;
  }, [] as string[]);
};

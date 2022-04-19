import { JSONSchemaType } from 'ajv';
import { Fields } from './types';

const makeFieldsToSchema = () => {
  return <S>(fields: Fields<S>) => {
    const properties: { [key: string]: { [key: string]: any } } = {};
    const required: (keyof S)[] = [];

    for (const field in fields) {
      const val = fields[field];

      if (val.required !== false)
        required.push(field);

      let property: { [key: string]: any } = {};

      switch (val.type) {
      case 'string':
        property = {
          type: 'string',
          minLength: val.min,
          maxLength: val.max,
        };
        break;
      case 'uuid':
        property = {
          type: 'string',
          format: 'uuid',
        };
        break;
      case 'email':
        property = {
          type: 'string',
          format: 'email',
        };
        break;
      case 'uri':
        property = {
          type: 'string',
          format: 'uri',
        };
        break;
      case 'int':
        property = {
          type: 'int',
          minimum: val.min,
          maximum: val.max,
        };
        break;
      case 'float':
      case 'decimal':
        property = {
          type: 'number',
          minimum: val.min,
          maximum: val.max,
        };
        break;
      case 'boolean':
        property = {
          type: 'boolean',
        };
        break;
      case 'date':
        property = {
          type: 'string',
          format: 'date',
        };
        break;
      case 'time':
        property = {
          type: 'string',
          format: 'time',
        };
        break;
      case 'timestamp':
        property = {
          type: 'string',
          format: 'timestamp',
        };
        break;
      default:
        throw new Error('Invalid type');
      }

      if (val.nullable) {
        property.nullable = true;
      }

      properties[field] = property;
    }

    const schema: any = {
      type: 'object',
      properties,
      required,
      additionalProperties: false,
    };

    return schema as JSONSchemaType<S>;
  };
};

export default makeFieldsToSchema;
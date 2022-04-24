import { JSONSchemaType } from 'ajv';
import {
  Columns, ColumnToSchemaConfig, Table
} from './types';

const makeTableToSchema = ({ camelToSnakeCase, }: ColumnToSchemaConfig) => {
  const columnsToSchema = <S> (columns: Columns<S>) => {
    const properties: { [key: string]: { [key: string]: any } } = {};
    const required: (keyof S)[] = [];

    for (const col in columns) {
      const val = columns[col];

      if (!val.nullable)
        required.push(col);

      let property: { [key: string]: any } = {};

      switch (val.type) {
      case 'string':
        property = {
          type: 'string',
        };
        if (val.min)
          property.minLength = val.min;
        if (val.max)
          property.maxLength = val.max;
        if (val.pattern)
          property.pattern = val.pattern;
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
      case 'serial':
        property = {
          type: 'integer',
        };
        break;
      case 'int':
        property = {
          type: 'integer',
        };
        if (val.min)
          property.minimum = val.min;
        if (val.max)
          property.maximum = val.max;
        break;
      case 'float':
      case 'decimal':
        property = {
          type: 'number',
        };
        if (val.min)
          property.minimum = val.min;
        if (val.max)
          property.maximum = val.max;
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
          format: 'date-time',
        };
        break;
      case 'array':
        property = {
          type: 'array',
          items: {
            type: val.itemType,
          },
        };
        if (val.min)
          property.minItems = val.min;
        if (val.max)
          property.maxItems = val.max;
        break;
      case 'binary':
        property = {
          type: 'string',
        };
        break;
      case 'object':
        property = columnsToSchema(val.properties);
        break;
      default:
        throw new Error('Invalid type');
      }

      if (val.nullable) {
        property.nullable = true;
      }

      properties[col] = property;
    }

    const requiredErrors: { [key: string]: string } = {};
    for (const r of required) {
      requiredErrors[r as string] = camelToSnakeCase(r as string) + '_req';
    }

    const schema: any = {
      type: 'object',
      properties,
      required,
      additionalProperties: false,
      errorMessage: {
        required: requiredErrors,
      },
    };

    return schema as JSONSchemaType<S>;
  };

  const tableToSchema = <S> (table: Table<S>) => {
    return columnsToSchema(table.columns);
  };

  return tableToSchema;
};

export default makeTableToSchema;
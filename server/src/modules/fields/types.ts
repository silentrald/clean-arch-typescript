export interface Field {
  type: string;
  default?: string | number | boolean;
  required?: boolean;
  primary?: boolean;
  nullable?: boolean;
  unique?: boolean;
  references?: {
    col: string;
    table: string;
  }
}

export interface StringField extends Field {
  type: 'string';
  empty?: boolean;
  min?: number;
  max?: number;
}

export interface UUIDField extends Field {
  type: 'uuid';
}

export interface EmailField extends Field {
  type: 'email';
}

export interface URIField extends Field {
  type: 'uri';
  max: number;
}

interface NumberField extends Field {
  min?: number;
  max?: number;
}

export interface IntField extends NumberField {
  type: 'int';
}

export interface FloatField extends NumberField {
  type: 'float';
}

export interface DecimalField extends NumberField {
  type: 'decimal';
}

export interface BooleanField extends Field {
  type: 'boolean';
}

export interface DateField extends Field {
  type: 'date';
}

export interface TimeField extends Field {
  type: 'time';
}

export interface TimestampField extends Field {
  type: 'timestamp';
}

export type Fields<S> = {
  [K in keyof Required<S>]
    : S[K] extends string | undefined ?
      StringField | UUIDField | EmailField | URIField | DateField | TimeField | TimestampField
    : S[K] extends number | undefined ?
      IntField | FloatField | DecimalField
    : S[K] extends boolean | undefined ?
      BooleanField
    : Field;
}

export type Entity<T> = {
  -readonly [
    K in keyof Required<T> as T[K] extends boolean
    ? `is${Capitalize<string & K>}`
    : `get${Capitalize<string & K>}`
  ]:() => T[K];
}

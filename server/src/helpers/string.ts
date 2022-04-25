// Naming conventions
export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const camelToSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const snakeToCamelCase = (str: string): string =>
  str.replace(/_[a-z]/g, letter => `${letter.charAt(1).toUpperCase()}`);

export const generateTestString = (n: number): string => {
  let str = '';
  for (let i = 0; i < n; i++) str += 'a';
  return str;
};
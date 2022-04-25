

export const SCHEMA = process.env.POSTGRES_SCHEMA || 'public';

// Environment
const environment = process.env.NODE_ENV;
export const isTest = environment === 'test';
export const isCI = environment === 'ci';
export const isDev = environment === 'development';
export const isProd = environment === 'production';

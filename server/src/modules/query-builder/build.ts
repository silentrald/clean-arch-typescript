import knex from 'knex';
import { QueryBuilderConfig } from './types';

const makeQueryBuilder = ({ client, }: QueryBuilderConfig) => {
  return knex({ client, });
};

export default makeQueryBuilder;
import Knex from 'knex';

const knex = Knex({
  client: 'pg'
});

export default knex;

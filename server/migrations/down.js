/**
 * Drops all the table in the database
 */

if (!process.env.CI) {
  require('dotenv').config();
}

const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');

const config = {
  user:       process.env.POSTGRES_USER || 'sample_user',
  password:   process.env.POSTGRES_PASSWORD || 'password',
  host:       process.env.POSTGRES_HOST || 'localhost',
  port:       process.env.POSTGRES_PORT || 5432,
  database:   process.env.POSTGRES_DB || 'sample_db'
};

const client = new Pool(config);

(async () => {
  try {
    const query = await fs.readFile(
      path.join(__dirname, 'sqls', 'down.sql'),
      { encoding: 'utf-8' }
    );
    await client.query(query);
    await client.end();
    console.log('Migration Down Done');
  } catch (err) {
    console.log(err);
    throw err;
  }
})();

import { runCLI } from 'jest';
require('dotenv').config({
  path: './.env.test',
});

import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';

import migrate from 'migrations';
import { makeDb } from 'db';

const watch = chokidar.watch(path.join(__dirname, 'uploads', 'ids'), {
  persistent: true,
});

(async () => {
  const queryUp = migrate('up');
  const queryInsert = migrate('ins');
  const queryDown = migrate('down');
  const db = makeDb();

  await db.query(queryDown);
  await db.query(`DROP SCHEMA IF EXISTS ${process.env.POSTGRES_SCHEMA}`);

  await db.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  await db.query(`CREATE SCHEMA IF NOT EXISTS ${process.env.POSTGRES_SCHEMA};`);
  await db.query(queryUp);
  await db.query(queryInsert);

  watch.on('add', async (file) => {
    await fs.promises.unlink(file);
  });

  try {
    // "test:int": "jest --color --runInBand --detectOpenHandles --testPathPattern=\".spec.ts$\"",
    console.log(`CI Environment: ${!!process.env.CI}`);
    const options: any = {
      config: './jest.config.js',
      watch: false,
      runInBand: true,
      detectOpenHandles: true,
      testRegex: '.spec.ts$',
      colors: true,
      silent: true,
      coverage: true,
      ci: !!process.env.CI,
    };

    if (process.argv.length > 2) {
      options._ = process.argv.slice(2);
    }

    console.log('Starting Tests');
    await runCLI(
      options,
      [ __dirname ]
    );
    console.log('CLI Done');
  } catch (err) {
    console.error('ERROR');
    console.error(err);
  }

  console.log('Teardown Tests');
  await db.query(queryDown);
  await db.query(`DROP SCHEMA ${process.env.POSTGRES_SCHEMA}`);

  try {
    await watch.close();
    await db.close();
  } catch (err) {
    console.log(err);
  }
  console.log('Integration Test Done');
})();

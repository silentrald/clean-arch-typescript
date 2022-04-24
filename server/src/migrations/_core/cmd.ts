require('dotenv').config();

if (process.env.NODE_ENV === 'production') require('module-alias/register');

if (process.argv.length < 2) {
  console.error('Missing command argument (up|ins|del|down)');
  process.exit(1);
}

const cmd = process.argv[2];

const invalidCmd = (cmd: string) => {
  return cmd !== 'up' && cmd !== 'ins' && cmd !== 'del' && cmd !== 'down';
};

if (invalidCmd(cmd)) {
  console.error('Invalid command argument. (up|insert|delete|down) only');
  process.exit(1);
}

import { makeDb } from '@db/_core';
import migrate from '@migrations/_core';

(async () => {
  const db = makeDb();
  const query = migrate(cmd as any);
  await db.query(query);
})()
  .then(() => {
    console.log(`Successful ${cmd.replace(/^\w/, (c) => c.toUpperCase())} Migration`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
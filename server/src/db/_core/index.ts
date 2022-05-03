import { makeDb } from './build';

const db = makeDb({ client: 'pg', });

export default db;
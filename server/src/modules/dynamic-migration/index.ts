import buildMakeDynamicMigration from './build';

const makeDynamicMigration = buildMakeDynamicMigration({
  client: 'pg',
});

export default makeDynamicMigration;
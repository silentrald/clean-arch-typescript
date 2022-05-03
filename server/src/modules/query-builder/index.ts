import makeQueryBuilder from './build';

const qb = makeQueryBuilder({ client: 'pg', });

export default qb;
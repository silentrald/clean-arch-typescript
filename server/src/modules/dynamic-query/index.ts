import buildMakeDynamicQuery from './build';

const makeDynamicQuery = buildMakeDynamicQuery({ client: 'pg', });

export default makeDynamicQuery;
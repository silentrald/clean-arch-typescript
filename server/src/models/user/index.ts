import build from './build';
import schema from './schema';

const validator = require('../validator')(schema);

const makeStudent = build({
  validator
});

export default makeStudent;

import build from './build';
import schema from './schema';

const validator = require('../_validator')(schema);

const makeStudent = build({
  validator
});

export default makeStudent;

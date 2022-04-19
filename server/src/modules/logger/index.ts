import devLogger from './dev';
import prodLogger from './prod';

const logger = process.env.NODE_ENV === 'production' ?
  prodLogger() :
  devLogger();

export default logger;
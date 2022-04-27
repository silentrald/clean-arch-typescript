import devLogger from './dev';
import prodLogger from './prod';

const log = process.env.NODE_ENV === 'production' ?
  prodLogger() :
  devLogger();

const logger = {
  info: (msg: any): void => {
    log.info(msg);
  },

  http: (msg: any): void => {
    log.http(msg);
  },

  error: (msg: any): void => {
    log.error(msg);
  },
};

export default logger;
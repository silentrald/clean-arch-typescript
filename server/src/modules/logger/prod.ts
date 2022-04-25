import {
  transports, format, createLogger, Logger
} from 'winston';
const {
  combine, timestamp, errors, json,
} = format;

const logger = (): Logger => createLogger({
  format: combine(
    timestamp(),
    errors({ stack: true, }),
    json()
  ),
  defaultMeta: { service: 'server', },
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new transports.File({
      filename: 'logs/http.log',
      level: 'http',
    })
  ],
});

export default logger;

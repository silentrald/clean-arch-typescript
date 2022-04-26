import {
  transports, format, createLogger, Logger
} from 'winston';
import 'winston-daily-rotate-file';

const {
  combine, timestamp, errors, json,
} = format;

const errorTransport = new transports.DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  // maxSize: ''
  maxFiles: '3d',
  level: 'error',
});

const httpTransport = new transports.DailyRotateFile({
  filename: 'logs/http-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  // maxSize: ''
  maxFiles: '3d',
  level: 'http',
});

const logger = (): Logger => createLogger({
  format: combine(
    timestamp(),
    errors({ stack: true, }),
    json()
  ),
  defaultMeta: { service: 'server', },
  transports: [
    errorTransport, httpTransport
  ],
});

export default logger;

import { createLogger, format, transports, Logger } from 'winston';
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level,  message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = (): Logger => createLogger({
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  // defaultMeta: { service: 'user-service' },
  transports: [ new transports.Console({ level: 'http' }) ],
});

export default logger;

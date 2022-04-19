import path from 'path';

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({
    path: path.join(path.dirname(__dirname), '.env.test'),
  });
} else {
  require('dotenv').config();
}

if (process.env.NODE_ENV === 'production')
  require('module-alias/register');

// MODULES
import express from 'express';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import cors from 'cors';
import session from 'express-session';
import logger from '@modules/logger';

import getFiles from './helpers/getFiles';

// CONSTANTS
import SESSION_OPT from '@modules/session';

const app = express();

const HOST = process.env.HOST || 'localhost';
const PORT = +(process.env.PORT || 5000);

// MIDDLEWARES
app.use(require('morgan')(process.env.NODE_ENV === 'development' ? 'dev' : 'combined', {
  stream: {
    // write: (message: string, _encoding: string) => {
    write: (message: string) => {
      logger.http(message);
    },
  },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
app.use(session(SESSION_OPT));
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(csrf({
  cookie: true,
}));

// APIS
for (const method of [ 'get', 'post' ]) {
  for (const file of getFiles(
    path.join(__dirname, 'api', method)).map(file => `/${file.slice(0, -3)}`)
  ) {
    const route = `/api${file.replace(/_/g, ':').replace(/\\/g, '/')}`;
    app[method](route.endsWith('/index') ?
      route.slice(0, -6) :
      route, require(`./api/${method}${file}`).default
    );
  }
}

const server = app.listen(PORT, HOST, () => {
  logger.info(`Listening to port ${PORT}`);
});

export default server;
require('dotenv').config();

if (process.env.NODE_ENV === 'production')
  require('module-alias/register');

// MODULES
import express from 'express';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import cors from 'cors';
import logger from 'infrastructure/logger';
import path from 'path';
import session from 'express-session';

import getFiles from './helpers/getFiles';

// CONSTANTS
import SESSION_OPT from './infrastructure/redis/session';

const app = express();

const HOST = process.env.HOST || 'localhost';
const PORT = +(process.env.PORT || 5000);

// MIDDLEWARES
app.use(require('morgan')(process.env.NODE_ENV === 'development' ? 'dev' : 'combined', {
  stream: {
    // write: (message: string, _encoding: string) => {
    write: (message: string) => {
      logger.http(message);
    }
  }
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
app.use(session(SESSION_OPT));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(csrf({ cookie: true }));

// DEBUG
// app.use((req: Request, _res: Response, next: NextFunction): void => {
//     console.log(req.sessionID);
//     next();
// });

// APIS
for (const method of ['get', 'post']) {
  for (const file of getFiles(path.join(__dirname, `api/${method}`)).map(file => `/${file.slice(0, -3)}`)) {
    const route = `/api${file.replace(/_/g, ':').replace(/\\/g, '/')}`;
    app[method](route.endsWith('/index') ? route.slice(0, -6) : route, require(`./api/${method}${file}`).default);
  }
}

// STATIC and UPLOADS
// if (process.env.NODE_ENV === 'development') {
// app.use('/', express.static(path.join(__dirname, 'static')));
// app.use(express.static(path.join(__dirname, 'uploads')));
// }

const server = app.listen(PORT, HOST, () => {
  logger.info(`Listening to port ${PORT}`);
});

export default server;
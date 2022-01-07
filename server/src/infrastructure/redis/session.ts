import redis from './index';
import session, { SessionOptions } from 'express-session';

import connectRedis from 'connect-redis';

const EXPIRES = 1000 * 60 * 20; // 20 Minutes

const RedisStore = connectRedis(session);

const SESSION_OPT: SessionOptions = {
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET || 'super-secret-session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'development',
    sameSite: true,
    maxAge: EXPIRES,
  },
  rolling: true
};

export default SESSION_OPT;
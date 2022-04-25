import { isProd } from '@config';

import redis from '@modules/redis';
import session, { SessionOptions } from 'express-session';
import connectRedis from 'connect-redis';

const EXPIRES = 1000 * 60 * 20; // 20 Minutes

const RedisStore = connectRedis(session);

export const store = new RedisStore({ client: redis, });

const SESSION_OPT: SessionOptions = {
  store,
  secret: process.env.SESSION_SECRET || 'super-secret-session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProd,
    httpOnly: isProd,
    sameSite: true,
    maxAge: EXPIRES,
  },
  rolling: true,
};

export default SESSION_OPT;
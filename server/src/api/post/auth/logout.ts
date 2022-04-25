import logger from '@modules/logger';
import { store } from '@modules/session';
import { adaptEndpoint } from '@modules/express-adapter';

import isAuthMw from '@middlewares/auth/is-auth';

import { ARequest, AResponse } from '@modules/express-adapter/types';

const destroySession = (sessionId: string) => {
  return new Promise((resolve, reject) => {
    store.destroy(sessionId, (err) => {
      err ? reject(err) : resolve(true);
    });
  });
};

const api = async (req: ARequest): Promise<AResponse> => {
  try {
    await destroySession(req.sessionId!);
    return { status: 204, };
  } catch(err) {
    logger.error(err);

    return { status: 500, };
  }
};

const endpoint = adaptEndpoint([ isAuthMw, api ]);
export default endpoint;
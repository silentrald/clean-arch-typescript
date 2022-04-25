import { Request, Response } from 'express';
import { ARequest, AResponse } from './types';

const adaptRequest = (req: Request): ARequest => {
  return {
    body: req.body as Record<string, any>,
    params: req.params as any,
    query: req.query as any,
    headers: req.headers as any,
    csrfToken: (req as any).csrfToken,

    sessionId: req.sessionID,
    session: req.session as any,
  };
};

const constructResponse = (areq: AResponse, res: Response): void => {
  const {
    status, cookies, data, errors,
  } = areq;

  res.status(status);

  if (cookies) {
    for (const key in cookies) {
      res.cookie(key, cookies[key]);
    }
  }

  if (data) {
    res.send(data);
  } else if (errors) {
    res.send({ errors, });
  } else {
    res.send();
  }
};

export const adaptEndpoint = (
  apps: ((ar: ARequest) => (Promise<AResponse | void> | AResponse | void)
)[]) => {
  return async (req: Request, res: Response): Promise<void> => {
    const areq = adaptRequest(req);
    for (const app of apps) {
      const ares = await app(areq);
      if (ares) {
        constructResponse(ares, res);
        return;
      }
    }
    throw new Error('No AResponse returned');
  };
};

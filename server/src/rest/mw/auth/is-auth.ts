import { Request, Response, NextFunction } from 'express';
import '@infrastructure/redis/types';

const isAuthMw = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (!req.session || !req.session.user) {
    return res.status(403).send();
  }

  next();
};

export default isAuthMw;
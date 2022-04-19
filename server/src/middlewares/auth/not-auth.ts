import {
  Request, Response, NextFunction
} from 'express';
import '@modules/session/types';

const notAuthMw = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (req.session && req.session.user) {
    return res.status(403).send();
  }

  next();
};

export default notAuthMw;
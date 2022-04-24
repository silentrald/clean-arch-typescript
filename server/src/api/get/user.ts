import isAuthMw from '@middlewares/auth/is-auth';

import { Request, Response } from 'express';
import '@modules/session/types';

const api = (req: Request, res: Response): Response | void => {
  return res.status(200).send({
    user: req.session!.user,
  });
};

export default [ isAuthMw, api ];
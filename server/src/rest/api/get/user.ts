import isAuthMw from '@mw/auth/is-auth';

import { Request, Response } from 'express';

const api = (req: Request, res: Response): Response | void => {
  return res.status(200).send({});
};

export default [
  isAuthMw,
  api
];
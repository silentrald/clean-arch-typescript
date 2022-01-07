import sampleMw from '@mw/sample';

import { Request, Response } from 'express';

const ctrl = (_req: Request, res: Response): Response | void => {
  return res.status(200).send({});
};

export default [
  sampleMw,
  ctrl
];
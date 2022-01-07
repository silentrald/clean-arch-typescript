import { Request, Response } from 'express';

const api = (_req: Request, res: Response): Response | void => {
  return res.status(200).send({});
};

export default [
  api
];
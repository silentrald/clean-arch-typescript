import { Request, Response } from 'express';

const api = (req: Request, res: Response): Response => {
  return res.status(200)
    .cookie('XSRF-TOKEN', req.csrfToken())
    .send({});
};

export default [
  api
];

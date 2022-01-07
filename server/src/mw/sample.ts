import { Request, Response, NextFunction } from 'express';

const sampleMw = (req: Request, res: Response, next: NextFunction): Response | void => {
  console.log('sample');

  next();
};

export default sampleMw;
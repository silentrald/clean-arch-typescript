import logger from '@modules/logger';

import userList from '@use-cases/user-list';

import notAuthMw from '@middlewares/auth/not-auth';

import { Request, Response } from 'express';
import '@modules/session/types';

import DbError from '@db/_core/error';
import EntityError from '@entities/_core/error';
import UseCaseError from '@use-cases/_core/error';


const api = async (req: Request, res: Response): Promise<Response | void> => {
  const { username, password, } = req.body;

  try {
    const user = await userList.getUserByUsername(username);
    const same = user.comparePassword(password);
    if (!same) {
      return res.status(401).send('Auth Failed');
    }

    req.session.user = {
      id: user.getId()!,
      username: user.getUsername(),
      email: user.getEmail(),
      fname: user.getFname(),
      lname: user.getLname(),
    };

    return res.status(204).send({});
  } catch (err) {
    logger.error(err);

    if (err instanceof EntityError || err instanceof DbError || err instanceof UseCaseError) {
      return res.status(401).send('Auth Failed');
    }

    return res.status(500).send({});
  }
};

export default [ notAuthMw, api ];
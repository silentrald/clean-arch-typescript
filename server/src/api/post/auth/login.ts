import logger from '@modules/logger';
import { adaptEndpoint } from '@modules/express-adapter';

import userList from '@use-cases/user-list';

import notAuthMw from '@middlewares/auth/not-auth';

import { ARequest, AResponse } from '@modules/express-adapter/types';

import { isApplicationError } from '@helpers/error';

const api = async (req: ARequest): Promise<AResponse> => {
  const { username, password, } = req.body;

  try {
    const user = await userList.getUserByUsername(username);
    const same = await user.comparePassword(password);
    if (!same) {
      return {
        status: 401,
        data: 'Auth Failed',
      };
    }

    req.session.user = {
      id: user.getId()!,
      username: user.getUsername(),
      email: user.getEmail(),
      fname: user.getFname(),
      lname: user.getLname(),
    };

    return { status: 204, };
  } catch (err) {
    logger.error(err); // Log this to check for invalid login
    if (isApplicationError(err)) {
      return {
        status: 401,
        data: 'Auth Failed',
      };
    }

    return { status: 500, };
  }
};

const endpoint = adaptEndpoint([
  notAuthMw, api
]);
export default endpoint;
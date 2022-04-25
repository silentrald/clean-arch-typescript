import { ARequest, AResponse } from '@modules/express-adapter/types';

const isAuthMw = (req: ARequest): AResponse | void => {
  if (!req.session || !req.session.user) {
    return {
      status: 403,
      data: 'Forbidden',
    };
  }
};

export default isAuthMw;
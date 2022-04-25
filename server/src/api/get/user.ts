import { adaptEndpoint } from '@modules/express-adapter';
import { ARequest, AResponse } from '@modules/express-adapter/types';

const api = (req: ARequest): AResponse => {
  return {
    status: 200,
    data: req.session.user,
  };
};

const endpoint = adaptEndpoint([ api ]);
export default endpoint;

import { adaptEndpoint } from '@modules/express-adapter';
import { ARequest, AResponse } from '@modules/express-adapter/types';

const api = (req: ARequest): AResponse => {
  const token = req.csrfToken();

  return {
    status: 200,
    cookies: { 'XSRF-TOKEN': token, },
  };
};

const endpoint = adaptEndpoint([ api ]);
export default [ endpoint ];

import { UserSchema } from '@entities/user/types';

import 'express-session';

declare module 'express-session' {
  export interface SessionData {
    user?: UserSchema;
  }
}

export {};
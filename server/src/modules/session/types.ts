import 'express-session';

interface User {
  id: string;
  username: string;
  email: string;
  fname: string;
  lname: string;
}

declare module 'express-session' {
  export interface SessionData {
    user?: User;
  }
}

export {};
import 'express-session';

interface User {
    username: string;
    password?: string;
    email: string;
    fname: string;
    lname: string;
}

declare module 'express-session' {
    interface SessionData {
        user?: User;
    }
}

export {};
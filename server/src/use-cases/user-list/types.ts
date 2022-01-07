import { User } from '@models/user/types';

export interface UserList {
    add: (user: User) => Promise<void>;
    getById: (id: string) => Promise<any>;
    getByUsername: (username: string) => Promise<any>;
    updateById: (id: string, user: User) => Promise<void>;
}
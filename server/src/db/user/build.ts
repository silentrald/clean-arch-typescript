import { makeDbAdapter } from '@db/_core';
import { User, UserSchema } from '@entities/user/types';
import makeDynamicQuery from '@modules/dynamic-query';
import UserDbError from './error';
import {
  UserDb, UserDbClient, UserDbConfig
} from './types';

// CRUD Functionalities
const makeUserDb = ({
  db, validate, table,
}: UserDbConfig<UserSchema>): UserDb => {
  const TABLE = `${table.schema}.${table.name}`;

  const {
    dynamicSelectOne,
    dynamicInsert,
    dynamicDelete,
  } = makeDynamicQuery<User, UserSchema>({
    mapping: {
      id: 'getId',
      username: 'getUsername',
      password: 'getHash',
      email: 'getEmail',
      fname: 'getFname',
      lname: 'getLname',
    },
    table,
  });

  const { dynamicUpdate, } = makeDynamicQuery<User, UserSchema>({
    mapping: {
      id: 'getId',
      username: 'getUsername',
      email: 'getEmail',
      fname: 'getFname',
      lname: 'getLname',
    },
    table,
  });

  const userDbClient: UserDbClient = {
    getById: async (client, id, columns) => {
      const { query, values, } = dynamicSelectOne!('id', id, columns);
      const { rows, } = await client.query<UserSchema>(query, values);

      return rows[0];
    },

    getByUsername: async (client, username, columns) => {
      const { query, values, } = dynamicSelectOne!('username', username, columns);
      const { rows, } = await client.query<UserSchema>(query, values);

      return rows[0];
    },

    getByEmail: async (client, email, columns) => {
      const { query, values, } = dynamicSelectOne!('email', email, columns);
      const { rows, } = await client.query<UserSchema>(query, values);

      return rows[0];
    },

    add: async (client, user) => {
      if (user.getPassword() === undefined && user.getHash() === undefined) {
        throw new UserDbError([ 'invalid_password' ]);
      }

      const { query, values, } = dynamicInsert!(user);
      const { rows, } = await client.query<UserSchema>(query, values);

      return rows[0].id!;
    },

    updateWithoutPassword: async (client, user) => {
      const { query, values, } = dynamicUpdate!(user);
      const { count, } = await client.query<UserSchema>(query, values);
      return count === 1;
    },

    updatePassword: async (client, user) => {
      if (user.getId() === undefined || !validate.id(user.getId()!)) {
        throw new UserDbError([ 'invalid_id' ]);
      }

      if (user.getPassword() === undefined && user.getHash() === undefined) {
        throw new UserDbError([ 'invalid_password' ]);
      }

      // Only supports psql
      const { count, } = await client.query<UserSchema>(`
        UPDATE  ${TABLE}
        SET     password=$1
        WHERE   id=$2;
      `, [
        user.getHash(), user.getId()
      ]);

      return count === 1;
    },

    del: async (client, id) => {
      const { query, values, } = dynamicDelete!(id);
      const { count, } = await client.query<UserSchema>(query, values);
      return count === 1;
    },
  };

  const userDb = makeDbAdapter(db, userDbClient, [ 'getByUsername' ]);
  return Object.freeze(userDb);
};

export default makeUserDb;
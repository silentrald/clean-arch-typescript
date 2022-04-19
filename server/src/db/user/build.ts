import { User, UserSchema } from '@entities/user/types';
import UserDbError from './error';
import {
  UserDb, UserDbClient, UserDbConfig
} from './types';

// CRUD Functionalities
const makeUserDb = ({
  db, validate, dynamicQuery: {
    dynamicSelectOne, dynamicInsert,
    dynamicDelete, dynamicUpdate,
  },
  table, schema,
}: UserDbConfig<User, UserSchema>): UserDb => {
  const TABLE = `${schema}.${table}`;

  const userDbClient: UserDbClient = {
    getById: async (client, id, fields) => {
      const { query, values, } = dynamicSelectOne!('id', id, fields);
      const { rows, } = await client.query<UserSchema>(query, values);

      return rows[0];
    },

    getByUsername: async (client, username, fields) => {
      const { query, values, } = dynamicSelectOne!('username', username, fields);
      const { rows, } = await client.query<UserSchema>(query, values);

      return rows[0];
    },

    getByEmail: async (client, email, fields) => {
      const { query, values, } = dynamicSelectOne!('email', email, fields);
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
      `, [ user.getHash(), user.getId() ]);

      return count === 1;
    },

    del: async (client, id) => {
      const { query, values, } = dynamicDelete!(id);
      const { count, } = await client.query<UserSchema>(query, values);
      return count === 1;
    },
  };

  return Object.freeze({
    getById: (id, fields) => userDbClient.getById(db, id, fields),
    getByUsername: (username, fields) => userDbClient.getById(db, username, fields),
    getByEmail: (email, fields) => userDbClient.getById(db, email, fields),
    add: (user) => userDbClient.add(db, user),
    updateWithoutPassword: (user) => userDbClient.updateWithoutPassword(db, user),
    updatePassword: (user) => userDbClient.updatePassword(db, user),
    del: (id) => userDbClient.del(db, id),

    transaction: (client) => {
      return Object.freeze({
        add: (user) => userDbClient.add(client, user),
        updateWithoutPassword: (user) => userDbClient.updateWithoutPassword(client, user),
        updatePassword: (user) => userDbClient.updateWithoutPassword(client, user),
        del: (id) => userDbClient.del(client, id),
      });
    },
  });
};

export default makeUserDb;
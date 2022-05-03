import { makeDbAdapter } from '@db/_core/build';
import { UserSchema } from '@entities/user/types';
import UserDbError, { userDbErrors } from './error';
import {
  UserDb, UserDbClient, UserDbConfig
} from './types';

const makeUserDb = ({
  db, validate, table,
}: UserDbConfig<UserSchema>): UserDb => {
  const TABLE = `${table.schema}.${table.name}`;

  // Only use query builder to build queries that aren't statically built like joining other tables
  // Reasoning: The queries only support postgres queries anyway so it can't be standardized
  //            If another database(mysql, nosql) will be used, the data access part will be editted
  // Only supports postgres query
  const insertQuery = `
    INSERT INTO ${TABLE} (
      username, password, email,
      fname, lname
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;

  // SELECTS
  const selectQueryById = `
    SELECT  *
    FROM    ${TABLE}
    WHERE   id=$1
    LIMIT   1;
  `;

  const selectQueryByUsername = `
    SELECT  *
    FROM    ${TABLE}
    WHERE   username=$1
    LIMIT   1;
  `;

  const selectQueryByEmail = `
    SELECT  *
    FROM    ${TABLE}
    WHERE   email=$1
    LIMIT   1;
  `;

  // UPDATES
  const updateInfoQueryById = `
    UPDATE  ${TABLE}
    SET     fname=$2,
            lname=$3
    WHERE   id=$1;
  `;

  const updatePasswordQueryById = `
    UPDATE  ${TABLE}
    SET     password=$2
    WHERE   id=$1;
  `;

  // DELETES
  const removeQueryById = `DELETE FROM ${TABLE} WHERE id=$1;`;

  const userDbClient: UserDbClient = {
    add: async (client, user) => {
      if (!user.getHash()) {
        throw new UserDbError([ userDbErrors.invalidPassword ]);
      }

      const { rows, } = await client.query<UserSchema>(insertQuery, [
        user.getUsername(),
        user.getHash(),
        user.getEmail(),
        user.getFname(),
        user.getLname()
      ]);

      return rows[0].id!;
    },

    getById: async (client, id) => {
      if (!validate.id(id)) {
        throw new UserDbError([ userDbErrors.invalidId ]);
      }

      const { rows, count, } = await client.query<UserSchema>(selectQueryById, [ id ]);

      if (count < 1) {
        throw new UserDbError([ userDbErrors.notFound ]);
      }

      return rows[0];
    },

    getByUsername: async (client, username) => {
      const { rows, count, } = await client.query<UserSchema>(selectQueryByUsername, [ username ]);

      if (count < 1) {
        throw new UserDbError([ userDbErrors.notFound ]);
      }

      return rows[0];
    },

    getByEmail: async (client, email) => {
      const { rows, count, } = await client.query<UserSchema>(selectQueryByEmail, [ email ]);

      if (count < 1) {
        throw new UserDbError([ userDbErrors.notFound ]);
      }

      return rows[0];
    },

    updateInfoById: async (client, user) => {
      if (!user.getId()) {
        throw new UserDbError([ userDbErrors.missingId ]);
      }

      const { count, } = await client.query<UserSchema>(updateInfoQueryById, [
        user.getId(),
        user.getFname(),
        user.getLname()
      ]);
      return count === 1;
    },

    updatePasswordById: async (client, user) => {
      if (!user.getId()) {
        throw new UserDbError([ userDbErrors.missingId ]);
      }

      if (!user.getHash()) {
        throw new UserDbError([ userDbErrors.missingPassword ]);
      }

      const { count, } = await client.query<UserSchema>(updatePasswordQueryById, [
        user.getId(), user.getHash()
      ]);

      return count === 1;
    },

    removeById: async (client, id) => {
      if (!validate.id(id)) {
        throw new UserDbError([ userDbErrors.invalidId ]);
      }

      const { count, } = await client.query<UserSchema>(removeQueryById, [ id ]);
      return count === 1;
    },
  };

  const userDb = makeDbAdapter(db, userDbClient);
  return Object.freeze(userDb);
};

export default makeUserDb;
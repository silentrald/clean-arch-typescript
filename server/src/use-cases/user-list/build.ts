import DB from '@infrastructure/db/types';
import { UserList } from './types';

const makeUserList = ({
  db
}: {
  db: DB
}): UserList => {
  return Object.freeze({
    add: async (user) => {
      await db.query(`
        INSERT INTO users (
          username,
          password,
          email,
          fname,
          lname
        )
        VALUES($1, $2, $3, $4, $5)
      `, [
        user.getUsername(),
        user.getPassword(),
        user.getEmail(),
        user.getFname(),
        user.getLname()
      ]);
    },

    getById: async (id) => {
      const {
        rows: users
      } = await db.query(`
        SELECT  *
        FROM    users
        WHERE   id = $1;
      `, [ id ]);

      return users[0];
    },

    getByUsername: async (username) => {
      const {
        rows: users
      } = await db.query(`
        SELECT  *
        FROM    users
        WHERE   username = $1;
      `, [ username ]);

      return users[0];
    },

    updateById: async (id, user) => {
      await db.query(`
        UPDATE  users
        SET     username = $1,
                email = $2,
                fname = $3,
                lname = $4
        WHERE   id = $5;
      `, [
        user.getUsername(),
        user.getEmail(),
        user.getFname(),
        user.getLname(),
        id
      ]);
    },
  });
};

export default makeUserList;

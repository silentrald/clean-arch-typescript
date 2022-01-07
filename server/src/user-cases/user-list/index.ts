import { User } from '@models/user/intf';

const makeUserList = ({
  db, hashFunction
}) => {
  return Object.freeze({
    add: async (user: User): Promise<void> => {
      const hash = await hashFunction(user.getPassword());

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
        hash,
        user.getEmail(),
        user.getFname(),
        user.getLname()
      ]);
    },

    getById: async (id: string): Promise<any> => {
      const {
        rows: users
      } = await db.query(`
        SELECT  *
        FROM    users
        WHERE   id = $1;
      `, [ id ]);

      return users[0];
    },

    getByUsername: async (username: string): Promise<any> => {
      const {
        rows: users
      } = await db.query(`
        SELECT  *
        FROM    users
        WHERE   username = $1;
      `, [ username ]);

      return users[0];
    },

    updateById: async (id: string, user: User): Promise<void> => {
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

    removeById: async (id: string): Promise<void> => {
      await db.query(`
        DELETE  users
        WHERE   id = $1;
      `, [ id ]);
    },
  });
};

export default makeUserList;

import makeUser from './index';
import { NIL } from 'uuid';
import { generateTestString } from '@helpers/string';
import UserError from './error';

const schema = {
  id: NIL,
  username: 'username',
  password: 'password',
  email: 'sample@email.com',
  fname: 'F',
  lname: 'L',
};

describe('User Test', () => {
  describe('Valid user creation', () => {
    test('All properties are provided (min)', () => {
      const user = makeUser({ ...schema, });

      expect(user.getId()).toEqual(schema.id);
      expect(user.getUsername()).toEqual(schema.username);
      expect(user.getPassword()).toEqual(schema.password);
      expect(user.getEmail()).toEqual(schema.email);
      expect(user.getFname()).toEqual(schema.fname);
      expect(user.getLname()).toEqual(schema.lname);
    });

    test('All properties are provided (max)', () => {
      const s = {
        id: NIL,
        username: generateTestString(50),
        password: generateTestString(50),
        email: 'sample@email.com',
        fname: generateTestString(50),
        lname: generateTestString(50),
      };
      const user = makeUser(s);

      expect(user.getUsername()).toEqual(s.username);
      expect(user.getPassword()).toEqual(s.password);
      expect(user.getFname()).toEqual(s.fname);
      expect(user.getLname()).toEqual(s.lname);
    });

    test('No Id or Password provided', () => {
      const s = {
        username: 'username',
        email: 'sample@email.com',
        fname: 'F',
        lname: 'L',
      };

      const user = makeUser(s);

      expect(user.getId()).toBeFalsy();
      expect(user.getPassword()).toBeFalsy();
    });
  });

  describe('Valid method calls', () => {
    test('Hash and Compare Function', () => {
      const user = makeUser({ ...schema, });

      const hash = user.getHash();
      expect(user.getHash()).toEqual(hash);

      expect(user.comparePassword(schema.password)).toBeTruthy();
    });

    test('Pass to Hash Function', () => {
      const user = makeUser({ ...schema, });

      expect(user.getPassword()).toEqual(schema.password);
      user.passToHash();
      expect(user.getPassword()).toBeFalsy();
      expect(user.getHash()).toEqual(schema.password);
    });

    test('Remove Password Function', () => {
      const user = makeUser({ ...schema, });

      expect(user.getPassword()).toEqual(schema.password);
      user.removePassword();
      expect(user.getPassword()).toBeFalsy();
      expect(user.getHash()).toBeFalsy();
    });
  });

  describe('Invalid user creation', () => {
    test('All fields are empty', () => {
      try {
        makeUser({} as any);
      } catch (err) {
        if (!(err instanceof UserError)) {
          throw err;
        }

        expect(err.errors).toEqual(expect.arrayContaining([
          expect.stringMatching('(username).*(req)'),
          expect.stringMatching('(email).*(req)'),
          expect.stringMatching('(fname).*(req)'),
          expect.stringMatching('(lname).*(req)')
        ]));
      }
    });

    test('Invalid types', () => {
      try {
        makeUser({
          id: 0,
          username: 0,
          password: 0,
          email: 0,
          fname: 0,
          lname: 0,
        } as any);
      } catch (err) {
        if (!(err instanceof UserError)) {
          throw err;
        }

        expect(err.errors).toEqual(expect.arrayContaining([
          expect.stringMatching('(id).*(type)'),
          expect.stringMatching('(username).*(type)'),
          expect.stringMatching('(password).*(type)'),
          expect.stringMatching('(email).*(type)'),
          expect.stringMatching('(fname).*(type)'),
          expect.stringMatching('(lname).*(type)')
        ]));
      }
    });

    test('Minimum size', () => {
      try {
        makeUser({
          id: NIL,
          username: generateTestString(7),
          password: generateTestString(7),
          email: schema.email,
          fname: '',
          lname: '',
        } as any);
      } catch (err) {
        if (!(err instanceof UserError)) {
          throw err;
        }

        expect(err.errors).toEqual(expect.arrayContaining([
          expect.stringMatching('(username).*(min)'),
          expect.stringMatching('(password).*(min)'),
          expect.stringMatching('(fname).*(min)'),
          expect.stringMatching('(lname).*(min)')
        ]));
      }
    });

    test('Maximum size', () => {
      try {
        makeUser({
          id: NIL,
          username: generateTestString(51),
          password: generateTestString(61),
          email: schema.email,
          fname: generateTestString(51),
          lname: generateTestString(51),
        } as any);
      } catch (err) {
        if (!(err instanceof UserError)) {
          throw err;
        }

        expect(err.errors).toEqual(expect.arrayContaining([
          expect.stringMatching('(username).*(max)'),
          expect.stringMatching('(password).*(max)'),
          expect.stringMatching('(fname).*(max)'),
          expect.stringMatching('(lname).*(max)')
        ]));
      }
    });

    test('Invalid format', () => {
      try {
        makeUser({
          id: 'asdf',
          username: 'asdfasdf',
          password: 'asdfasdf',
          email: 'asdf',
          fname: 'asdf',
          lname: 'asdf',
        } as any);
      } catch (err) {
        if (!(err instanceof UserError)) {
          throw err;
        }

        expect(err.errors).toEqual(expect.arrayContaining([
          expect.stringMatching('(id).*(fmt)'), expect.stringMatching('(email).*(fmt)')
        ]));
      }
    });
  });

  describe('Invalid method calls', () => {
    test('Pass to Hash Function', () => {
      const s = { ...schema, } as any;
      delete s.password;
      const user = makeUser(s);

      try {
        user.passToHash();
      } catch (err) {
        if (!(err instanceof UserError)) throw err;

        expect(err.errors[0]).toEqual('no_password');
      }
    });
  });
});
require('dotenv').config();

jest.mock('../../../src/logger', () => {
  return {
    error: jest.fn(),
    http: jest.fn(),
    info: jest.fn()
  };
});

import request from 'supertest';
import server from '../../../app';
import db from '../../../infrastructure/db';
import redis from '../../../infrastructure/redis';

// Constants
const user = {
  username: 'username',
  password: 'password'
};

// Variables

// Before start up
// beforeAll(async () => {
//   const req = await request(server)
//     .get('/api/csrf')
  
//   console.log(req.header['set-cookie']);
//   cookie = ;
//   console.log(cookie);
// });

describe('POST', () => {
  describe('auth/', () => {
    describe('login', () => {
      let csrf: any, token: any;
      beforeAll(async () => {
        const res = await request(server).get('/api/csrf');
        const cookie = res.headers['set-cookie'];
        csrf = cookie[0];
        token = cookie[1].split('=')[1].split(';')[0];
      });
      
      test('GOOD: User can login', async () => {
        const res = await request(server)
          .post(`${URL}/login`)
          .set('Cookie', csrf)
          .set('XSRF-Token', token)
          .send(user);
        
        expect(res.statusCode).toEqual(200);
      });

      test('BAD: Invalid user credentials', async () => {
        const { statusCode, body } = await request(server)
          .post(`${URL}/login`)
          .set('Cookie', csrf)
          .set('XSRF-Token', token)
          .send({
            username: 'dummy',
            password: 'password'
          });
        
        expect(statusCode).toEqual(403);
        expect(body).toEqual({});
      });

      describe('BAD: Invalid username', () => {
        test('> Underfined', async () => {
          const { statusCode, body } = await request(server)
            .post(`${URL}/login`)
            .set('Cookie', csrf)
            .set('XSRF-Token', token)
            .send({
              password: 'password'
            });
        
          expect(statusCode).toEqual(403);
          expect(body).toEqual({});
        });

        test('> Empty', async () => {
          const { statusCode, body } = await request(server)
            .post(`${URL}/login`)
            .set('Cookie', csrf)
            .set('XSRF-Token', token)
            .send({
              username: '',
              password: 'password'
            });
        
          expect(statusCode).toEqual(403);
          expect(body).toEqual({});
        });

        test('> Type', async () => {
          const { statusCode, body } = await request(server)
            .post(`${URL}/login`)
            .set('Cookie', csrf)
            .set('XSRF-Token', token)
            .send({
              username: 100,
              password: 'password'
            });
        
          expect(statusCode).toEqual(403);
          expect(body).toEqual({});
        });
      });

      // describe('BAD: Invalid password', () => {
      //   test('> Underfined', async () => {
      //     const { statusCode, body } = await request(server)
      //       .post(`${URL}/login`)
      //       .set('Cookie', csrf)
      //       .set('XSRF-Token', token)
      //       .send({
      //         username: 'usg'
      //       });
        
      //     expect(statusCode).toEqual(403);
      //     expect(body).toEqual({});
      //   });

      //   test('> Empty', async () => {
      //     const { statusCode, body } = await request(server)
      //       .post(`${URL}/login`)
      //       .set('Cookie', csrf)
      //       .set('XSRF-Token', token)
      //       .send({
      //         username: 'usg',
      //         password: ''
      //       });
        
      //     expect(statusCode).toEqual(403);
      //     expect(body).toEqual({});
      //   });

      //   test('> Type', async () => {
      //     const { statusCode, body } = await request(server)
      //       .post(`${URL}/login`)
      //       .set('Cookie', csrf)
      //       .set('XSRF-Token', token)
      //       .send({
      //         username: 'usg',
      //         password: 100
      //       });
        
      //     expect(statusCode).toEqual(403);
      //     expect(body).toEqual({});
      //   });
      // });
    });
  });
});

afterAll(() => {
  server.close();
  db.end();
  redis.disconnect();
});
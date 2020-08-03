import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../../src/building-blocks/modules/auth/auth.module';
import {
  populateDatabase,
  cleanDatabase,
} from '../../src/building-blocks/modules/auth/tests/helpers/auth.db.helpers';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  const user = {
    username: 'username1',
    firstName: 'john',
    lastName: 'doe',
    avatarUrl: 'path/to/avatar',
    password: 'password',
  };
  let credentials;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await Promise.all([app.init(), populateDatabase([user])]);
  });

  beforeEach(async () => {
    credentials = { username: user.username, password: user.password };
  });

  afterAll(async () => {
    cleanDatabase();
    await app.close();
  });

  const login = () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials);
  };

  describe('/auth/login', () => {
    it('should return auth token if correct user credentials were passed', async () => {
      const { body } = await login();

      expect(body).toHaveProperty('accessToken');
      expect(body.accessToken).toBeDefined();
    });

    it('should throw 401 if user was not found', async () => {
      credentials.username = 'username-not-in-db';

      const { status } = await login();
      expect(status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 if password didnt match', async () => {
      credentials.password = 'password-that-doesnt-match';

      const { status } = await login();
      expect(status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});

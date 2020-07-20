import { INestApplication, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { FakeDatabase } from './../../src/database/database.fake';
import { UserDto } from '../../src/modules/users/dtos/user.dto';
import { UsersService } from '../../src/modules/users/services/users.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  const user: UserDto = {
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
    usersService = app.get<UsersService>(UsersService);
    await app.init();
  });

  beforeEach(async () => {
    await populateDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    cleanDatabase();
  });

  const populateDatabase = () => {
    return usersService.createUser(user);
  };

  const cleanDatabase = () => {
    const users = FakeDatabase.findAll();
    for (const user of users) {
      FakeDatabase.deleteUser(user.id);
    }
  };

  beforeEach(() => {
    credentials = { username: user.username, password: user.password };
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

  describe('/profile', () => {
    let authToken;

    const profile = () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', 'bearer ' + authToken);
    };

    beforeEach(() => {
      authToken = null;
    });

    it('should return user data if proper auth token was passed', async () => {
      const { body } = await login();
      authToken = body.accessToken;

      const res = await profile();

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveProperty('username', user.username);
    });

    it('should return 401 if no token was passed', async () => {
      const { status } = await profile();

      expect(status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 if invalid token was passed', async () => {
      authToken = 'sdasdadadsad';
      const { status } = await profile();

      expect(status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});

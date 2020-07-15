import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { UserDto } from './../src/users/dtos/user.dto';
import { FakeDatabase } from '../src/database/database.fake';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const apiEndpoint = '/users';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    populateDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    cleanDatabase();
  });

  const populateDatabase = () => {
    const users: UserDto[] = [
      { username: 'user1', password: 'password1' },
      { username: 'user2', password: 'password2' },
    ];

    for (const user of users) {
      FakeDatabase.createUser(user);
    }
  };

  const cleanDatabase = () => {
    const users = FakeDatabase.findAll();
    for (const user of users) {
      FakeDatabase.deleteUser(user.id);
    }
  };

  describe('/ (GET)', () => {
    it('should return all users', () => {
      return request(app.getHttpServer())
        .get(apiEndpoint)
        .expect(({ body }) => {
          expect(body.length).toBe(2);
        });
    });
  });

  describe('/ (POST)', () => {
    const user: UserDto = { username: 'username42', password: 'password123' };

    it('should return 201 if proper user payload was provided', async () => {
      const res = await request(app.getHttpServer())
        .post(apiEndpoint)
        .send(user);

      expect(res.status).toBe(HttpStatus.CREATED);
    });

    it('should create a new user in database', async () => {
      const usersBeforeCall = FakeDatabase.findAll();

      await request(app.getHttpServer())
        .post(apiEndpoint)
        .send(user);

      const usersAfterCall = FakeDatabase.findAll();
      return expect(usersAfterCall.length - usersBeforeCall.length).toBe(1);
    });
  });

  describe('/:id (GET)', () => {
    it('should return an user if valid id is passed', () => {
      const id = '1';

      return request(app.getHttpServer())
        .get(`${apiEndpoint}/${id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveProperty('id', id);
        });
    });

    it('should return an existing user from database', () => {
      const id = '1';
      const userFromDatabase = FakeDatabase.findById(id);

      return request(app.getHttpServer())
        .get(`${apiEndpoint}/${id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveProperty('id', userFromDatabase.id);
          expect(body).toHaveProperty('username', userFromDatabase.username);
        });
    });

    it('should return 404 if user was not found', () => {
      const id = '42';

      return request(app.getHttpServer())
        .get(`${apiEndpoint}/${id}`)
        .expect(404);
    });
  });

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });
});

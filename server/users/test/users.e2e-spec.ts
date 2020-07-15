import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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

  describe('/:id', () => {
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

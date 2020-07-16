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
    it('should return all users', async () => {
      const res = await request(app.getHttpServer()).get(apiEndpoint);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.length).toBe(2);
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
    it('should return an user if valid id is passed', async () => {
      const userFromDatabase = FakeDatabase.findAll()[0];

      const res = await request(app.getHttpServer()).get(
        `${apiEndpoint}/${userFromDatabase.id}`,
      );

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveProperty('id', userFromDatabase.id);
    });

    it('should return an existing user from database', async () => {
      const userFromDatabase = FakeDatabase.findAll()[0];

      const res = await request(app.getHttpServer()).get(
        `${apiEndpoint}/${userFromDatabase.id}`,
      );

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveProperty('id', userFromDatabase.id);
      expect(res.body).toHaveProperty('username', userFromDatabase.username);
    });

    it('should return 404 if user was not found', async () => {
      const id = '42';

      const res = await request(app.getHttpServer()).get(
        `${apiEndpoint}/${id}`,
      );

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('/:id (PUT)', () => {
    it('should return 200 if proper user payload was passed', async () => {
      const userFromDatabase = FakeDatabase.findAll()[0];
      userFromDatabase.username = 'different-username';

      const res = await request(app.getHttpServer()).put(
        `${apiEndpoint}/${userFromDatabase.id}`,
      );

      expect(res.status).toBe(HttpStatus.OK);
    });

    it('should update an user if proper user payload was passed', async () => {
      const userFromDatabase = FakeDatabase.findAll()[0];
      userFromDatabase.username = 'different-username';

      await request(app.getHttpServer()).put(
        `${apiEndpoint}/${userFromDatabase.id}`,
      );
      const updatedUserFromDatabase = FakeDatabase.findById(
        userFromDatabase.id,
      );

      expect(updatedUserFromDatabase).toHaveProperty(
        'username',
        updatedUserFromDatabase.username,
      );
    });

    it('should NOT change database records if user was not found', async () => {
      const usersBeforeCall = FakeDatabase.findAll();
      const userFromDatabase = usersBeforeCall[0];
      userFromDatabase.username = 'different-username';
      const id = '42';

      const res = await request(app.getHttpServer())
        .put(`${apiEndpoint}/${id}`)
        .send(userFromDatabase);

      const usersAfterCall = FakeDatabase.findAll();

      expect(res.status).toBe(HttpStatus.OK);
      expectUsersToBeTheSame(usersBeforeCall, usersAfterCall);
    });

    const expectUsersToBeTheSame = (expected: UserDto[], actual: UserDto[]) => {
      expect(expected.length).toBe(actual.length);

      for (const expectedUser of expected) {
        for (const actualUser of actual) {
          if (expectedUser.id === actualUser.id) {
            expect(actualUser).toHaveProperty(
              'username',
              expectedUser.username,
            );
            expect(actualUser).toHaveProperty(
              'password',
              expectedUser.password,
            );
          }
        }
      }
    };
  });

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });
});

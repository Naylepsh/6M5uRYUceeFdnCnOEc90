import {
  populateDatabase,
  cleanDatabase,
} from '../../src/modules/profile/tests/helpers/tests.db.helpers';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ProfileModule } from '../../src/modules/profile/profile.module';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { AuthModule } from '../../src/building-blocks/modules/auth/auth.module';

describe('Profile Controller (e2e)', () => {
  let app: INestApplication;
  const sampleProfile = {
    id: '1',
    username: 'john the user',
    password: 'password',
    firstName: 'john',
    lastName: 'doe',
    avatarUrl: 'path/to/avatar',
  };
  const credentials = {
    username: sampleProfile.username,
    password: sampleProfile.password,
  };
  let authToken: string;

  beforeAll(async () => {
    await loadApp();
  });

  const loadApp = async () => {
    const module = await loadDependencies();
    app = module.createNestApplication();
    await app.init();
  };

  const loadDependencies = async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProfileModule, AuthModule],
    }).compile();

    return moduleRef;
  };

  beforeEach(async () => {
    await populateDatabase([sampleProfile]);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    cleanDatabase();
  });

  describe('/profile (GET)', () => {
    it('should return a profile if valid token was passed', async () => {
      const { body } = await login();
      authToken = body.accessToken;

      const { status } = await getProfile();

      expect(status).toBe(HttpStatus.OK);
    });

    it('should return 401 if invalid token was passed', async () => {
      authToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      const { status } = await getProfile();

      expect(status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 if token was not passed', async () => {
      authToken = null;

      const { status } = await getProfile();

      expect(status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return 404 if valid token was passed but the profile got deleted', async () => {
      const { body } = await login();
      authToken = body.accessToken;

      cleanDatabase();
      const { status } = await getProfile();

      expect(status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  const getProfile = () => {
    return request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', 'bearer ' + authToken);
  };

  const login = () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials);
  };
});

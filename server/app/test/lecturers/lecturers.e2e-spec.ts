import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { LecturerRepository } from '../../src/repositories/lecturer.repository';

describe('LecturersController (e2e)', () => {
  let app: INestApplication;
  const apiEndpoint = '/lecturers';
  let lecturerRepository: LecturerRepository;
  let sampleLecturer;
  let lecturerId: string;

  beforeAll(async () => {
    await loadApp();
  });

  const loadApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    lecturerRepository = new LecturerRepository();
  };

  beforeEach(async () => {
    await cleanDatabase();
    loadSampleLecturer();
  });

  const loadSampleLecturer = () => {
    sampleLecturer = {
      firstName: 'john',
      lastName: 'doe',
      email: 'example@mail.com',
      phoneNumber: '123456789',
      groups: [],
    };
  };

  const cleanDatabase = async () => {
    const lecturers = await lecturerRepository.findAll();
    for (const lecturer of lecturers) {
      await lecturerRepository.delete(lecturer.id);
    }
  };

  afterAll(async () => {
    await app.close();
  });

  describe(`${apiEndpoint} (GET)`, () => {
    beforeEach(async () => {
      await populateDatabase();
    });

    it('should return 200', async () => {
      const { status } = await getLecturers();

      expect(status).toBe(HttpStatus.OK);
    });

    it('should return all lecturers', async () => {
      const { body } = await getLecturers();

      expect(body.length).toBe(1);
    });

    const getLecturers = () => {
      return request(app.getHttpServer()).get(apiEndpoint);
    };
  });

  describe(`${apiEndpoint} (POST)`, () => {
    describe('if valid data was passed', () => {
      it('should return 201', async () => {
        const { status } = await createLecturer();

        expect(status).toBe(HttpStatus.CREATED);
      });

      it('should return lecturer', async () => {
        const { body } = await createLecturer();

        expect(body).toHaveProperty('id');
      });
    });

    const createLecturer = () => {
      return request(app.getHttpServer())
        .post(apiEndpoint)
        .send(sampleLecturer);
    };
  });

  describe(`${apiEndpoint}/:id (GET)`, () => {
    describe('if lecturer exists in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await getLecturer();

        expect(status).toBe(HttpStatus.OK);
      });

      it('should return lecturer', async () => {
        const { body } = await getLecturer();

        expect(body).toHaveProperty('id', lecturerId);
        expect(body).toHaveProperty('firstName', sampleLecturer.firstName);
        expect(body).toHaveProperty('lastName', sampleLecturer.lastName);
        expect(body).toHaveProperty('email', sampleLecturer.email);
        expect(body).toHaveProperty('phoneNumber', sampleLecturer.phoneNumber);
      });
    });
  });

  const getLecturer = () => {
    return request(app.getHttpServer()).get(`${apiEndpoint}/${lecturerId}`);
  };

  const createGroup = () => {
    const group = {};
    return request(app.getHttpServer())
      .post('/groups')
      .send(group);
  };

  const populateDatabase = async () => {
    // really dumb way to populate
    // update it if you find something better pls
    const lecturer = await lecturerRepository.create(sampleLecturer);
    lecturerId = lecturer.id;
  };
});

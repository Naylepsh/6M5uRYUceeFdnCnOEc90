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

    const getLecturers = async () => {
      return request(app.getHttpServer()).get(apiEndpoint);
    };
  });

  const populateDatabase = async () => {
    // really dumb way to populate
    // update it if you find something better pls
    const lecturer = await lecturerRepository.create(sampleLecturer);
    lecturerId = lecturer.id;
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { LecturerRepository } from '../../src/repositories/lecturer.repository';
import { v4 as uuidv4 } from 'uuid';
import { GroupRepository } from '../../src/repositories/group.repository';
import { getConnection } from 'typeorm';

describe('LecturersController (e2e)', () => {
  let app: INestApplication;
  const apiEndpoint = '/lecturers';
  let lecturerRepository: LecturerRepository;
  let groupRepository: GroupRepository;
  let sampleLecturer;
  let lecturerId: string;

  beforeAll(async () => {
    await loadApp();
    loadRepositories();
  });

  const loadApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  };

  const loadRepositories = () => {
    lecturerRepository = new LecturerRepository();
    groupRepository = new GroupRepository();
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

  const cleanDatabase = () => {
    return getConnection().synchronize(true);
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

      it('should allow lecturer creation with groups initialized', async () => {
        const group = await createGroup();
        loadSampleLecturer();
        sampleLecturer.groups = [group.id];

        const { body } = await createLecturer();

        expect(body).toHaveProperty('groups');
        expect(body.groups.length).toBe(1);
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

    describe('if lecturer does not exist in database', () => {
      it('should return 404', async () => {
        lecturerId = uuidv4();

        const { status } = await getLecturer();

        expect(status).toBe(404);
      });
    });

    describe('if id is not valid', () => {
      it('should return 400', async () => {
        lecturerId = '1';

        const { status } = await getLecturer();

        expect(status).toBe(400);
      });
    });
  });

  describe(`${apiEndpoint}/:id (DELETE)`, () => {
    describe('if lecturer exists in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await deleteLecturer();

        expect(status).toBe(200);
      });

      it('should remove lecturer from database', async () => {
        await deleteLecturer();

        const lecturer = await lecturerRepository.findById(lecturerId);
        expect(lecturer).toBeNull();
      });

      it('should remove only the lecturer from database', async () => {
        const lecturersBeforeDeletion = await lecturerRepository.findAll();
        await deleteLecturer();
        const lecturersAfterDeletion = await lecturerRepository.findAll();

        expect(lecturersBeforeDeletion.length).toBe(
          lecturersAfterDeletion.length + 1,
        );
      });
    });

    describe('if lecturer does not exist in database', () => {
      it('should return 404', async () => {
        const { status } = await deleteLecturer();

        expect(status).toBe(404);
      });

      it('shouldnt remove anything', async () => {
        const lecturersBeforeDeletion = await lecturerRepository.findAll();
        await deleteLecturer();
        const lecturersAfterDeletion = await lecturerRepository.findAll();

        expect(lecturersBeforeDeletion.length).toBe(
          lecturersAfterDeletion.length,
        );
      });
    });

    describe('if id is not valid', () => {
      it('should return 400', async () => {
        lecturerId = '1';
        const { status } = await deleteLecturer();

        expect(status).toBe(400);
      });
    });

    const deleteLecturer = () => {
      return request(app.getHttpServer()).delete(
        `${apiEndpoint}/${lecturerId}`,
      );
    };
  });

  const getLecturer = () => {
    return request(app.getHttpServer()).get(`${apiEndpoint}/${lecturerId}`);
  };

  const createGroup = () => {
    const group = {
      day: 'monday',
      hour: '16:00',
      room: '371',
      address: 'some st',
      lecturers: [],
      students: [],
      startDate: getCurrentDate(),
      endDate: getCurrentDate(),
    };
    return groupRepository.create(group);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const date = `${today.getFullYear()}-${today.getMonth() +
      1}-${today.getDate()}`;
    return date;
  };

  const populateDatabase = async () => {
    const lecturer = await lecturerRepository.create(sampleLecturer);
    lecturerId = lecturer.id;
  };
});

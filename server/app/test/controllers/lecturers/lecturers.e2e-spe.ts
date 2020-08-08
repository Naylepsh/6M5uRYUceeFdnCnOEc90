import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { LecturerRepository } from '../../../src/repositories/lecturer.repository';
import {
  createSampleLecturer,
  createSampleGroup,
} from '../../helpers/models.helpers';
import { createTestApp } from '../../helpers/app.helper';
import { DatabaseUtility } from '../../helpers/database.helper';
import { getConnection } from 'typeorm';

describe('LecturersController (e2e)', () => {
  let app: INestApplication;
  const apiEndpoint = '/lecturers';
  let lecturerRepository: LecturerRepository;
  let sampleLecturer;
  let lecturerId: string;
  let databaseUtility: DatabaseUtility;

  beforeAll(async () => {
    app = await createTestApp();
    loadRepositories();
    databaseUtility = await DatabaseUtility.init();
  });

  const loadRepositories = () => {
    lecturerRepository = new LecturerRepository(getConnection());
  };

  beforeEach(() => {
    loadSampleLecturer();
  });

  afterEach(async () => {
    await databaseUtility.cleanDatabase();
  });

  const loadSampleLecturer = () => {
    sampleLecturer = createSampleLecturer();
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

    describe('if invalid data was passed', () => {
      it('should return 400 if first name was not passed', async () => {
        delete sampleLecturer.firstName;

        const { status } = await createLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if last name was not passed', async () => {
        delete sampleLecturer.lastName;

        const { status } = await createLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if phone number was not passed', async () => {
        delete sampleLecturer.phoneNumber;

        const { status } = await createLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if email was not passed', async () => {
        delete sampleLecturer.email;

        const { status } = await createLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid email was passed', async () => {
        sampleLecturer.email = 'abc';

        const { status } = await createLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if groups were not passed', async () => {
        delete sampleLecturer.groups;

        const { status } = await createLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid group ids were passed', async () => {
        sampleLecturer.groups = ['1', '2'];

        const { status } = await createLecturer();

        expect(status).toBe(400);
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

  describe(`${apiEndpoint}/:id (PUT)`, () => {
    let lecturerDataToUpdate;

    beforeEach(() => {
      loadUpdateData();
    });

    const loadUpdateData = () => {
      lecturerDataToUpdate = createSampleLecturer();
    };

    describe('if lecturer exist in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await updateLecturer();

        expect(status).toBe(200);
      });

      it('should update that lecturer in database', async () => {
        await updateLecturer();

        const lecturer = await lecturerRepository.findById(lecturerId);
        expect(lecturer).toHaveProperty(
          'firstName',
          lecturerDataToUpdate.firstName,
        );
        expect(lecturer).toHaveProperty(
          'lastName',
          lecturerDataToUpdate.lastName,
        );
        expect(lecturer).toHaveProperty('email', lecturerDataToUpdate.email);
        expect(lecturer).toHaveProperty(
          'phoneNumber',
          lecturerDataToUpdate.phoneNumber,
        );
      });

      it('should allow to update lecturer with relations initialized', async () => {
        const group = await createGroup();
        lecturerDataToUpdate.groups = [group.id];

        await updateLecturer();
        const { body } = await getLecturer();

        expect(body).toHaveProperty('groups');
        expect(body.groups.length).toBe(1);
      });
    });

    describe('if lecturer does not exist in database', () => {
      it('should return 404', async () => {
        lecturerId = uuidv4();
        const { status } = await updateLecturer();

        expect(status).toBe(404);
      });
    });

    describe('if invalid id was passed', () => {
      it('should return 400', async () => {
        lecturerId = '1';

        const { status } = await updateLecturer();

        expect(status).toBe(400);
      });
    });

    describe('if invalid data was passed', () => {
      it('should return 400 if invalid id was passed', async () => {
        lecturerId = '1';

        const { status } = await updateLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if first name was not passed', async () => {
        delete lecturerDataToUpdate.firstName;

        const { status } = await updateLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if last name was not passed', async () => {
        delete lecturerDataToUpdate.lastName;

        const { status } = await updateLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if phone number was not passed', async () => {
        delete lecturerDataToUpdate.phoneNumber;

        const { status } = await updateLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if email was not passed', async () => {
        delete lecturerDataToUpdate.email;

        const { status } = await updateLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid email was passed', async () => {
        lecturerDataToUpdate.email = 'abc';

        const { status } = await updateLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if groups were not passed', async () => {
        delete lecturerDataToUpdate.groups;

        const { status } = await updateLecturer();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid group ids were passed', async () => {
        lecturerDataToUpdate.groups = ['1', '2'];

        const { status } = await updateLecturer();

        expect(status).toBe(400);
      });
    });

    const updateLecturer = () => {
      return request(app.getHttpServer())
        .put(`${apiEndpoint}/${lecturerId}`)
        .send(lecturerDataToUpdate);
    };
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
        expect(lecturer).toBeUndefined();
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

  const createGroup = async () => {
    const group = createSampleGroup();
    const { body } = await request(app.getHttpServer())
      .post('/groups')
      .send(group);
    return body;
  };

  const populateDatabase = async () => {
    const lecturer = await lecturerRepository.create(sampleLecturer);
    lecturerId = lecturer.id;
  };
});

import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { ConsultationRepository } from '../../../src/repositories/consultation.repository';
import {
  createSampleStudent,
  createSampleConsultation,
  createSampleLecturer,
} from '../../helpers/models.helpers';
import { expectDatetimesToBeTheSame } from '../../helpers/date.helper';
import '../../../src/utils/extensions/date.extentions';
import { createTestApp } from '../../helpers/app.helper';
import { DatabaseUtility } from '../../helpers/database.helper';

describe('ConsultationsController (e2e)', () => {
  const apiEndpoint = '/consultations';
  let app: INestApplication;
  let consultationRepository: ConsultationRepository;
  let sampleConsultation;
  let consultationId: string;
  let databaseUtility: DatabaseUtility;

  beforeAll(async () => {
    app = await createTestApp();
    loadRepositories();
    databaseUtility = await DatabaseUtility.init();
  });

  const loadRepositories = () => {
    consultationRepository = app.get<ConsultationRepository>(
      ConsultationRepository,
    );
  };

  beforeEach(async () => {
    loadSampleConsultation();
  });

  afterEach(async () => {
    await databaseUtility.cleanDatabase();
  });

  const loadSampleConsultation = () => {
    sampleConsultation = createSampleConsultation();
  };

  afterAll(async () => {
    await app.close();
  });

  describe(`${apiEndpoint} (GET)`, () => {
    let query: string;

    beforeEach(async () => {
      sampleConsultation.datetime = new Date().addHours(1);
      await populateDatabase();
      query = '';
    });

    it('should return 200', async () => {
      const { status } = await getConsultations();

      expect(status).toBe(HttpStatus.OK);
    });

    it('should return all consultations', async () => {
      const { body } = await getConsultations();

      expect(body.length).toBe(1);
    });

    describe('if "between" query was passed', () => {
      it('should return all consultations between two dates if query param was passed', async () => {
        query = `?between[]="${new Date().toUTCString()}"&between[]="${new Date()
          .addHours(2)
          .toUTCString()}"`;

        const { body } = await getConsultations();

        expect(body.length).toBe(1);
      });

      it('should return empty array if there are no consultations between args passed', async () => {
        query = `?between[]="${new Date()
          .addHours(3)
          .toUTCString()}"&between[]="${new Date().addHours(2).toUTCString()}"`;

        const { body } = await getConsultations();

        expect(body.length).toBe(0);
      });
    });

    const getConsultations = () => {
      return request(app.getHttpServer()).get(apiEndpoint + query);
    };
  });

  describe(`${apiEndpoint} (POST)`, () => {
    describe('if valid data was passed', () => {
      it('should return 201', async () => {
        const { status } = await createConsultation();

        expect(status).toBe(HttpStatus.CREATED);
      });

      it('should return consultation', async () => {
        const { body } = await createConsultation();

        expect(body).toHaveProperty('id');
      });

      it('should allow consultation creation with relations initialized', async () => {
        const lecturer = await createLecturer();
        const student = await createStudent();
        sampleConsultation.lecturers = [lecturer.id];
        sampleConsultation.students = [student.id];

        const { body } = await createConsultation();

        expect(body).toHaveProperty('lecturers');
        expect(body.lecturers.length).toBe(1);
        expect(body).toHaveProperty('students');
        expect(body.students.length).toBe(1);
      });
    });

    describe('if invalid data was passed', () => {
      it('should return 400 if date was missing', async () => {
        delete sampleConsultation.datetime;

        const { status } = await createConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid date was passed', async () => {
        sampleConsultation.datetime = 'abc';

        const { status } = await createConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if address was missing', async () => {
        delete sampleConsultation.address;

        const { status } = await createConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if room was missing', async () => {
        delete sampleConsultation.room;

        const { status } = await createConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if students were missing', async () => {
        delete sampleConsultation.students;

        const { status } = await createConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid student ids were passed', async () => {
        sampleConsultation.students = ['1', '2'];

        const { status } = await createConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if ids of non-existing students were passed', async () => {
        sampleConsultation.students = [uuidv4()];

        const { status } = await createConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if lecturers were missing', async () => {
        delete sampleConsultation.lecturers;

        const { status } = await createConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid lecturer ids were passed', async () => {
        sampleConsultation.lecturers = ['1', '2'];

        const { status } = await createConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if ids of non-existing lecturers were passed', async () => {
        sampleConsultation.lecturers = [uuidv4()];

        const { status } = await createConsultation();

        expect(status).toBe(400);
      });
    });

    const createConsultation = () => {
      return request(app.getHttpServer())
        .post(apiEndpoint)
        .send(sampleConsultation);
    };
  });

  describe(`${apiEndpoint}/:id (GET)`, () => {
    describe('if consultation exists in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await getConsultation();

        expect(status).toBe(HttpStatus.OK);
      });

      it('should return consultation', async () => {
        const { body } = await getConsultation();

        expect(body).toHaveProperty('id', consultationId);
        expect(body).toHaveProperty('day', sampleConsultation.day);
        expect(body).toHaveProperty('hour', sampleConsultation.hour);
        expect(body).toHaveProperty('address', sampleConsultation.address);
        expect(body).toHaveProperty('room', sampleConsultation.room);
        expect(body).toHaveProperty(
          'description',
          sampleConsultation.description,
        );
        expect(body).toHaveProperty('datetime');
        expectDatetimesToBeTheSame(body.datetime, sampleConsultation.datetime);
      });
    });

    describe('if consultation does not exist in database', () => {
      it('should return 404', async () => {
        consultationId = uuidv4();

        const { status } = await getConsultation();

        expect(status).toBe(404);
      });
    });

    describe('if id is not valid', () => {
      it('should return 400', async () => {
        consultationId = '1';

        const { status } = await getConsultation();

        expect(status).toBe(400);
      });
    });
  });

  describe(`${apiEndpoint}/:id (PUT)`, () => {
    let consultationDataToUpdate;

    beforeEach(() => {
      loadUpdateData();
    });

    const loadUpdateData = () => {
      consultationDataToUpdate = createSampleConsultation();
    };

    describe('if consultation exist in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await updateConsultation();

        expect(status).toBe(200);
      });

      it('should update that consultation in database', async () => {
        await updateConsultation();

        const { body: consultation } = await getConsultation();

        expect(consultation).toHaveProperty(
          'day',
          consultationDataToUpdate.day,
        );
        expect(consultation).toHaveProperty(
          'hour',
          consultationDataToUpdate.hour,
        );
        expect(consultation).toHaveProperty(
          'address',
          consultationDataToUpdate.address,
        );
        expect(consultation).toHaveProperty(
          'description',
          consultationDataToUpdate.description,
        );
        expect(consultation).toHaveProperty(
          'room',
          consultationDataToUpdate.room,
        );
        expectDatetimesToBeTheSame(
          consultation.datetime,
          consultationDataToUpdate.datetime,
        );
      });

      it('should allow to update relations', async () => {
        const lecturer = await createLecturer();
        const student = await createStudent();
        consultationDataToUpdate.lecturers = [lecturer.id];
        consultationDataToUpdate.students = [student.id];

        await updateConsultation();

        const { body: consultation } = await getConsultation();
        expect(consultation).toHaveProperty('lecturers');
        expect(consultation.lecturers.length).toBe(1);
        expect(consultation).toHaveProperty('students');
        expect(consultation.students.length).toBe(1);
      });
    });

    describe('if consultation does not exist in database', () => {
      it('should return 404', async () => {
        consultationId = uuidv4();
        const { status } = await updateConsultation();

        expect(status).toBe(404);
      });
    });

    describe('if invalid data was passed', () => {
      it('should return 400 if invalid id was passed', async () => {
        consultationId = '1';

        const { status } = await updateConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if date was missing', async () => {
        delete consultationDataToUpdate.datetime;

        const { status } = await updateConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid date was passed', async () => {
        consultationDataToUpdate.datetime = 'abc';

        const { status } = await updateConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if address was missing', async () => {
        delete consultationDataToUpdate.address;

        const { status } = await updateConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if room was missing', async () => {
        delete consultationDataToUpdate.room;

        const { status } = await updateConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if students were missing', async () => {
        delete consultationDataToUpdate.students;

        const { status } = await updateConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid student ids were passed', async () => {
        consultationDataToUpdate.students = ['1', '2'];

        const { status } = await updateConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if ids for non-existing students were passed', async () => {
        consultationDataToUpdate.students = [uuidv4()];

        const { status } = await updateConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if lecturers were missing', async () => {
        delete consultationDataToUpdate.lecturers;

        const { status } = await updateConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid lecturer ids were passed', async () => {
        consultationDataToUpdate.lecturers = ['1', '2'];

        const { status } = await updateConsultation();

        expect(status).toBe(400);
      });

      it('should return 400 if ids for non-existing lecturers were passed', async () => {
        consultationDataToUpdate.lecturers = [uuidv4()];

        const { status } = await updateConsultation();

        expect(status).toBe(400);
      });
    });

    const updateConsultation = () => {
      return request(app.getHttpServer())
        .put(`${apiEndpoint}/${consultationId}`)
        .send(consultationDataToUpdate);
    };
  });

  describe(`${apiEndpoint}/:id (DELETE)`, () => {
    describe('if consultation exists in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await deleteConsultation();

        expect(status).toBe(200);
      });

      it('should remove consultation from database', async () => {
        await deleteConsultation();

        const consultation = await consultationRepository.findById(
          consultationId,
        );
        expect(consultation).toBeUndefined();
      });

      it('should remove only the consultation from database', async () => {
        const consultationsBeforeDeletion = await consultationRepository.findAll();
        await deleteConsultation();
        const consultationsAfterDeletion = await consultationRepository.findAll();

        expect(consultationsBeforeDeletion.length).toBe(
          consultationsAfterDeletion.length + 1,
        );
      });
    });

    describe('if consultation does not exist in database', () => {
      it('should return 404', async () => {
        const { status } = await deleteConsultation();

        expect(status).toBe(404);
      });

      it('shouldnt remove anything', async () => {
        const consultationsBeforeDeletion = await consultationRepository.findAll();
        await deleteConsultation();
        const consultationsAfterDeletion = await consultationRepository.findAll();

        expect(consultationsBeforeDeletion.length).toBe(
          consultationsAfterDeletion.length,
        );
      });
    });

    describe('if id is not valid', () => {
      it('should return 400', async () => {
        consultationId = '1';
        const { status } = await deleteConsultation();

        expect(status).toBe(400);
      });
    });

    const deleteConsultation = () => {
      return request(app.getHttpServer()).delete(
        `${apiEndpoint}/${consultationId}`,
      );
    };
  });

  const getConsultation = () => {
    return request(app.getHttpServer()).get(`${apiEndpoint}/${consultationId}`);
  };

  const createLecturer = async () => {
    const lecturer = createSampleLecturer();
    const { body } = await request(app.getHttpServer())
      .post('/lecturers')
      .send(lecturer);
    return body;
  };

  const createStudent = async () => {
    const student = createSampleStudent();
    const { body } = await request(app.getHttpServer())
      .post('/students')
      .send(student);
    return body;
  };

  const populateDatabase = async () => {
    const consultation = await consultationRepository.create(
      sampleConsultation,
    );
    consultationId = consultation.id;
  };
});

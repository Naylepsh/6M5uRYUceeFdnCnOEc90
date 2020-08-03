import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AppModule } from '../../src/app.module';
import { LecturerRepository } from '../../src/repositories/lecturer.repository';
import { ConsultationRepository } from '../../src/repositories/consultation.repository';
import { StudentRepository } from '../../src/repositories/student.repository';
import {
  createSampleStudent,
  createSampleConsultation,
} from '../helpers/models.helpers';
import { expectDatetimesToBeTheSame } from '../helpers/date.helper';

describe('ConsultationsController (e2e)', () => {
  let app: INestApplication;
  const apiEndpoint = '/consultations';
  let lecturerRepository: LecturerRepository;
  let studentRepository: StudentRepository;
  let consultationRepository: ConsultationRepository;
  let sampleConsultation;
  let consultationId: string;

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
    studentRepository = new StudentRepository();
    consultationRepository = new ConsultationRepository();
  };

  beforeEach(async () => {
    await cleanDatabase();
    loadSampleConsultation();
  });

  const loadSampleConsultation = () => {
    sampleConsultation = createSampleConsultation();
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
      const { status } = await getConsultations();

      expect(status).toBe(HttpStatus.OK);
    });

    it('should return all consultations', async () => {
      const { body } = await getConsultations();

      expect(body.length).toBe(1);
    });

    const getConsultations = () => {
      return request(app.getHttpServer()).get(apiEndpoint);
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

    describe('if invalid id was passed', () => {
      it('should return 400', async () => {
        consultationId = '1';

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

        const lecturer = await lecturerRepository.findById(consultationId);
        expect(lecturer).toBeNull();
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

  const createLecturer = () => {
    const lecturer = {
      firstName: 'john',
      lastName: 'doe',
      email: 'example@mail.com',
      phoneNumber: '123456789',
      consultations: [],
      groups: [],
    };
    return lecturerRepository.create(lecturer);
  };

  const createStudent = () => {
    const student = createSampleStudent();
    return studentRepository.create(student);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const date = `${today.getFullYear()}-${today.getMonth() +
      1}-${today.getDate()}`;
    return date;
  };

  const populateDatabase = async () => {
    const consultation = await consultationRepository.create(
      sampleConsultation,
    );
    consultationId = consultation.id;
  };
});

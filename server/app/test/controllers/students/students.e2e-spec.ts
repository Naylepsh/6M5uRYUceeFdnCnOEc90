import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AppModule } from '../../../src/app.module';
import { StudentRepository } from '../../../src/repositories/student.repository';
import { GroupRepository } from '../../../src/repositories/group.repository';
import { ParentRepository } from '../../../src/repositories/parent.repository';
import {
  createSampleParent,
  createSampleGroup,
  createSampleStudent,
} from '../../helpers/models.helpers';
import { ValidationPipe } from '../../../src/pipes/validation.pipe';

describe('StudentsController (e2e)', () => {
  let app: INestApplication;
  const apiEndpoint = '/students';
  let studentRepository: StudentRepository;
  let groupRepository: GroupRepository;
  let parentRepository: ParentRepository;
  let sampleStudent;
  let studentId: string;

  beforeAll(async () => {
    await loadApp();
    loadRepositories();
  });

  const loadApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  };

  const loadRepositories = () => {
    studentRepository = new StudentRepository();
    groupRepository = new GroupRepository();
    parentRepository = new ParentRepository();
  };

  beforeEach(async () => {
    await cleanDatabase();
    loadSampleStudent();
  });

  const loadSampleStudent = () => {
    sampleStudent = createSampleStudent();
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
      const { status } = await getStudents();

      expect(status).toBe(HttpStatus.OK);
    });

    it('should return all students', async () => {
      const { body } = await getStudents();

      expect(body.length).toBe(1);
    });

    const getStudents = () => {
      return request(app.getHttpServer()).get(apiEndpoint);
    };
  });

  describe(`${apiEndpoint} (POST)`, () => {
    describe('if valid data was passed', () => {
      it('should return 201', async () => {
        const { status } = await createStudent();

        expect(status).toBe(HttpStatus.CREATED);
      });

      it('should return student', async () => {
        const { body } = await createStudent();

        expect(body).toHaveProperty('id');
      });

      it('should allow student creation with relations initialized', async () => {
        const group = await createGroup();
        sampleStudent.groups = [group.id];
        const parent = await createParent();
        sampleStudent.parents = [parent.id];

        const { body } = await createStudent();

        expect(body).toHaveProperty('groups');
        expect(body.groups.length).toBe(1);
        expect(body).toHaveProperty('parents');
        expect(body.parents.length).toBe(1);
      });
    });

    describe('if invalid data was passed', () => {
      it('should return 400 if first name was not passed', async () => {
        delete sampleStudent.firstName;

        const { status } = await createStudent();

        expect(status).toBe(400);
      });

      it('should return 400 if last name was not passed', async () => {
        delete sampleStudent.lastName;

        const { status } = await createStudent();

        expect(status).toBe(400);
      });

      it('should return 400 if groups were not passed', async () => {
        delete sampleStudent.groups;

        const { status } = await createStudent();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid group ids were passed', async () => {
        sampleStudent.groups = ['1', '2'];

        const { status } = await createStudent();

        expect(status).toBe(400);
      });

      it('should return 400 if parents were not passed', async () => {
        delete sampleStudent.parents;

        const { status } = await createStudent();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid parent ids were passed', async () => {
        sampleStudent.parents = ['1', '2'];

        const { status } = await createStudent();

        expect(status).toBe(400);
      });
    });

    const createStudent = () => {
      return request(app.getHttpServer())
        .post(apiEndpoint)
        .send(sampleStudent);
    };
  });

  describe(`${apiEndpoint}/:id (GET)`, () => {
    describe('if student exists in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await getStudent();

        expect(status).toBe(HttpStatus.OK);
      });

      it('should return student', async () => {
        const { body } = await getStudent();

        expect(body).toHaveProperty('id', studentId);
        expect(body).toHaveProperty('firstName', sampleStudent.firstName);
        expect(body).toHaveProperty('lastName', sampleStudent.lastName);
      });
    });

    describe('if student does not exist in database', () => {
      it('should return 404', async () => {
        studentId = uuidv4();

        const { status } = await getStudent();

        expect(status).toBe(404);
      });
    });

    describe('if id is not valid', () => {
      it('should return 400', async () => {
        studentId = '1';

        const { status } = await getStudent();

        expect(status).toBe(400);
      });
    });
  });

  describe(`${apiEndpoint}/:id (PUT)`, () => {
    let studentDataToUpdate;

    beforeEach(() => {
      loadUpdateData();
    });

    const loadUpdateData = () => {
      studentDataToUpdate = createSampleStudent();
    };

    describe('if student exist in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });
      it('should return 200', async () => {
        const { status } = await updateStudent();

        expect(status).toBe(200);
      });

      it('should update that student in database', async () => {
        await updateStudent();

        const student = await studentRepository.findById(studentId);
        expect(student).toHaveProperty(
          'firstName',
          studentDataToUpdate.firstName,
        );
        expect(student).toHaveProperty(
          'lastName',
          studentDataToUpdate.lastName,
        );
      });

      it('should allow to update relations', async () => {
        const group = await createGroup();
        studentDataToUpdate.groups = [group.id];
        const parent = await createParent();
        studentDataToUpdate.parents = [parent.id];

        await updateStudent();
        const { body } = await getStudent();

        expect(body).toHaveProperty('groups');
        expect(body.groups.length).toBe(1);
        expect(body).toHaveProperty('parents');
        expect(body.parents.length).toBe(1);
      });
    });

    describe('if student does not exist in database', () => {
      it('should return 404', async () => {
        studentId = uuidv4();
        const { status } = await updateStudent();

        expect(status).toBe(404);
      });
    });

    describe('if invalid data was passed', () => {
      it('should return 400 if invalid id was passed', async () => {
        studentId = '1';

        const { status } = await updateStudent();

        expect(status).toBe(400);
      });

      it('should return 400 if first name was not passed', async () => {
        delete studentDataToUpdate.firstName;

        const { status } = await updateStudent();

        expect(status).toBe(400);
      });

      it('should return 400 if last name was not passed', async () => {
        delete studentDataToUpdate.lastName;

        const { status } = await updateStudent();

        expect(status).toBe(400);
      });

      it('should return 400 if groups were not passed', async () => {
        delete studentDataToUpdate.groups;

        const { status } = await updateStudent();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid group ids were passed', async () => {
        studentDataToUpdate.groups = ['1', '2'];

        const { status } = await updateStudent();

        expect(status).toBe(400);
      });

      it('should return 400 if parents were not passed', async () => {
        delete studentDataToUpdate.parents;

        const { status } = await updateStudent();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid parent ids were passed', async () => {
        studentDataToUpdate.parents = ['1', '2'];

        const { status } = await updateStudent();

        expect(status).toBe(400);
      });
    });

    const updateStudent = () => {
      return request(app.getHttpServer())
        .put(`${apiEndpoint}/${studentId}`)
        .send(studentDataToUpdate);
    };
  });

  describe(`${apiEndpoint}/:id (DELETE)`, () => {
    describe('if student exists in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await deleteStudent();

        expect(status).toBe(200);
      });

      it('should remove student from database', async () => {
        await deleteStudent();

        const student = await studentRepository.findById(studentId);
        expect(student).toBeNull();
      });

      it('should remove only the student from database', async () => {
        const studentsBeforeDeletion = await studentRepository.findAll();
        await deleteStudent();
        const studentsAfterDeletion = await studentRepository.findAll();

        expect(studentsBeforeDeletion.length).toBe(
          studentsAfterDeletion.length + 1,
        );
      });
    });

    describe('if student does not exist in database', () => {
      it('should return 404', async () => {
        const { status } = await deleteStudent();

        expect(status).toBe(404);
      });

      it('shouldnt remove anything', async () => {
        const studentsBeforeDeletion = await studentRepository.findAll();
        await deleteStudent();
        const studentsAfterDeletion = await studentRepository.findAll();

        expect(studentsBeforeDeletion.length).toBe(
          studentsAfterDeletion.length,
        );
      });
    });

    describe('if id is not valid', () => {
      it('should return 400', async () => {
        studentId = '1';
        const { status } = await deleteStudent();

        expect(status).toBe(400);
      });
    });

    const deleteStudent = () => {
      return request(app.getHttpServer()).delete(`${apiEndpoint}/${studentId}`);
    };
  });

  const getStudent = () => {
    return request(app.getHttpServer()).get(`${apiEndpoint}/${studentId}`);
  };

  const createGroup = () => {
    const group = createSampleGroup();
    return groupRepository.create(group);
  };

  const createParent = () => {
    const parent = createSampleParent();
    return parentRepository.create(parent);
  };

  const populateDatabase = async () => {
    const student = await studentRepository.create(sampleStudent);
    studentId = student.id;
  };
});

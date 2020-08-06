import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AppModule } from '../../../src/app.module';
import { ParentRepository } from '../../../src/repositories/parent.repository';
import { StudentRepository } from '../../../src/repositories/student.repository';
import {
  createSampleStudent,
  createSampleParent,
} from '../../helpers/models.helpers';
import { ValidationPipe } from '../../../src/pipes/validation.pipe';

describe('ParentsController (e2e)', () => {
  let app: INestApplication;
  const apiEndpoint = '/parents';
  let parentRepository: ParentRepository;
  let studentRepository: StudentRepository;
  let sampleParent;
  let parentId: string;

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
    parentRepository = new ParentRepository();
    studentRepository = new StudentRepository();
  };

  beforeEach(async () => {
    await cleanDatabase();
    loadSampleParent();
  });

  const loadSampleParent = () => {
    sampleParent = createSampleParent();
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
      const { status } = await getParents();

      expect(status).toBe(HttpStatus.OK);
    });

    it('should return all parents', async () => {
      const { body } = await getParents();

      expect(body.length).toBe(1);
    });

    const getParents = () => {
      return request(app.getHttpServer()).get(apiEndpoint);
    };
  });

  describe(`${apiEndpoint} (POST)`, () => {
    describe('if valid data was passed', () => {
      it('should return 201', async () => {
        const { status } = await createParent();

        expect(status).toBe(HttpStatus.CREATED);
      });

      it('should return parent', async () => {
        const { body } = await createParent();

        expect(body).toHaveProperty('id');
      });

      it('should allow parent creation with children initialized', async () => {
        const child = await createStudent();
        loadSampleParent();
        sampleParent.children = [child.id];

        const { body } = await createParent();

        expect(body).toHaveProperty('children');
        expect(body.children.length).toBe(1);
      });
    });

    describe('if invalid data was passed', () => {
      it('should return 400 if first name was not passed', async () => {
        delete sampleParent.firstName;

        const { status } = await createParent();

        expect(status).toBe(400);
      });

      it('should return 400 if last name was not passed', async () => {
        delete sampleParent.lastName;

        const { status } = await createParent();

        expect(status).toBe(400);
      });

      it('should return 400 if phone number was not passed', async () => {
        delete sampleParent.phoneNumber;

        const { status } = await createParent();

        expect(status).toBe(400);
      });

      it('should return 400 if email was not passed', async () => {
        delete sampleParent.email;

        const { status } = await createParent();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid email was passed', async () => {
        sampleParent.email = 'abc';

        const { status } = await createParent();

        expect(status).toBe(400);
      });

      it('should return 400 if children were not passed', async () => {
        delete sampleParent.children;

        const { status } = await createParent();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid children ids were passed', async () => {
        sampleParent.children = ['1', '2'];

        const { status } = await createParent();

        expect(status).toBe(400);
      });
    });

    const createParent = () => {
      return request(app.getHttpServer())
        .post(apiEndpoint)
        .send(sampleParent);
    };
  });

  describe(`${apiEndpoint}/:id (GET)`, () => {
    describe('if parent exists in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await getParent();

        expect(status).toBe(HttpStatus.OK);
      });

      it('should return parent', async () => {
        const { body } = await getParent();

        expect(body).toHaveProperty('id', parentId);
        expect(body).toHaveProperty('firstName', sampleParent.firstName);
        expect(body).toHaveProperty('lastName', sampleParent.lastName);
        expect(body).toHaveProperty('email', sampleParent.email);
        expect(body).toHaveProperty('phoneNumber', sampleParent.phoneNumber);
      });
    });

    describe('if parent does not exist in database', () => {
      it('should return 404', async () => {
        parentId = uuidv4();

        const { status } = await getParent();

        expect(status).toBe(404);
      });
    });

    describe('if id is not valid', () => {
      it('should return 400', async () => {
        parentId = '1';

        const { status } = await getParent();

        expect(status).toBe(400);
      });
    });
  });

  describe(`${apiEndpoint}/:id (PUT)`, () => {
    let parentDataToUpdate;

    beforeEach(() => {
      loadUpdateData();
    });

    const loadUpdateData = () => {
      parentDataToUpdate = createSampleParent();
    };

    describe('if parent exist in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await updateParent();

        expect(status).toBe(200);
      });

      it('should update that parent in database', async () => {
        await updateParent();

        const parent = await parentRepository.findById(parentId);
        expect(parent).toHaveProperty(
          'firstName',
          parentDataToUpdate.firstName,
        );
        expect(parent).toHaveProperty('lastName', parentDataToUpdate.lastName);
        expect(parent).toHaveProperty('email', parentDataToUpdate.email);
        expect(parent).toHaveProperty(
          'phoneNumber',
          parentDataToUpdate.phoneNumber,
        );
      });

      it('should allow to update relations', async () => {
        const child = await createStudent();
        parentDataToUpdate.children = [child.id];

        await updateParent();

        const { body } = await getParent();

        expect(body).toHaveProperty('children');
        expect(body.children.length).toBe(1);
      });
    });

    describe('if parent does not exist in database', () => {
      it('should return 404', async () => {
        parentId = uuidv4();
        const { status } = await updateParent();

        expect(status).toBe(404);
      });
    });

    describe('if invalid id was passed', () => {
      it('should return 400', async () => {
        parentId = '1';

        const { status } = await updateParent();

        expect(status).toBe(400);
      });
    });

    describe('if invalid data was passed', () => {
      it('should return 400 if invalid id was passed', async () => {
        parentId = '1';

        const { status } = await updateParent();

        expect(status).toBe(400);
      });

      it('should return 400 if first name was not passed', async () => {
        delete parentDataToUpdate.firstName;

        const { status } = await updateParent();

        expect(status).toBe(400);
      });

      it('should return 400 if last name was not passed', async () => {
        delete parentDataToUpdate.lastName;

        const { status } = await updateParent();

        expect(status).toBe(400);
      });

      it('should return 400 if phone number was not passed', async () => {
        delete parentDataToUpdate.phoneNumber;

        const { status } = await updateParent();

        expect(status).toBe(400);
      });

      it('should return 400 if email was not passed', async () => {
        delete parentDataToUpdate.email;

        const { status } = await updateParent();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid email was passed', async () => {
        parentDataToUpdate.email = 'abc';

        const { status } = await updateParent();

        expect(status).toBe(400);
      });

      it('should return 400 if children were not passed', async () => {
        delete parentDataToUpdate.children;

        const { status } = await updateParent();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid children ids were passed', async () => {
        parentDataToUpdate.children = ['1', '2'];

        const { status } = await updateParent();

        expect(status).toBe(400);
      });
    });

    const updateParent = () => {
      return request(app.getHttpServer())
        .put(`${apiEndpoint}/${parentId}`)
        .send(parentDataToUpdate);
    };
  });

  describe(`${apiEndpoint}/:id (DELETE)`, () => {
    describe('if parent exists in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await deleteParent();

        expect(status).toBe(200);
      });

      it('should remove parent from database', async () => {
        await deleteParent();

        const parent = await parentRepository.findById(parentId);
        expect(parent).toBeNull();
      });

      it('should remove only the parent from database', async () => {
        const parentsBeforeDeletion = await parentRepository.findAll();
        await deleteParent();
        const parentsAfterDeletion = await parentRepository.findAll();

        expect(parentsBeforeDeletion.length).toBe(
          parentsAfterDeletion.length + 1,
        );
      });
    });

    describe('if parent does not exist in database', () => {
      it('should return 404', async () => {
        const { status } = await deleteParent();

        expect(status).toBe(404);
      });

      it('shouldnt remove anything', async () => {
        const parentsBeforeDeletion = await parentRepository.findAll();
        await deleteParent();
        const parentsAfterDeletion = await parentRepository.findAll();

        expect(parentsBeforeDeletion.length).toBe(parentsAfterDeletion.length);
      });
    });

    describe('if id is not valid', () => {
      it('should return 400', async () => {
        parentId = '1';
        const { status } = await deleteParent();

        expect(status).toBe(400);
      });
    });

    const deleteParent = () => {
      return request(app.getHttpServer()).delete(`${apiEndpoint}/${parentId}`);
    };
  });

  const getParent = () => {
    return request(app.getHttpServer()).get(`${apiEndpoint}/${parentId}`);
  };

  const createStudent = () => {
    const student = createSampleStudent();
    return studentRepository.create(student);
  };

  const populateDatabase = async () => {
    const parent = await parentRepository.create(sampleParent);
    parentId = parent.id;
  };
});

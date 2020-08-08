import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { GroupRepository } from '../../../src/repositories/group.repository';
import { expectDatesToBeTheSame } from '../../helpers/date.helper';
import {
  createSampleGroup,
  createSampleStudent,
  createSampleLecturer,
} from '../../helpers/models.helpers';
import { createTestApp } from '../../helpers/app.helper';
import { DatabaseUtility } from '../../helpers/database.helper';
import { getConnection } from 'typeorm';

describe('GroupsController (e2e)', () => {
  let app: INestApplication;
  const apiEndpoint = '/groups';
  let groupRepository: GroupRepository;
  let sampleGroup;
  let groupId: string;
  let databaseUtility: DatabaseUtility;

  beforeAll(async () => {
    app = await createTestApp();
    loadRepositories();
    databaseUtility = await DatabaseUtility.init();
  });

  const loadRepositories = () => {
    groupRepository = new GroupRepository(getConnection());
  };

  beforeEach(() => {
    loadSampleGroup();
  });

  afterEach(async () => {
    await databaseUtility.cleanDatabase();
  });

  const loadSampleGroup = () => {
    sampleGroup = createSampleGroup();
  };

  afterAll(async () => {
    await app.close();
  });

  describe(`${apiEndpoint} (GET)`, () => {
    beforeEach(async () => {
      await populateDatabase();
    });

    it('should return 200', async () => {
      const { status } = await getGroups();

      expect(status).toBe(HttpStatus.OK);
    });

    it('should return all groups', async () => {
      const { body } = await getGroups();

      expect(body.length).toBe(1);
    });

    const getGroups = () => {
      return request(app.getHttpServer()).get(apiEndpoint);
    };
  });

  describe(`${apiEndpoint} (POST)`, () => {
    describe('if valid data was passed', () => {
      it('should return 201', async () => {
        const { status } = await createGroup();

        expect(status).toBe(HttpStatus.CREATED);
      });

      it('should return group', async () => {
        const { body } = await createGroup();

        expect(body).toHaveProperty('id');
      });

      it('should allow group creation with relations initialized', async () => {
        const lecturer = await createLecturer();
        const student = await createStudent();
        sampleGroup.lecturers = [lecturer.id];
        sampleGroup.students = [student.id];

        const { body } = await createGroup();

        expect(body).toHaveProperty('lecturers');
        expect(body.lecturers.length).toBe(1);
        expect(body).toHaveProperty('students');
        expect(body.students.length).toBe(1);
      });
    });

    describe('if invalid data was passed', () => {
      it('should return 400 if day was not passed', async () => {
        delete sampleGroup.day;

        const { status } = await createGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if time was not passed', async () => {
        delete sampleGroup.time;

        const { status } = await createGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if address was not passed', async () => {
        delete sampleGroup.address;

        const { status } = await createGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if room was not passed', async () => {
        delete sampleGroup.room;

        const { status } = await createGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if startDate was not passed', async () => {
        delete sampleGroup.startDate;

        const { status } = await createGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if endDate was not passed', async () => {
        delete sampleGroup.endDate;

        const { status } = await createGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if lecturers were not passed', async () => {
        delete sampleGroup.lecturers;

        const { status } = await createGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid lecturer ids was passed', async () => {
        sampleGroup.lecturers = ['1', '2'];

        const { status } = await createGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if students were not passed', async () => {
        delete sampleGroup.students;

        const { status } = await createGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid student ids was passed', async () => {
        sampleGroup.students = ['1', '2'];

        const { status } = await createGroup();

        expect(status).toBe(400);
      });
    });

    const createGroup = () => {
      return request(app.getHttpServer())
        .post(apiEndpoint)
        .send(sampleGroup);
    };
  });

  describe(`${apiEndpoint}/:id (GET)`, () => {
    describe('if group exists in database', () => {
      beforeEach(async () => {
        loadSampleGroup();
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await getGroup();

        expect(status).toBe(HttpStatus.OK);
      });

      it('should return group', async () => {
        const { body } = await getGroup();

        expect(body).toHaveProperty('id', groupId);
        expect(body).toHaveProperty('day', sampleGroup.day);
        expect(body).toHaveProperty('hour', sampleGroup.hour);
        expect(body).toHaveProperty('address', sampleGroup.address);
        expect(body).toHaveProperty('room', sampleGroup.room);
        expect(body).toHaveProperty('startDate');
        expect(body).toHaveProperty('endDate');
        expectDatesToBeTheSame(body.startDate, sampleGroup.startDate);
        expectDatesToBeTheSame(body.endDate, sampleGroup.endDate);
      });
    });

    describe('if group does not exist in database', () => {
      it('should return 404', async () => {
        groupId = uuidv4();

        const { status } = await getGroup();

        expect(status).toBe(404);
      });
    });

    describe('if id is not valid', () => {
      it('should return 400', async () => {
        groupId = '1';

        const { status } = await getGroup();

        expect(status).toBe(400);
      });
    });
  });

  describe(`${apiEndpoint}/:id (PUT)`, () => {
    let groupDataToUpdate;

    beforeEach(() => {
      loadUpdateData();
    });

    const loadUpdateData = () => {
      groupDataToUpdate = createSampleGroup();
    };

    describe('if group exist in database', () => {
      beforeEach(async () => {
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await updateGroup();

        expect(status).toBe(200);
      });

      it('should update that group in database', async () => {
        await updateGroup();

        const group = await groupRepository.findById(groupId);

        expect(group).toHaveProperty('day', groupDataToUpdate.day);
        expect(group).toHaveProperty('hour', groupDataToUpdate.hour);
        expect(group).toHaveProperty('address', groupDataToUpdate.address);
        expect(group).toHaveProperty('room', groupDataToUpdate.room);
        expect(group).toHaveProperty('startDate');
        expectDatesToBeTheSame(group.startDate, groupDataToUpdate.startDate);
        expect(group).toHaveProperty('endDate');
        expectDatesToBeTheSame(group.endDate, groupDataToUpdate.endDate);
      });

      it('should allow to update relations', async () => {
        const lecturer = await createLecturer();
        const student = await createStudent();
        groupDataToUpdate.lecturers = [lecturer.id];
        groupDataToUpdate.students = [student.id];

        await updateGroup();

        const { body: group } = await getGroup();
        expect(group).toHaveProperty('lecturers');
        expect(group.lecturers.length).toBe(1);
        expect(group).toHaveProperty('students');
        expect(group.students.length).toBe(1);
      });
    });

    describe('if group does not exist in database', () => {
      it('should return 404', async () => {
        groupId = uuidv4();
        const { status } = await updateGroup();

        expect(status).toBe(404);
      });
    });

    describe('if invalid data was passed', () => {
      it('should return 400 if invalid id was passed', async () => {
        groupId = '1';

        const { status } = await updateGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if day was not passed', async () => {
        delete groupDataToUpdate.day;

        const { status } = await updateGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if time was not passed', async () => {
        delete groupDataToUpdate.time;

        const { status } = await updateGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if address was not passed', async () => {
        delete groupDataToUpdate.address;

        const { status } = await updateGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if room was not passed', async () => {
        delete groupDataToUpdate.room;

        const { status } = await updateGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if startDate was not passed', async () => {
        delete groupDataToUpdate.startDate;

        const { status } = await updateGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if endDate was not passed', async () => {
        delete groupDataToUpdate.endDate;

        const { status } = await updateGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if lecturers were not passed', async () => {
        delete groupDataToUpdate.lecturers;

        const { status } = await updateGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid lecturer ids was passed', async () => {
        groupDataToUpdate.lecturers = ['1', '2'];

        const { status } = await updateGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if students were not passed', async () => {
        delete groupDataToUpdate.students;

        const { status } = await updateGroup();

        expect(status).toBe(400);
      });

      it('should return 400 if invalid student ids was passed', async () => {
        groupDataToUpdate.students = ['1', '2'];

        const { status } = await updateGroup();

        expect(status).toBe(400);
      });
    });

    const updateGroup = () => {
      return request(app.getHttpServer())
        .put(`${apiEndpoint}/${groupId}`)
        .send(groupDataToUpdate);
    };
  });

  describe(`${apiEndpoint}/:id (DELETE)`, () => {
    describe('if group exists in database', () => {
      beforeEach(async () => {
        loadSampleGroup();
        await populateDatabase();
      });

      it('should return 200', async () => {
        const { status } = await deleteGroup();

        expect(status).toBe(200);
      });

      it('should remove group from database', async () => {
        await deleteGroup();

        const group = await groupRepository.findById(groupId);
        expect(group).toBeUndefined();
      });

      it('should remove only the group from database', async () => {
        const groupsBeforeDeletion = await groupRepository.findAll();
        await deleteGroup();
        const groupsAfterDeletion = await groupRepository.findAll();

        expect(groupsBeforeDeletion.length).toBe(
          groupsAfterDeletion.length + 1,
        );
      });
    });

    describe('if group does not exist in database', () => {
      it('should return 404', async () => {
        const { status } = await deleteGroup();

        expect(status).toBe(404);
      });

      it('shouldnt remove anything', async () => {
        const groupsBeforeDeletion = await groupRepository.findAll();
        await deleteGroup();
        const groupsAfterDeletion = await groupRepository.findAll();

        expect(groupsBeforeDeletion.length).toBe(groupsAfterDeletion.length);
      });
    });

    describe('if id is not valid', () => {
      it('should return 400', async () => {
        groupId = '1';
        const { status } = await deleteGroup();

        expect(status).toBe(400);
      });
    });

    const deleteGroup = () => {
      return request(app.getHttpServer()).delete(`${apiEndpoint}/${groupId}`);
    };
  });

  const getGroup = () => {
    return request(app.getHttpServer()).get(`${apiEndpoint}/${groupId}`);
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
    const { body: group } = await request(app.getHttpServer())
      .post(apiEndpoint)
      .send(sampleGroup);
    groupId = group.id;
  };
});
